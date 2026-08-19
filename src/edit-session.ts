import {
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
  REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE,
  REACT_GRAB_INPUT_ATTRIBUTE,
  SUCCESS_FLASH_DURATION_MS,
} from "./constants.js";
import type {
  EditResult,
  EditSessionHandle,
  EditSessionOptions,
  EditSource,
  Position,
} from "./types.js";
import { buildEditPayload } from "./build-edit-payload.js";
import { buildElementPreview } from "./utils/build-element-preview.js";
import { caretRangeFromPoint } from "./utils/caret-range-from-point.js";
import { copyTextToClipboard } from "./utils/copy-text-to-clipboard.js";
import { createHintPill, type HintPill } from "./utils/create-hint-pill.js";
import { ensureStyleSheet } from "./utils/ensure-style-sheet.js";

interface SessionInternals {
  element: HTMLElement;
  commit: (options?: { quiet?: boolean }) => Promise<EditResult | null>;
  cancel: () => void;
}

let activeSession: EditSessionHandle | null = null;
let activeInternals: SessionInternals | null = null;
let guardInstallCount = 0;
let areGuardsPermanentlyInstalled = false;

export const getActiveEditSession = (): EditSessionHandle | null => activeSession;

const placeCaret = (element: HTMLElement, caretPoint?: Position): void => {
  const selection = window.getSelection();
  if (!selection) return;
  if (caretPoint) {
    const pointRange = caretRangeFromPoint(caretPoint.x, caretPoint.y);
    if (pointRange && element.contains(pointRange.startContainer)) {
      selection.removeAllRanges();
      selection.addRange(pointRange);
      return;
    }
  }
  const endRange = document.createRange();
  endRange.selectNodeContents(element);
  endRange.collapse(false);
  selection.removeAllRanges();
  selection.addRange(endRange);
};

const clearSelectionInside = (element: HTMLElement): void => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return;
  if (element.contains(selection.anchorNode)) selection.removeAllRanges();
};

const pendingFlashTimers = new WeakMap<HTMLElement, { frame: number; timeout: number }>();

const cancelPendingFlash = (element: HTMLElement): void => {
  const pending = pendingFlashTimers.get(element);
  if (!pending) return;
  cancelAnimationFrame(pending.frame);
  window.clearTimeout(pending.timeout);
  pendingFlashTimers.delete(element);
};

const flashElement = (element: HTMLElement): void => {
  cancelPendingFlash(element);
  element.setAttribute(FLASH_ATTRIBUTE, "true");
  const frame = requestAnimationFrame(() => {
    const innerFrame = requestAnimationFrame(() => {
      element.setAttribute(FLASH_ATTRIBUTE, "fading");
    });
    const pending = pendingFlashTimers.get(element);
    if (pending) pending.frame = innerFrame;
  });
  const timeout = window.setTimeout(() => {
    element.removeAttribute(FLASH_ATTRIBUTE);
    pendingFlashTimers.delete(element);
  }, SUCCESS_FLASH_DURATION_MS);
  pendingFlashTimers.set(element, { frame, timeout });
};

// react-grab patches KeyboardEvent.prototype.key to return "" for events it
// claims, so key alone is not a reliable Enter check while its overlay is up.
const isEnterKey = (event: KeyboardEvent): boolean =>
  event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter";

// Resolution starts at session start and is read synchronously at commit, so
// the clipboard write stays inside the committing keystroke's task and never
// waits on source resolution.
const createSourceSnapshot = (
  fallback: EditSource,
  resolveSource?: () => Promise<EditSource>,
): (() => EditSource) => {
  let resolved = fallback;
  resolveSource?.()
    .then((value) => {
      resolved = value;
    })
    .catch(() => undefined);
  return () => resolved;
};

const isEventInsideActiveSession = (event: Event): boolean => {
  const internals = activeInternals;
  if (!internals) return false;
  const target = event.composedPath()[0] ?? event.target;
  return target instanceof Node && internals.element.contains(target);
};

const guardKeyDown = (event: KeyboardEvent): void => {
  const internals = activeInternals;
  if (!internals) return;
  if (event.isComposing || event.keyCode === 229) return;
  const isInsideSession = isEventInsideActiveSession(event);
  // Escape inside the session cancels it and goes no further. An Escape
  // originating elsewhere (host modal, find bar, moved focus) must neither
  // destroy the typed edit nor be swallowed — commit and let the host's own
  // Escape handling proceed.
  if (event.key === "Escape") {
    if (isInsideSession) {
      event.preventDefault();
      event.stopImmediatePropagation();
      internals.cancel();
    } else {
      void internals.commit();
    }
    return;
  }
  if (!isInsideSession) return;
  if (isEnterKey(event) && !event.shiftKey) {
    event.preventDefault();
    event.stopImmediatePropagation();
    void internals.commit();
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    event.stopImmediatePropagation();
    void internals.commit();
    return;
  }
  // Insulate the edit from host-app hotkeys; the default action (typing) is
  // unaffected by stopping propagation.
  event.stopImmediatePropagation();
};

const guardKeyStop = (event: KeyboardEvent): void => {
  if (isEventInsideActiveSession(event)) event.stopImmediatePropagation();
};

const guardPointerDown = (event: PointerEvent): void => {
  const internals = activeInternals;
  if (!internals) return;
  const target = event.composedPath()[0] ?? event.target;
  if (!(target instanceof Node)) return;
  if (internals.element.contains(target)) return;
  void internals.commit();
};

// addEventListener with identical handler refs and options is idempotent, so
// repeated installs never duplicate listeners.
const addGuardListeners = (): void => {
  window.addEventListener("keydown", guardKeyDown, { capture: true });
  window.addEventListener("keyup", guardKeyStop, { capture: true });
  window.addEventListener("keypress", guardKeyStop, { capture: true });
  window.addEventListener("pointerdown", guardPointerDown, { capture: true });
};

const removeGuardListeners = (): void => {
  window.removeEventListener("keydown", guardKeyDown, { capture: true });
  window.removeEventListener("keyup", guardKeyStop, { capture: true });
  window.removeEventListener("keypress", guardKeyStop, { capture: true });
  window.removeEventListener("pointerdown", guardPointerDown, { capture: true });
};

// Same-phase listeners run in registration order, so the guards must register
// BEFORE the host app's hydration-time listeners or the app's own hotkeys
// (space = play/pause, etc.) fire on keys typed inside an edit. The plugin
// installs them at setup, which runs at react-grab init — pre-hydration.
export const installEditSessionGuards = (): (() => void) => {
  guardInstallCount += 1;
  addGuardListeners();
  let didUninstall = false;
  return () => {
    if (didUninstall) return;
    didUninstall = true;
    guardInstallCount -= 1;
    if (guardInstallCount === 0 && !areGuardsPermanentlyInstalled) removeGuardListeners();
  };
};

const ensureGuardsInstalled = (): void => {
  if (guardInstallCount > 0 || areGuardsPermanentlyInstalled) return;
  areGuardsPermanentlyInstalled = true;
  addGuardListeners();
};

export const startEditSession = (options: EditSessionOptions): EditSessionHandle => {
  // Teardown inside commit is synchronous, so the prior session is fully
  // detached (and its typed edit preserved) before this one touches the DOM.
  // Quiet skips the predecessor's status pill.
  void activeSession?.commit({ quiet: true });
  ensureGuardsInstalled();

  const { element, source, resolveSource, caretPoint, onFinish } = options;

  ensureStyleSheet();
  cancelPendingFlash(element);
  element.removeAttribute(FLASH_ATTRIBUTE);

  const beforeHtml = element.innerHTML;
  const beforeText = element.innerText;
  const elementPreview = buildElementPreview(element, beforeText);
  const computedStyle = getComputedStyle(element);
  const appliedTextTransform = computedStyle.textTransform;
  // In preformatted content boundary whitespace is a real, visible edit, so
  // the trim-based no-op classification must not apply there.
  const preservesWhitespace = computedStyle.whiteSpace.startsWith("pre");
  const readResolvedSource = createSourceSnapshot(source, resolveSource);
  const previousContentEditable = element.getAttribute("contenteditable");
  const didHaveIgnoreEvents = element.hasAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE);
  const previousActiveElement = document.activeElement;
  const startRect = element.getBoundingClientRect();
  let isSessionActive = true;

  const handlePaste = (event: ClipboardEvent): void => {
    if (element.getAttribute("contenteditable") !== "true") return;
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text/plain");
    if (pastedText) document.execCommand("insertText", false, pastedText);
  };

  element.setAttribute("contenteditable", "plaintext-only");
  if (!element.isContentEditable) {
    // Firefox has no plaintext-only support; paste is sanitized above instead.
    element.setAttribute("contenteditable", "true");
  }
  element.setAttribute(EDITING_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_INPUT_ATTRIBUTE, "true");
  // Keeps react-grab's earlier-registered window-capture handlers (activation
  // hold detection, key blocking) off every event originating in the edit.
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  element.addEventListener("paste", handlePaste);
  element.focus({ preventScroll: true });
  placeCaret(element, caretPoint);

  const showStatusPill = (configure: (pill: HintPill) => void): void => {
    const pill = createHintPill();
    configure(pill);
    pill.reposition(element.isConnected ? element.getBoundingClientRect() : startRect);
    window.setTimeout(() => {
      pill.destroy();
    }, SUCCESS_FLASH_DURATION_MS);
  };

  const teardown = (): void => {
    isSessionActive = false;
    activeSession = null;
    activeInternals = null;
    element.removeEventListener("paste", handlePaste);
    element.removeAttribute(EDITING_ATTRIBUTE);
    element.removeAttribute(REACT_GRAB_INPUT_ATTRIBUTE);
    if (!didHaveIgnoreEvents) element.removeAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE);
    if (previousContentEditable === null) {
      element.removeAttribute("contenteditable");
    } else {
      element.setAttribute("contenteditable", previousContentEditable);
    }
    clearSelectionInside(element);
    element.blur();
    if (
      previousActiveElement instanceof HTMLElement &&
      previousActiveElement.isConnected &&
      previousActiveElement !== document.body
    ) {
      previousActiveElement.focus({ preventScroll: true });
    }
  };

  const finishCancel = (): void => {
    if (!isSessionActive) return;
    teardown();
    if (element.isConnected) element.innerHTML = beforeHtml;
    onFinish?.(null);
  };

  const finishCommit = async (
    commitOptions?: { quiet?: boolean },
  ): Promise<EditResult | null> => {
    if (!isSessionActive) return null;
    const isQuiet = Boolean(commitOptions?.quiet);
    const afterText = element.innerText;
    teardown();

    const isUnchanged = preservesWhitespace
      ? afterText === beforeText
      : afterText.trim() === beforeText.trim();
    if (isUnchanged) {
      // Whitespace-only and markup-flattening edits are classified no-op, so
      // the DOM must be restored like cancel does — otherwise the page keeps
      // a mutation that no payload records.
      const didMutateDom = element.isConnected && element.innerHTML !== beforeHtml;
      if (didMutateDom) element.innerHTML = beforeHtml;
      if (!isQuiet && (didMutateDom || afterText !== beforeText)) {
        showStatusPill((pill) => pill.showNoChange());
      }
      onFinish?.(null);
      return null;
    }

    const payload = buildEditPayload({
      source: readResolvedSource(),
      elementPreview,
      before: beforeText,
      after: afterText,
      textTransform: appliedTextTransform,
      preserveWhitespace: preservesWhitespace,
    });
    if (element.isConnected) flashElement(element);
    const didCopy = await copyTextToClipboard(payload);

    if (!isQuiet) {
      showStatusPill((pill) => {
        if (didCopy) {
          pill.showCopied();
        } else {
          pill.showError("Copy failed");
        }
      });
    }

    const result: EditResult = { before: beforeText, after: afterText, payload, didCopy };
    window.dispatchEvent(new CustomEvent("react-grab-text:edit", { detail: result }));
    onFinish?.(result);
    return result;
  };

  const handle: EditSessionHandle = {
    commit: finishCommit,
    cancel: finishCancel,
    isActive: () => isSessionActive,
  };
  // The predecessor's commit runs onFinish synchronously, which can itself
  // start another session; commit that reentrant session too before taking
  // the active-session slot, or it would linger editable with dead handlers.
  if (activeInternals) void activeInternals.commit({ quiet: true });
  activeSession = handle;
  activeInternals = { element, commit: finishCommit, cancel: finishCancel };
  return handle;
};
