import {
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
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
import { createHintPill } from "./utils/create-hint-pill.js";
import { ensureStyleSheet } from "./utils/ensure-style-sheet.js";

let activeSession: EditSessionHandle | null = null;

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

const flashElement = (element: HTMLElement): void => {
  element.setAttribute(FLASH_ATTRIBUTE, "true");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.setAttribute(FLASH_ATTRIBUTE, "fading");
    });
  });
  window.setTimeout(() => {
    element.removeAttribute(FLASH_ATTRIBUTE);
  }, SUCCESS_FLASH_DURATION_MS);
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

export const startEditSession = (options: EditSessionOptions): EditSessionHandle => {
  activeSession?.cancel();

  const { element, source, resolveSource, caretPoint, onFinish } = options;

  ensureStyleSheet();
  element.removeAttribute(FLASH_ATTRIBUTE);

  const beforeHtml = element.innerHTML;
  const beforeText = element.innerText;
  const elementPreview = buildElementPreview(element, beforeText);
  const readResolvedSource = createSourceSnapshot(source, resolveSource);
  const previousContentEditable = element.getAttribute("contenteditable");
  const previousActiveElement = document.activeElement;
  let lastKnownRect = element.getBoundingClientRect();
  let isSessionActive = true;
  let repositionFrame: number | null = null;

  element.setAttribute("contenteditable", "plaintext-only");
  if (!element.isContentEditable) {
    // Firefox has no plaintext-only support; paste is sanitized below instead.
    element.setAttribute("contenteditable", "true");
  }
  element.setAttribute(EDITING_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_INPUT_ATTRIBUTE, "true");
  element.focus({ preventScroll: true });
  placeCaret(element, caretPoint);

  const pill = createHintPill();
  pill.showEditing();

  const repositionPill = (): void => {
    if (element.isConnected) lastKnownRect = element.getBoundingClientRect();
    pill.reposition(lastKnownRect);
  };

  const scheduleReposition = (): void => {
    if (repositionFrame !== null) return;
    repositionFrame = requestAnimationFrame(() => {
      repositionFrame = null;
      if (isSessionActive) repositionPill();
    });
  };

  const isEventInsideSession = (event: Event): boolean => {
    const target = event.composedPath()[0] ?? event.target;
    if (!(target instanceof Node)) return false;
    return element.contains(target) || pill.contains(target);
  };

  const teardown = (): void => {
    isSessionActive = false;
    activeSession = null;
    if (repositionFrame !== null) cancelAnimationFrame(repositionFrame);
    window.removeEventListener("keydown", handleKeyDown, { capture: true });
    window.removeEventListener("keyup", handleKeyStop, { capture: true });
    window.removeEventListener("keypress", handleKeyStop, { capture: true });
    window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
    window.removeEventListener("scroll", handleScroll, { capture: true });
    window.removeEventListener("resize", handleResize);
    element.removeEventListener("input", handleInput);
    element.removeEventListener("paste", handlePaste);
    element.removeAttribute(EDITING_ATTRIBUTE);
    element.removeAttribute(REACT_GRAB_INPUT_ATTRIBUTE);
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
    pill.destroy();
    onFinish?.(null);
  };

  const finishCommit = async (): Promise<EditResult | null> => {
    if (!isSessionActive) return null;
    const afterText = element.innerText;
    teardown();

    if (afterText.trim() === beforeText.trim()) {
      pill.destroy();
      onFinish?.(null);
      return null;
    }

    const payload = buildEditPayload({
      source: readResolvedSource(),
      elementPreview,
      before: beforeText,
      after: afterText,
    });
    if (element.isConnected) flashElement(element);
    const didCopy = await copyTextToClipboard(payload);

    if (didCopy) {
      pill.showCopied();
    } else {
      pill.showError("Copy failed");
    }
    repositionPill();
    window.setTimeout(() => {
      pill.destroy();
    }, SUCCESS_FLASH_DURATION_MS);

    const result: EditResult = { before: beforeText, after: afterText, payload, didCopy };
    window.dispatchEvent(new CustomEvent("react-grab-text:edit", { detail: result }));
    onFinish?.(result);
    return result;
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!isEventInsideSession(event)) return;
    if (event.isComposing || event.keyCode === 229) return;
    if (isEnterKey(event) && !event.shiftKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      void finishCommit();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      finishCancel();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopImmediatePropagation();
      void finishCommit();
      return;
    }
    // Insulate the edit from host-app hotkeys; the default action (typing) is unaffected.
    event.stopPropagation();
  };

  const handleKeyStop = (event: KeyboardEvent): void => {
    if (!isEventInsideSession(event)) return;
    event.stopPropagation();
  };

  const handlePointerDown = (event: PointerEvent): void => {
    const target = event.composedPath()[0] ?? event.target;
    if (!(target instanceof Node)) return;
    if (element.contains(target)) return;
    if (pill.contains(target)) {
      event.preventDefault();
      return;
    }
    void finishCommit();
  };

  const handleScroll = (): void => {
    scheduleReposition();
  };

  const handleResize = (): void => {
    scheduleReposition();
  };

  const handleInput = (): void => {
    scheduleReposition();
  };

  const handlePaste = (event: ClipboardEvent): void => {
    if (element.getAttribute("contenteditable") !== "true") return;
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text/plain");
    if (pastedText) document.execCommand("insertText", false, pastedText);
  };

  window.addEventListener("keydown", handleKeyDown, { capture: true });
  window.addEventListener("keyup", handleKeyStop, { capture: true });
  window.addEventListener("keypress", handleKeyStop, { capture: true });
  window.addEventListener("pointerdown", handlePointerDown, { capture: true });
  window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
  window.addEventListener("resize", handleResize);
  element.addEventListener("input", handleInput);
  element.addEventListener("paste", handlePaste);

  repositionPill();

  const handle: EditSessionHandle = {
    commit: finishCommit,
    cancel: finishCancel,
    isActive: () => isSessionActive,
  };
  activeSession = handle;
  return handle;
};
