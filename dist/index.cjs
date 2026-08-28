"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  addDeckItem: () => addDeckItem,
  buildEditPayload: () => buildEditPayload,
  clearDeck: () => clearDeck,
  copyDeckToClipboard: () => copyDeckToClipboard,
  createDeckPlugin: () => createDeckPlugin,
  createTextPlugin: () => createTextPlugin,
  formatDeck: () => formatDeck,
  getActiveEditSession: () => getActiveEditSession,
  getDeckItems: () => getDeckItems,
  getDeckMode: () => getDeckMode,
  isBatchMode: () => isBatchMode,
  queueDeckItemIfBatch: () => queueDeckItemIfBatch,
  registerDeckPlugin: () => registerDeckPlugin,
  registerTextPlugin: () => registerTextPlugin,
  removeDeckItems: () => removeDeckItems,
  setDeckMode: () => setDeckMode,
  startEditSession: () => startEditSession,
  subscribeDeck: () => subscribeDeck,
  subscribeDeckMode: () => subscribeDeckMode,
  toggleDeckMode: () => toggleDeckMode
});
module.exports = __toCommonJS(src_exports);

// src/constants.ts
var PLUGIN_NAME = "text";
var ACTION_ID = "text";
var ACTION_LABEL = "Text";
var ACTION_SHORTCUT = "T";
var EDITING_ATTRIBUTE = "data-react-grab-text-editing";
var FLASH_ATTRIBUTE = "data-react-grab-text-flash";
var UI_ATTRIBUTE = "data-react-grab-text-ui";
var REACT_GRAB_IGNORE_ATTRIBUTE = "data-react-grab-ignore";
var REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE = "data-react-grab-ignore-events";
var REACT_GRAB_INPUT_ATTRIBUTE = "data-react-grab-input";
var HINT_PILL_OFFSET_PX = 8;
var HINT_PILL_VIEWPORT_MARGIN_PX = 8;
var SUCCESS_FLASH_DURATION_MS = 1600;
var OVERLAY_Z_INDEX = 2147483646;
var POINTER_POSITION_MAX_AGE_MS = 1e4;
var PREVIEW_MAX_ATTRIBUTES = 4;
var PREVIEW_MAX_ATTRIBUTE_VALUE_LENGTH = 40;
var PREVIEW_MAX_TEXT_LENGTH = 60;
var NON_EDITABLE_TAGS = /* @__PURE__ */ new Set([
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "IMG",
  "VIDEO",
  "AUDIO",
  "CANVAS",
  "IFRAME",
  "SCRIPT",
  "STYLE",
  "HTML",
  "BODY"
]);
var DECK_PLUGIN_NAME = "deck";
var DECK_UI_ATTRIBUTE = "data-react-grab-deck-ui";
var DECK_STORAGE_KEY = "react-grab-deck";
var DECK_MODE_STORAGE_KEY = "react-grab-deck-mode";
var DECK_MAX_ITEMS = 50;
var DECK_ITEM_SEPARATOR = "\n--\n";
var DECK_COPIED_FLASH_DURATION_MS = 1600;
var DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX = 5;

// src/utils/safe-decode-file-path.ts
var safeDecodeFilePath = (filePath) => {
  if (!filePath.includes("%")) return filePath;
  try {
    return decodeURIComponent(filePath);
  } catch {
    return filePath;
  }
};

// src/build-edit-payload.ts
var formatReference = (source, elementPreview) => {
  const parts = [elementPreview];
  if (source.componentName) parts.push(`in ${source.componentName}`);
  if (source.filePath) {
    const lineSuffix = source.lineNumber ? `:${source.lineNumber}` : "";
    parts.push(`(at ${safeDecodeFilePath(source.filePath)}${lineSuffix})`);
  }
  return `[${parts.join(" ")}]`;
};
var formatTextBlock = (label, text, preserveWhitespace) => {
  const normalized = preserveWhitespace ? text : text.trim();
  if (normalized.includes("\n")) {
    return `${label}:
"""
${normalized}
"""`;
  }
  return `${label}: "${normalized}"`;
};
var buildEditPayload = ({
  source,
  elementPreview,
  before,
  after,
  textTransform,
  preserveWhitespace
}) => {
  const hasTextTransform = Boolean(textTransform) && textTransform !== "none";
  const instruction = [
    "Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.",
    hasTextTransform ? ` NOTE: this element renders with CSS text-transform: ${textTransform}; BEFORE/AFTER are shown as rendered \u2014 keep the source string's original casing.` : ""
  ].join("");
  return [
    instruction,
    "",
    formatReference(source, elementPreview),
    formatTextBlock("BEFORE", before, preserveWhitespace),
    formatTextBlock("AFTER", after, preserveWhitespace)
  ].join("\n");
};

// src/deck-mode.ts
var mode = "batch";
var listeners = /* @__PURE__ */ new Set();
var didLoad = false;
var isDeckMode = (value) => value === "single" || value === "batch";
var loadOnce = () => {
  if (didLoad) return;
  didLoad = true;
  try {
    const stored = window.sessionStorage.getItem(DECK_MODE_STORAGE_KEY);
    if (isDeckMode(stored)) mode = stored;
  } catch {
  }
};
var persist = () => {
  try {
    window.sessionStorage.setItem(DECK_MODE_STORAGE_KEY, mode);
  } catch {
  }
};
var notify = () => {
  persist();
  for (const listener of listeners) listener(mode);
};
var getDeckMode = () => {
  loadOnce();
  return mode;
};
var isBatchMode = () => getDeckMode() === "batch";
var setDeckMode = (next) => {
  loadOnce();
  if (mode === next) return;
  mode = next;
  notify();
};
var toggleDeckMode = () => {
  setDeckMode(isBatchMode() ? "single" : "batch");
  return getDeckMode();
};
var subscribeDeckMode = (listener) => {
  loadOnce();
  listeners.add(listener);
  listener(mode);
  return () => {
    listeners.delete(listener);
  };
};

// src/deck-store.ts
var items = [];
var listeners2 = /* @__PURE__ */ new Set();
var didLoad2 = false;
var isDeckItem = (value) => typeof value === "object" && value !== null && typeof value.id === "string" && typeof value.content === "string";
var loadOnce2 = () => {
  if (didLoad2) return;
  didLoad2 = true;
  try {
    const raw = window.sessionStorage.getItem(DECK_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) items = parsed.filter(isDeckItem).slice(-DECK_MAX_ITEMS);
  } catch {
  }
};
var persist2 = () => {
  try {
    window.sessionStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(items));
  } catch {
  }
};
var notify2 = () => {
  persist2();
  const snapshot = getDeckItems();
  for (const listener of listeners2) listener(snapshot);
  window.dispatchEvent(new CustomEvent("react-grab-deck:change", { detail: { items: snapshot } }));
};
var createItemId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
var getDeckItems = () => {
  loadOnce2();
  return [...items];
};
var addDeckItem = (content) => {
  loadOnce2();
  const trimmed = content.trim();
  if (!trimmed) return null;
  const item = { id: createItemId(), content: trimmed };
  if (items.length >= DECK_MAX_ITEMS) {
    console.warn(
      `[react-grab-text] deck full (${DECK_MAX_ITEMS}) \u2014 dropping the oldest grab to queue this one`
    );
  }
  items = [...items, item].slice(-DECK_MAX_ITEMS);
  notify2();
  return item;
};
var removeDeckItems = (ids) => {
  loadOnce2();
  const removed = new Set(ids);
  const next = items.filter((item) => !removed.has(item.id));
  if (next.length === items.length) return;
  items = next;
  notify2();
};
var updateDeckItem = (id, content) => {
  loadOnce2();
  const trimmed = content.trim();
  if (!trimmed) {
    removeDeckItems([id]);
    return;
  }
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;
  if (items[index].content === trimmed) return;
  items = items.map((item) => item.id === id ? { ...item, content: trimmed } : item);
  notify2();
};
var clearDeck = () => {
  loadOnce2();
  if (items.length === 0) return;
  items = [];
  notify2();
};
var subscribeDeck = (listener) => {
  loadOnce2();
  listeners2.add(listener);
  listener(getDeckItems());
  return () => {
    listeners2.delete(listener);
  };
};

// src/deck-queue.ts
var queueDeckItemIfBatch = (content) => {
  if (!isBatchMode()) return null;
  return addDeckItem(content);
};

// src/utils/build-element-preview.ts
var SKIPPED_ATTRIBUTES = /* @__PURE__ */ new Set([
  "contenteditable",
  "spellcheck",
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
  REACT_GRAB_INPUT_ATTRIBUTE
]);
var escapeAttributeValue = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
var escapeText = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var truncate = (value, maxLength) => {
  const codePoints = Array.from(value);
  if (codePoints.length <= maxLength) return value;
  return `${codePoints.slice(0, maxLength - 1).join("")}\u2026`;
};
var buildElementPreview = (element, textContent) => {
  const tagName = element.tagName.toLowerCase();
  const attributeParts = [];
  for (const attribute of Array.from(element.attributes)) {
    if (attributeParts.length >= PREVIEW_MAX_ATTRIBUTES) break;
    if (SKIPPED_ATTRIBUTES.has(attribute.name)) continue;
    const value = truncate(attribute.value, PREVIEW_MAX_ATTRIBUTE_VALUE_LENGTH);
    attributeParts.push(`${attribute.name}="${escapeAttributeValue(value)}"`);
  }
  const attributes = attributeParts.length > 0 ? ` ${attributeParts.join(" ")}` : "";
  const firstLine = textContent.trim().split("\n")[0] ?? "";
  const textPreview = escapeText(truncate(firstLine, PREVIEW_MAX_TEXT_LENGTH));
  return `<${tagName}${attributes}>${textPreview}</${tagName}>`;
};

// src/utils/caret-range-from-point.ts
var caretRangeFromPoint = (x, y) => {
  if (typeof document.caretPositionFromPoint === "function") {
    const caretPosition = document.caretPositionFromPoint(x, y);
    if (!caretPosition) return null;
    try {
      const range = document.createRange();
      range.setStart(caretPosition.offsetNode, caretPosition.offset);
      range.collapse(true);
      return range;
    } catch {
      return null;
    }
  }
  if (typeof document.caretRangeFromPoint === "function") {
    return document.caretRangeFromPoint(x, y);
  }
  return null;
};

// src/utils/copy-text-to-clipboard.ts
var copyTextToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  textarea.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  textarea.setAttribute(UI_ATTRIBUTE, "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  const previousActiveElement = document.activeElement;
  const selection = window.getSelection();
  const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  document.body.appendChild(textarea);
  textarea.select();
  let didCopy = false;
  try {
    didCopy = document.execCommand("copy");
  } catch {
    didCopy = false;
  }
  textarea.remove();
  if (previousActiveElement instanceof HTMLElement && previousActiveElement.isConnected) {
    previousActiveElement.focus({ preventScroll: true });
  }
  if (savedRange && selection) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
  return didCopy;
};

// src/utils/create-hint-pill.ts
var createStatusContent = (glyph, glyphColor, labelText) => {
  const group = document.createElement("span");
  Object.assign(group.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px"
  });
  const mark = document.createElement("span");
  mark.textContent = glyph;
  mark.style.color = glyphColor;
  mark.style.fontWeight = "600";
  group.appendChild(mark);
  const label = document.createElement("span");
  label.textContent = labelText;
  group.appendChild(label);
  return group;
};
var createHintPill = () => {
  const pill = document.createElement("div");
  pill.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  pill.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  pill.setAttribute(UI_ATTRIBUTE, "true");
  pill.setAttribute("role", "status");
  Object.assign(pill.style, {
    position: "fixed",
    pointerEvents: "none",
    top: "0",
    left: "0",
    zIndex: String(OVERLAY_Z_INDEX),
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 9px",
    borderRadius: "7px",
    background: "rgba(24, 24, 27, 0.94)",
    color: "#e4e4e7",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "11px",
    lineHeight: "1",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
    userSelect: "none",
    visibility: "hidden"
  });
  document.body.appendChild(pill);
  const setContent = (children) => {
    pill.replaceChildren(...children);
  };
  return {
    showCopied: () => {
      setContent([createStatusContent("\u2713", "#4ade80", "Copied")]);
    },
    showNoChange: () => {
      setContent([createStatusContent("\u2013", "#a1a1aa", "No text change")]);
    },
    showError: (message) => {
      setContent([createStatusContent("\u2715", "#f87171", message)]);
    },
    reposition: (targetRect) => {
      const pillRect = pill.getBoundingClientRect();
      let top = targetRect.bottom + HINT_PILL_OFFSET_PX;
      if (top + pillRect.height > window.innerHeight - HINT_PILL_VIEWPORT_MARGIN_PX) {
        top = targetRect.top - pillRect.height - HINT_PILL_OFFSET_PX;
      }
      top = Math.max(top, HINT_PILL_VIEWPORT_MARGIN_PX);
      const maxLeft = window.innerWidth - pillRect.width - HINT_PILL_VIEWPORT_MARGIN_PX;
      const left = Math.min(Math.max(targetRect.left, HINT_PILL_VIEWPORT_MARGIN_PX), maxLeft);
      pill.style.top = `${top}px`;
      pill.style.left = `${left}px`;
      pill.style.visibility = "visible";
    },
    destroy: () => {
      pill.remove();
    }
  };
};

// src/utils/ensure-style-sheet.ts
var STYLE_ELEMENT_ID = "react-grab-text-styles";
var ensureStyleSheet = () => {
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  style.setAttribute(UI_ATTRIBUTE, "true");
  style.textContent = `
[${EDITING_ATTRIBUTE}] {
  outline: 1.5px solid #a855f7 !important;
  outline-offset: 2px !important;
  cursor: text !important;
}
[${FLASH_ATTRIBUTE}] {
  outline: 1.5px solid #22c55e !important;
  outline-offset: 2px !important;
  transition: outline-color 0.9s ease 0.5s;
}
[${FLASH_ATTRIBUTE}="fading"] {
  outline-color: transparent !important;
}
`;
  document.head.appendChild(style);
};

// src/edit-session.ts
var activeSession = null;
var activeInternals = null;
var guardInstallCount = 0;
var areGuardsPermanentlyInstalled = false;
var getActiveEditSession = () => activeSession;
var placeCaret = (element, caretPoint) => {
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
var clearSelectionInside = (element) => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return;
  if (element.contains(selection.anchorNode)) selection.removeAllRanges();
};
var pendingFlashTimers = /* @__PURE__ */ new WeakMap();
var cancelPendingFlash = (element) => {
  const pending = pendingFlashTimers.get(element);
  if (!pending) return;
  cancelAnimationFrame(pending.frame);
  window.clearTimeout(pending.timeout);
  pendingFlashTimers.delete(element);
};
var flashElement = (element) => {
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
var isEnterKey = (event) => event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter";
var createSourceSnapshot = (fallback, resolveSource) => {
  let resolved = fallback;
  resolveSource?.().then((value) => {
    resolved = value;
  }).catch(() => void 0);
  return () => resolved;
};
var isEventInsideActiveSession = (event) => {
  const internals = activeInternals;
  if (!internals) return false;
  const target = event.composedPath()[0] ?? event.target;
  return target instanceof Node && internals.element.contains(target);
};
var guardKeyDown = (event) => {
  const internals = activeInternals;
  if (!internals) return;
  if (event.isComposing || event.keyCode === 229) return;
  const isInsideSession = isEventInsideActiveSession(event);
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
  event.stopImmediatePropagation();
};
var guardKeyStop = (event) => {
  if (isEventInsideActiveSession(event)) event.stopImmediatePropagation();
};
var guardPointerDown = (event) => {
  const internals = activeInternals;
  if (!internals) return;
  const target = event.composedPath()[0] ?? event.target;
  if (!(target instanceof Node)) return;
  if (internals.element.contains(target)) return;
  void internals.commit();
};
var addGuardListeners = () => {
  window.addEventListener("keydown", guardKeyDown, { capture: true });
  window.addEventListener("keyup", guardKeyStop, { capture: true });
  window.addEventListener("keypress", guardKeyStop, { capture: true });
  window.addEventListener("pointerdown", guardPointerDown, { capture: true });
};
var removeGuardListeners = () => {
  window.removeEventListener("keydown", guardKeyDown, { capture: true });
  window.removeEventListener("keyup", guardKeyStop, { capture: true });
  window.removeEventListener("keypress", guardKeyStop, { capture: true });
  window.removeEventListener("pointerdown", guardPointerDown, { capture: true });
};
var installEditSessionGuards = () => {
  guardInstallCount += 1;
  areGuardsPermanentlyInstalled = false;
  addGuardListeners();
  let didUninstall = false;
  return () => {
    if (didUninstall) return;
    didUninstall = true;
    guardInstallCount -= 1;
    if (guardInstallCount === 0 && !areGuardsPermanentlyInstalled) removeGuardListeners();
  };
};
var ensureGuardsInstalled = () => {
  if (guardInstallCount > 0 || areGuardsPermanentlyInstalled) return;
  areGuardsPermanentlyInstalled = true;
  addGuardListeners();
};
var startEditSession = (options) => {
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
  const preservesWhitespace = computedStyle.whiteSpace.startsWith("pre");
  const readResolvedSource = createSourceSnapshot(source, resolveSource);
  const previousContentEditable = element.getAttribute("contenteditable");
  const didHaveIgnoreEvents = element.hasAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE);
  const previousActiveElement = document.activeElement;
  const startRect = element.getBoundingClientRect();
  let isSessionActive = true;
  const handlePaste = (event) => {
    if (element.getAttribute("contenteditable") !== "true") return;
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text/plain");
    if (pastedText) document.execCommand("insertText", false, pastedText);
  };
  element.setAttribute("contenteditable", "plaintext-only");
  if (!element.isContentEditable) {
    element.setAttribute("contenteditable", "true");
  }
  element.setAttribute(EDITING_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_INPUT_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  element.addEventListener("paste", handlePaste);
  element.focus({ preventScroll: true });
  placeCaret(element, caretPoint);
  const showStatusPill = (configure) => {
    const pill = createHintPill();
    configure(pill);
    pill.reposition(element.isConnected ? element.getBoundingClientRect() : startRect);
    window.setTimeout(() => {
      pill.destroy();
    }, SUCCESS_FLASH_DURATION_MS);
  };
  const teardown = () => {
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
    if (previousActiveElement instanceof HTMLElement && previousActiveElement.isConnected && previousActiveElement !== document.body) {
      previousActiveElement.focus({ preventScroll: true });
    }
  };
  const finishCancel = () => {
    if (!isSessionActive) return;
    teardown();
    if (element.isConnected) element.innerHTML = beforeHtml;
    onFinish?.(null);
  };
  const finishCommit = async (commitOptions) => {
    if (!isSessionActive) return null;
    const isQuiet = Boolean(commitOptions?.quiet);
    const afterText = element.innerText;
    teardown();
    const isUnchanged = preservesWhitespace ? afterText === beforeText : afterText.trim() === beforeText.trim();
    if (isUnchanged) {
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
      preserveWhitespace: preservesWhitespace
    });
    if (element.isConnected) flashElement(element);
    const didCopy = await copyTextToClipboard(payload);
    if (didCopy) queueDeckItemIfBatch(payload);
    if (!isQuiet) {
      showStatusPill((pill) => {
        if (didCopy) {
          pill.showCopied();
        } else {
          pill.showError("Copy failed");
        }
      });
    }
    const result = { before: beforeText, after: afterText, payload, didCopy };
    window.dispatchEvent(new CustomEvent("react-grab-text:edit", { detail: result }));
    onFinish?.(result);
    return result;
  };
  const handle = {
    commit: finishCommit,
    cancel: finishCancel,
    isActive: () => isSessionActive
  };
  if (activeInternals) void activeInternals.commit({ quiet: true });
  activeSession = handle;
  activeInternals = { element, commit: finishCommit, cancel: finishCancel };
  return handle;
};

// src/utils/is-text-editable-element.ts
var isTextEditableElement = (element) => {
  if (!(element instanceof HTMLElement)) return false;
  if (NON_EDITABLE_TAGS.has(element.tagName)) return false;
  if (element.closest(`svg, [${UI_ATTRIBUTE}]`)) return false;
  if (element.querySelector("input, textarea, select, iframe, canvas, video, audio")) {
    return false;
  }
  return element.innerText.trim().length > 0;
};

// src/utils/track-last-pointer-position.ts
var lastPointerPosition = null;
var trackerCount = 0;
var isFromReactGrabUi = (event) => event.composedPath().some(
  (entry) => entry instanceof Element && entry.getAttributeNames().some((name) => name.startsWith("data-react-grab"))
);
var handlePointerDown = (event) => {
  if (isFromReactGrabUi(event)) return;
  lastPointerPosition = { x: event.clientX, y: event.clientY, recordedAt: Date.now() };
};
var startPointerTracking = () => {
  trackerCount += 1;
  if (trackerCount === 1) {
    window.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true
    });
  }
  let didStop = false;
  return () => {
    if (didStop) return;
    didStop = true;
    trackerCount -= 1;
    if (trackerCount === 0) {
      window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      lastPointerPosition = null;
    }
  };
};
var getLastPointerPosition = () => {
  if (!lastPointerPosition) return null;
  if (Date.now() - lastPointerPosition.recordedAt > POINTER_POSITION_MAX_AGE_MS) return null;
  return { x: lastPointerPosition.x, y: lastPointerPosition.y };
};

// src/text-plugin.ts
var buildSourceFromContext = (context) => ({
  filePath: context.filePath,
  lineNumber: context.lineNumber,
  componentName: context.componentName,
  tagName: context.tagName
});
var createResolveSource = (api, element, fallback) => async () => {
  if (!api || fallback.filePath && fallback.componentName) return fallback;
  const sourceInfo = await api.getSource(element).catch(() => null);
  return {
    filePath: fallback.filePath ?? sourceInfo?.filePath,
    lineNumber: fallback.lineNumber ?? sourceInfo?.lineNumber ?? void 0,
    componentName: fallback.componentName ?? sourceInfo?.componentName ?? api.getDisplayName(element) ?? void 0,
    tagName: fallback.tagName
  };
};
var createTextPlugin = () => {
  let reactGrabApi = null;
  let selectionPagePoint = null;
  const takeCaretPoint = () => {
    const point = selectionPagePoint;
    selectionPagePoint = null;
    if (point && Date.now() - point.recordedAt <= POINTER_POSITION_MAX_AGE_MS) {
      return {
        x: point.x - window.scrollX,
        y: point.y - window.scrollY
      };
    }
    return getLastPointerPosition() ?? void 0;
  };
  const handleTextAction = (context) => {
    const { element } = context;
    if (!isTextEditableElement(element)) return;
    const fallbackSource = buildSourceFromContext(context);
    context.hideContextMenu();
    const caretPoint = takeCaretPoint();
    reactGrabApi?.deactivate();
    startEditSession({
      element,
      source: fallbackSource,
      resolveSource: createResolveSource(reactGrabApi, element, fallbackSource),
      caretPoint
    });
  };
  return {
    name: PLUGIN_NAME,
    hooks: {
      onDragStart: (startX, startY) => {
        selectionPagePoint = { x: startX, y: startY, recordedAt: Date.now() };
      },
      // Covers react-grab being reactivated over a live session through paths
      // no pointerdown reaches (keyboard hold, programmatic activate). On
      // deactivation the selection point is cleared so it cannot outlive the
      // activation cycle that produced it.
      onStateChange: (state) => {
        if (state.isActive) {
          void getActiveEditSession()?.commit();
        } else {
          selectionPagePoint = null;
        }
      }
    },
    setup: (api) => {
      reactGrabApi = api;
      const stopPointerTracking = startPointerTracking();
      const uninstallGuards = installEditSessionGuards();
      return {
        cleanup: () => {
          void getActiveEditSession()?.commit({ quiet: true });
          reactGrabApi = null;
          selectionPagePoint = null;
          stopPointerTracking();
          uninstallGuards();
          return void 0;
        }
      };
    },
    actions: [
      {
        id: ACTION_ID,
        label: ACTION_LABEL,
        shortcut: ACTION_SHORTCUT,
        shortcutModifier: false,
        showInToolbarMenu: true,
        enabled: (context) => context.elements.length <= 1 && isTextEditableElement(context.element),
        onAction: handleTextAction
      }
    ]
  };
};

// src/deck-batch-icon.ts
var SVG_NS = "http://www.w3.org/2000/svg";
var REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var STACK_LAYER_PATHS = {
  back: "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657Z",
  mid: "M5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",
  front: "M2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6Z"
};
var HIDDEN_LAYER = { opacity: 0, tx: 0, ty: 3, scale: 0.94, delayMs: 0 };
var LAYER_POSES = {
  back: {
    collapsed: HIDDEN_LAYER,
    expanded: { opacity: 0.55, tx: 0.75, ty: -6, scale: 0.84, delayMs: 0 }
  },
  mid: {
    collapsed: HIDDEN_LAYER,
    expanded: { opacity: 0.8, tx: 0.35, ty: -3, scale: 0.92, delayMs: 35 }
  },
  front: {
    collapsed: { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 0 },
    expanded: { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 70 }
  }
};
var applyPose = (element, pose, origin) => {
  const delay = REDUCE_MOTION ? "" : ` ${pose.delayMs}ms`;
  element.style.transition = REDUCE_MOTION ? "none" : `opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)${delay}, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)${delay}`;
  element.style.transformOrigin = origin;
  element.style.opacity = String(pose.opacity);
  element.style.transform = `translate(${pose.tx}px, ${pose.ty}px) scale(${pose.scale})`;
};
var createDeckBatchIcon = () => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  svg.style.pointerEvents = "none";
  svg.style.overflow = "visible";
  const layerNodes = Object.keys(STACK_LAYER_PATHS).map(
    (key) => {
      const group = document.createElementNS(SVG_NS, "g");
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", STACK_LAYER_PATHS[key]);
      group.append(path);
      svg.append(group);
      return { key, group };
    }
  );
  let active = false;
  let preview = false;
  const render = () => {
    const expanded = active || preview;
    for (const { key, group } of layerNodes) {
      const poses = LAYER_POSES[key];
      applyPose(group, expanded ? poses.expanded : poses.collapsed, "12px 16px");
    }
  };
  render();
  return {
    svg,
    setActive: (next) => {
      active = next;
      if (next) preview = false;
      render();
    },
    setPreview: (next) => {
      if (active) return;
      preview = next;
      render();
    }
  };
};

// src/deck-icons.ts
var SVG_NS2 = "http://www.w3.org/2000/svg";
var createToolbarIconSvg = () => {
  const svg = document.createElementNS(SVG_NS2, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  svg.style.pointerEvents = "none";
  return svg;
};
var createFilledToolbarIcon = (paths) => {
  const svg = createToolbarIconSvg();
  for (const { d, fillRule, clipRule } of [paths].flat()) {
    const path = document.createElementNS(SVG_NS2, "path");
    path.setAttribute("d", d);
    if (fillRule) path.setAttribute("fill-rule", fillRule);
    if (clipRule) path.setAttribute("clip-rule", clipRule);
    svg.append(path);
  }
  return svg;
};
var iconDeckListQueue = () => createFilledToolbarIcon({
  d: "M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"
});
var iconDeckList = iconDeckListQueue;
var iconDeckCheck = () => createFilledToolbarIcon({
  d: "M20.285 6.709a1 1 0 0 1 .006 1.414l-9.2 9.25a1 1 0 0 1-1.435.01L3.71 12.09a1 1 0 0 1 1.414-1.414l5.2 5.2 8.49-8.54a1 1 0 0 1 1.471.373z",
  fillRule: "evenodd",
  clipRule: "evenodd"
});

// src/deck-toolbar-button.ts
var TOOLBAR_BUTTON_CLASS = "group contain-layout flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox";
var TOOLBAR_BUTTON_WRAPPER_CLASS = "relative contain-layout flex items-center justify-center shrink-0";
var DECK_CONTROLS_CLASS = "relative overflow-visible flex items-center shrink-0 mr-1.5";
var DECK_CONTROLS_GAP_PX = 4;
var ICON_COLOR_ACTIVE = "text-[var(--rg-text-primary)]";
var ICON_COLOR_IDLE = "text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)] transition-[color] duration-150 ease-drawer";
var markToolbarControl = (element) => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};
var applyIconColor = (icon, active) => {
  icon.setAttribute("class", active ? ICON_COLOR_ACTIVE : ICON_COLOR_IDLE);
};
var createToolbarIconButton = (uiPart, label, icon, active = false) => {
  const wrapper = document.createElement("div");
  wrapper.className = TOOLBAR_BUTTON_WRAPPER_CLASS;
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, uiPart);
  button.className = TOOLBAR_BUTTON_CLASS;
  button.setAttribute("aria-label", label);
  button.title = label;
  markToolbarControl(button);
  applyIconColor(icon, active);
  button.append(icon);
  wrapper.append(button);
  return { wrapper, button };
};

// src/deck-affordance.ts
var DECK_FACE_ATTRIBUTE = "data-react-grab-deck-face";
var FACE_TRANSITION = "opacity 160ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)";
var faceVisibilityStyle = (visible) => ({
  opacity: visible ? "1" : "0",
  transform: visible ? "scale(1)" : "scale(0.82)"
});
var createDeckAffordance = () => {
  const wrapper = document.createElement("div");
  wrapper.className = TOOLBAR_BUTTON_WRAPPER_CLASS;
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, "mode-toggle");
  button.className = `${TOOLBAR_BUTTON_CLASS} relative`;
  button.setAttribute("aria-live", "polite");
  button.setAttribute("aria-pressed", "false");
  markToolbarControl(button);
  const viewport = document.createElement("span");
  Object.assign(viewport.style, {
    position: "relative",
    display: "block",
    width: "14px",
    height: "14px",
    overflow: "visible"
  });
  const stackFace = document.createElement("span");
  stackFace.setAttribute(DECK_FACE_ATTRIBUTE, "stack");
  Object.assign(stackFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none",
    overflow: "visible"
  });
  const batchIcon = createDeckBatchIcon();
  const stackIcon = batchIcon.svg;
  stackFace.append(stackIcon);
  const countFace = document.createElement("span");
  countFace.setAttribute(DECK_FACE_ATTRIBUTE, "count");
  Object.assign(countFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none",
    fontSize: "13px",
    lineHeight: "14px",
    letterSpacing: "-0.02em",
    fontVariantNumeric: "tabular-nums"
  });
  const checkFace = document.createElement("span");
  checkFace.setAttribute(DECK_FACE_ATTRIBUTE, "check");
  Object.assign(checkFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none"
  });
  const checkIcon = iconDeckCheck();
  checkFace.append(checkIcon);
  viewport.append(stackFace, countFace, checkFace);
  button.append(viewport);
  wrapper.append(button);
  let batchActive = false;
  let currentFace = "stack";
  const setFace = (face, count = 0) => {
    currentFace = face;
    if (face === "count") countFace.textContent = String(count);
    for (const [name, element] of [
      ["stack", stackFace],
      ["count", countFace],
      ["check", checkFace]
    ]) {
      Object.assign(element.style, faceVisibilityStyle(name === face));
    }
    applyIconColor(stackIcon, batchActive && face === "stack");
    applyIconColor(checkIcon, face === "check");
    if (face !== "stack") batchIcon.setPreview(false);
    if (face === "count") {
      countFace.className = "text-[var(--rg-text-primary)] font-variant-numeric tabular-nums transition-[color] duration-150 ease-drawer";
    }
  };
  const setBatchActive = (active) => {
    batchActive = active;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    batchIcon.setActive(active);
    if (!active) batchIcon.setPreview(false);
    if (currentFace === "stack") applyIconColor(stackIcon, active);
  };
  const updateStackPreview = () => {
    if (currentFace !== "stack" || batchActive) {
      batchIcon.setPreview(false);
      return;
    }
    batchIcon.setPreview(button.matches(":hover"));
  };
  button.addEventListener("pointerenter", updateStackPreview);
  button.addEventListener("pointerleave", () => batchIcon.setPreview(false));
  button.addEventListener("focus", updateStackPreview);
  button.addEventListener("blur", () => batchIcon.setPreview(false));
  setFace("stack");
  return { wrapper, button, setFace, setBatchActive };
};

// src/deck-panel.ts
var markPanelControl = (element) => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};
var t = {
  bg: "var(--rg-panel-bg, #161616)",
  text: "var(--rg-text-primary, #ffffff)",
  textMuted: "var(--rg-text-secondary, #a7a7a7)",
  border: "var(--rg-border-subtle, rgba(255, 255, 255, 0.1))",
  borderFocus: "var(--rg-border-button, rgba(255, 255, 255, 0.2))",
  submitBg: "var(--rg-submit-bg, #ffffff)",
  submitFg: "var(--rg-submit-fg, #161616)",
  shadow: "var(--rg-shadow, 0 2px 8px rgba(0, 0, 0, 0.08))",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
};
var PANEL_RADIUS = "10px";
var PANEL_PAD = "12px";
var ITEM_GAP = "16px";
var FIELD_LINE = "1.45";
var ITEM_ID_ATTR = "data-deck-item-id";
var applyFocusVisibleRing = (element) => {
  let suppressRing = false;
  element.addEventListener("mousedown", () => {
    suppressRing = true;
  });
  element.addEventListener("focus", () => {
    requestAnimationFrame(() => {
      if (!suppressRing && element.matches(":focus-visible")) {
        element.style.outline = `1px solid ${t.borderFocus}`;
        element.style.outlineOffset = "2px";
      }
      suppressRing = false;
    });
  });
  element.addEventListener("blur", () => {
    element.style.outline = "none";
    element.style.outlineOffset = "0";
  });
};
var createDeckPanel = () => {
  const panel = document.createElement("div");
  panel.setAttribute(DECK_UI_ATTRIBUTE, "panel");
  markPanelControl(panel);
  Object.assign(panel.style, {
    display: "none",
    position: "fixed",
    flexDirection: "column",
    minWidth: "min(360px, calc(100vw - 24px))",
    maxWidth: "min(400px, calc(100vw - 24px))",
    maxHeight: "min(400px, 52vh)",
    overflow: "hidden",
    borderRadius: PANEL_RADIUS,
    background: t.bg,
    color: t.text,
    border: `1px solid ${t.border}`,
    boxShadow: t.shadow,
    font: `12px/${FIELD_LINE} ${t.sans}`,
    WebkitFontSmoothing: "antialiased",
    zIndex: "2147483645"
  });
  return panel;
};
var createItemField = (itemId, content, handlers) => {
  const field = document.createElement("textarea");
  field.value = content;
  field.rows = 3;
  field.setAttribute(ITEM_ID_ATTR, itemId);
  markPanelControl(field);
  Object.assign(field.style, {
    flex: "1",
    minWidth: "0",
    boxSizing: "border-box",
    margin: "0",
    padding: "0",
    border: "none",
    borderRadius: "0",
    background: "transparent",
    color: t.text,
    fontFamily: t.mono,
    fontSize: "11px",
    lineHeight: FIELD_LINE,
    resize: "vertical",
    minHeight: "48px",
    outline: "none"
  });
  applyFocusVisibleRing(field);
  field.addEventListener("blur", () => {
    const next = field.value;
    if (!next.trim()) {
      handlers.onRemoveItem(itemId);
      return;
    }
    handlers.onUpdateItem(itemId, next);
  });
  field.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      field.blur();
    }
  });
  field.addEventListener("mousedown", (event) => event.stopPropagation());
  field.addEventListener("pointerdown", (event) => event.stopPropagation());
  return field;
};
var createIconButton = (label, uiPart, text, extra) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, uiPart);
  button.textContent = text;
  button.title = label;
  button.setAttribute("aria-label", label);
  markPanelControl(button);
  Object.assign(button.style, {
    position: "relative",
    flex: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    minHeight: "24px",
    padding: "0",
    border: "none",
    borderRadius: "4px",
    background: "transparent",
    color: t.textMuted,
    font: "inherit",
    lineHeight: "1",
    cursor: "pointer",
    ...extra
  });
  button.addEventListener("mouseenter", () => {
    button.style.color = t.text;
  });
  button.addEventListener("mouseleave", () => {
    button.style.color = t.textMuted;
  });
  applyFocusVisibleRing(button);
  return button;
};
var createItemRow = (index, item, handlers) => {
  const row = document.createElement("article");
  row.setAttribute(DECK_UI_ATTRIBUTE, "panel-item");
  row.setAttribute(ITEM_ID_ATTR, item.id);
  Object.assign(row.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px"
  });
  const indexLabel = document.createElement("span");
  indexLabel.setAttribute("data-deck-item-index", "true");
  indexLabel.textContent = String(index + 1);
  Object.assign(indexLabel.style, {
    flex: "none",
    width: "14px",
    paddingTop: "1px",
    color: t.textMuted,
    fontSize: "11px",
    fontWeight: "600",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right"
  });
  const field = createItemField(item.id, item.content, handlers);
  field.setAttribute(DECK_UI_ATTRIBUTE, "panel-preview");
  const deleteButton = createIconButton("Remove from deck", "delete-item", "\xD7", {
    fontSize: "16px",
    marginTop: "-1px"
  });
  deleteButton.setAttribute(ITEM_ID_ATTR, item.id);
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    handlers.onRemoveItem(item.id);
  });
  row.append(indexLabel, field, deleteButton);
  return row;
};
var createDeckPanelView = () => {
  const panel = createDeckPanel();
  const scroll = document.createElement("div");
  Object.assign(scroll.style, {
    flex: "1",
    minHeight: "0",
    overflowY: "auto",
    padding: PANEL_PAD,
    display: "flex",
    flexDirection: "column",
    gap: ITEM_GAP
  });
  const footer = document.createElement("footer");
  Object.assign(footer.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: `0 ${PANEL_PAD} ${PANEL_PAD}`,
    flexShrink: "0"
  });
  const meta = document.createElement("div");
  Object.assign(meta.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "0",
    color: t.textMuted,
    fontSize: "11px"
  });
  const countLabel = document.createElement("span");
  const separator = document.createElement("span");
  separator.textContent = "\xB7";
  separator.setAttribute("aria-hidden", "true");
  const modeButton = createIconButton("Turn batch mode off", "panel-mode-toggle", "Batch on", {
    fontSize: "11px",
    minWidth: "0",
    minHeight: "24px",
    padding: "4px 0"
  });
  const clearButton = createIconButton("Clear all deck items", "clear-all", "Clear", {
    fontSize: "11px",
    minWidth: "0",
    minHeight: "24px",
    padding: "4px 0"
  });
  const copyButton = createIconButton("Copy all deck items", "copy-all", "Copy all", {
    flex: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    background: t.submitBg,
    color: t.submitFg,
    fontSize: "12px",
    fontWeight: "600",
    minWidth: "0"
  });
  copyButton.addEventListener("mouseenter", () => {
    copyButton.style.color = t.submitFg;
  });
  copyButton.addEventListener("mouseleave", () => {
    copyButton.style.color = t.submitFg;
  });
  let footerHandlers = null;
  modeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    footerHandlers?.onToggleMode();
  });
  clearButton.addEventListener("click", (event) => {
    event.stopPropagation();
    footerHandlers?.onClearAll();
  });
  copyButton.addEventListener("click", (event) => {
    event.stopPropagation();
    footerHandlers?.onCopyAll();
  });
  const modeSeparator = separator.cloneNode(true);
  meta.append(countLabel, separator, modeButton, modeSeparator, clearButton);
  footer.append(meta, copyButton);
  panel.append(scroll, footer);
  const getRowField = (row) => row.querySelector(`textarea[${DECK_UI_ATTRIBUTE}="panel-preview"]`);
  let batchActive = true;
  const paintMode = () => {
    modeButton.style.color = batchActive ? t.text : t.textMuted;
  };
  const setBatchActive = (active) => {
    batchActive = active;
    modeButton.textContent = active ? "Batch on" : "Batch off";
    modeButton.title = active ? "Turn batch mode off" : "Turn batch mode on";
    modeButton.setAttribute("aria-label", modeButton.title);
    modeButton.setAttribute("aria-pressed", String(active));
    paintMode();
  };
  modeButton.addEventListener("mouseenter", () => {
    modeButton.style.color = t.text;
  });
  modeButton.addEventListener("mouseleave", paintMode);
  setBatchActive(true);
  const hasFocusedField = () => scroll.contains(document.activeElement) && document.activeElement instanceof HTMLTextAreaElement && document.activeElement.matches(`textarea[${DECK_UI_ATTRIBUTE}="panel-preview"]`);
  const sync = (items2, handlers) => {
    if (items2.length === 0) {
      scroll.replaceChildren();
      return;
    }
    footerHandlers = handlers;
    countLabel.textContent = `${items2.length} ${items2.length === 1 ? "item" : "items"}`;
    const nextIds = new Set(items2.map((item) => item.id));
    const existingRows = [...scroll.querySelectorAll(`article[${DECK_UI_ATTRIBUTE}="panel-item"]`)];
    const rowsById = new Map(existingRows.map((row) => [row.getAttribute(ITEM_ID_ATTR), row]));
    for (const row of existingRows) {
      const id = row.getAttribute(ITEM_ID_ATTR);
      if (!id || nextIds.has(id)) continue;
      const field = getRowField(row);
      if (field === document.activeElement) continue;
      row.remove();
      rowsById.delete(id);
    }
    const orderedRows = [];
    for (const [index, item] of items2.entries()) {
      let row = rowsById.get(item.id);
      if (!row) {
        row = createItemRow(index, item, handlers);
        rowsById.set(item.id, row);
      } else {
        const indexLabel = row.querySelector("[data-deck-item-index]");
        if (indexLabel) indexLabel.textContent = String(index + 1);
        const field = getRowField(row);
        if (field && field !== document.activeElement && field.value !== item.content) {
          field.value = item.content;
        }
      }
      orderedRows.push(row);
    }
    for (const [index, row] of orderedRows.entries()) {
      if (scroll.children[index] !== row) scroll.insertBefore(row, scroll.children[index] ?? null);
    }
    while (scroll.children.length > orderedRows.length) {
      scroll.lastElementChild?.remove();
    }
    panel.style.display = "flex";
  };
  return { panel, hasFocusedField, setBatchActive, sync };
};

// src/deck-ui.ts
var TOOLBAR_HOST_SELECTOR = "[data-react-grab]";
var TEXT_ACTION_SELECTOR = '[data-react-grab-toolbar-action="text"]';
var REATTACH_INTERVAL_MS = 500;
var FAILED_ATTACH_WARN_AT = 20;
var getToolbarActionAnchor = (button) => {
  if (!button) return null;
  return button.parentElement ?? button;
};
var createDeckUi = (onCopyAll) => {
  let count = 0;
  let batchMode = false;
  let panelOpen = false;
  let status = "idle";
  let flashTimer;
  let drag = null;
  const controls = document.createElement("div");
  controls.setAttribute(DECK_UI_ATTRIBUTE, "controls");
  controls.className = DECK_CONTROLS_CLASS;
  Object.assign(controls.style, { gap: `${DECK_CONTROLS_GAP_PX}px` });
  const deckAffordance = createDeckAffordance();
  const deckButton = deckAffordance.button;
  const panelMount = createToolbarIconButton(
    "panel-toggle",
    "Review deck items",
    iconDeckList(),
    false
  );
  const panelToggle = panelMount.button;
  panelToggle.setAttribute("aria-expanded", "false");
  panelMount.wrapper.style.display = "none";
  const deckPanel = createDeckPanelView();
  const panel = deckPanel.panel;
  controls.append(deckAffordance.wrapper, panelMount.wrapper);
  const getAffordanceFace = () => {
    if (status === "flash") return "check";
    if (count > 0) return "count";
    return "stack";
  };
  const positionPanel = () => {
    const anchor = panelToggle;
    const rect = anchor.getBoundingClientRect();
    const panelHeight = panel.offsetHeight || 240;
    const gap = 10;
    const spaceAbove = rect.top - gap;
    const openUp = spaceAbove >= Math.min(panelHeight, 200) || spaceAbove > window.innerHeight - rect.bottom;
    if (openUp) {
      panel.style.top = "auto";
      panel.style.bottom = `${window.innerHeight - rect.top + gap}px`;
    } else {
      panel.style.bottom = "auto";
      panel.style.top = `${rect.bottom + gap}px`;
    }
    const panelWidth = panel.offsetWidth || 420;
    let left = rect.right - panelWidth;
    left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12));
    panel.style.left = `${left}px`;
    panel.style.right = "auto";
    panel.style.maxHeight = openUp ? `${Math.max(160, Math.min(360, spaceAbove - 8))}px` : `${Math.max(160, Math.min(360, window.innerHeight - rect.bottom - gap - 12))}px`;
  };
  const syncPanelMount = () => {
    if (panelOpen && count > 0) {
      if (!panel.isConnected) document.body.append(panel);
      panel.style.display = "flex";
      positionPanel();
      panelToggle.setAttribute("aria-expanded", "true");
      return;
    }
    panel.style.display = "none";
    panelToggle.setAttribute("aria-expanded", "false");
    if (panel.isConnected) panel.remove();
  };
  const affordanceLabel = () => {
    if (status === "flash") return "Deck copied to clipboard";
    if (status === "copying") return `Copying ${count} deck items`;
    if (count > 0) {
      return count >= DECK_MAX_ITEMS ? `Copy all ${count} deck items \u2014 deck full (${DECK_MAX_ITEMS})` : `Copy all ${count} deck items`;
    }
    return batchMode ? "Batch mode on \u2014 grabs queue in the deck" : "Batch mode off \u2014 grabs copy to clipboard only";
  };
  const renderDeckAffordance = () => {
    deckAffordance.setBatchActive(batchMode);
    deckPanel.setBatchActive(batchMode);
    deckAffordance.setFace(getAffordanceFace(), count);
    const label = affordanceLabel();
    deckButton.title = label;
    deckButton.setAttribute("aria-label", label);
  };
  const renderPanelToggle = () => {
    const visible = count > 0;
    panelMount.wrapper.style.display = visible ? "" : "none";
    if (!visible) panelOpen = false;
    const icon = panelToggle.querySelector("svg");
    if (icon) applyIconColor(icon, panelOpen);
    panelToggle.title = panelOpen ? "Close deck panel" : "Review deck items";
    panelToggle.setAttribute("aria-label", panelOpen ? "Close deck panel" : "Review deck items");
  };
  const panelHandlers = {
    onCopyAll: () => {
      void onCopyAll();
    },
    onClearAll: () => {
      clearDeck();
    },
    onRemoveItem: (id) => {
      removeDeckItems([id]);
    },
    onUpdateItem: (id, content) => {
      updateDeckItem(id, content);
    },
    onToggleMode: () => {
      toggleDeckMode();
    }
  };
  const renderPanelItems = (items2) => {
    if (items2.length === 0) {
      deckPanel.sync([], panelHandlers);
      panelOpen = false;
      syncPanelMount();
      return;
    }
    deckPanel.sync(items2, panelHandlers);
    syncPanelMount();
    if (panelOpen) positionPanel();
  };
  const render = (items2 = getDeckItems()) => {
    renderDeckAffordance();
    renderPanelToggle();
    renderPanelItems(items2);
  };
  const closePanel = () => {
    if (!panelOpen) return;
    panelOpen = false;
    render();
  };
  const onPointerDownOutsidePanel = (event) => {
    if (!panelOpen) return;
    const path = event.composedPath();
    if (path.includes(panel) || path.includes(controls)) return;
    closePanel();
  };
  window.addEventListener("pointerdown", onPointerDownOutsidePanel, true);
  const setStatus = (next) => {
    if (status === next) return;
    if (flashTimer !== void 0) {
      window.clearTimeout(flashTimer);
      flashTimer = void 0;
    }
    status = next;
    if (next === "flash") {
      renderDeckAffordance();
      flashTimer = window.setTimeout(() => {
        flashTimer = void 0;
        status = "idle";
        render();
      }, DECK_COPIED_FLASH_DURATION_MS);
      return;
    }
    render();
  };
  const trackDragTravel = (event) => {
    if (!drag) return;
    drag.peak = Math.max(drag.peak, Math.hypot(event.clientX - drag.x, event.clientY - drag.y));
  };
  const endDragTracking = () => {
    window.removeEventListener("pointermove", trackDragTravel);
    window.removeEventListener("pointerup", endDragTracking);
    window.removeEventListener("pointercancel", endDragTracking);
  };
  deckButton.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY, peak: 0 };
    window.addEventListener("pointermove", trackDragTravel);
    window.addEventListener("pointerup", endDragTracking);
    window.addEventListener("pointercancel", endDragTracking);
  });
  deckButton.addEventListener("click", () => {
    const wasDrag = drag !== null && drag.peak > DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX;
    drag = null;
    if (wasDrag || status !== "idle") return;
    if (count > 0) {
      panelOpen = false;
      setStatus("copying");
      void onCopyAll().then((didCopy) => {
        if (didCopy && getDeckItems().length === 0) setStatus("flash");
      }).catch(() => {
      }).finally(() => {
        if (status === "copying") setStatus("idle");
      });
      return;
    }
    toggleDeckMode();
  });
  panelToggle.addEventListener("click", () => {
    if (count === 0) return;
    panelOpen = !panelOpen;
    render();
  });
  const onViewportChange = () => {
    if (panelOpen) positionPanel();
  };
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("scroll", onViewportChange, true);
  let failedAttachAttempts = 0;
  const attach = () => {
    failedAttachAttempts += 1;
    if (failedAttachAttempts === FAILED_ATTACH_WARN_AT) {
      console.warn(
        "[react-grab-text] deck UI found no toolbar anchor after 10s \u2014 host toolbar markup may have changed"
      );
    }
    const root = document.querySelector(TOOLBAR_HOST_SELECTOR)?.shadowRoot?.querySelector(TOOLBAR_HOST_SELECTOR);
    const actionButtons = root?.querySelectorAll("[data-react-grab-toolbar-action]");
    const textButton = root?.querySelector(TEXT_ACTION_SELECTOR);
    const fallbackButton = actionButtons?.length ? actionButtons[actionButtons.length - 1] : null;
    const anchor = getToolbarActionAnchor(textButton) ?? getToolbarActionAnchor(fallbackButton);
    if (!anchor?.parentElement) return;
    const existing = root?.querySelector(`[${DECK_UI_ATTRIBUTE}="controls"]`);
    if (existing && existing !== controls) existing.remove();
    const isCorrectlyPlaced = controls.isConnected && controls.previousElementSibling === anchor && controls.parentElement === anchor.parentElement;
    if (!isCorrectlyPlaced) {
      if (controls.isConnected) controls.remove();
      anchor.insertAdjacentElement("afterend", controls);
    }
    failedAttachAttempts = 0;
  };
  attach();
  const reattachTimer = window.setInterval(attach, REATTACH_INTERVAL_MS);
  const unsubscribeDeck = subscribeDeck((items2) => {
    count = items2.length;
    if (count === 0) panelOpen = false;
    if (count > 0 && status === "flash") setStatus("idle");
    else render(items2);
  });
  const unsubscribeMode = subscribeDeckMode((mode2) => {
    batchMode = mode2 === "batch";
    render();
  });
  return {
    update: (nextCount) => {
      count = nextCount;
      if (count === 0) panelOpen = false;
      if (count > 0 && status === "flash") setStatus("idle");
      else render();
    },
    destroy: () => {
      window.clearInterval(reattachTimer);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("pointerdown", onPointerDownOutsidePanel, true);
      if (flashTimer !== void 0) window.clearTimeout(flashTimer);
      endDragTracking();
      unsubscribeDeck();
      unsubscribeMode();
      panel.remove();
      controls.remove();
    }
  };
};

// src/format-deck.ts
var formatDeck = (items2) => items2.map((item, index) => `${index + 1}.
${item.content}`).join(DECK_ITEM_SEPARATOR);

// src/deck-plugin.ts
var fencePayload = (content) => {
  const longestRun = content.match(/`+/g)?.reduce((max, run) => Math.max(max, run.length), 0) ?? 0;
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return fence + "\n" + content + "\n" + fence;
};
var copyDeckToClipboard = async () => {
  const items2 = getDeckItems();
  const output = formatDeck(items2);
  const didCopy = items2.length > 0 && await copyTextToClipboard(output);
  if (didCopy) removeDeckItems(items2.map((item) => item.id));
  const result = { itemCount: items2.length, output, didCopy };
  window.dispatchEvent(new CustomEvent("react-grab-deck:copy", { detail: result }));
  return result;
};
var createDeckPlugin = () => ({
  name: DECK_PLUGIN_NAME,
  hooks: {
    // Runs before react-grab prepends the typed comment, so the fence wraps
    // only the element payload and the comment stays readable above it.
    transformCopyContent: fencePayload,
    // Content arrives as `comment\n<fenced payload>` (comment optional) —
    // every successful grab lands in the deck alongside the clipboard write.
    onCopySuccess: (_elements, content) => {
      queueDeckItemIfBatch(content);
    }
  },
  setup: () => {
    const ui = createDeckUi(async () => (await copyDeckToClipboard()).didCopy);
    const unsubscribe = subscribeDeck((items2) => ui.update(items2.length));
    return {
      cleanup: () => {
        unsubscribe();
        ui.destroy();
        return void 0;
      }
    };
  }
});

// src/register.ts
var getReactGrabApi = () => window.__REACT_GRAB__;
var tryRegister = (createPlugin) => {
  const api = getReactGrabApi();
  if (!api || typeof api.registerPlugin !== "function") return false;
  try {
    api.registerPlugin(createPlugin());
  } catch (error) {
    console.error("[react-grab-text] Failed to register plugin:", error);
  }
  return true;
};
var registerWhenReady = (createPlugin) => {
  if (typeof window === "undefined") return;
  if (tryRegister(createPlugin)) return;
  const handleInit = () => {
    tryRegister(createPlugin);
  };
  window.addEventListener("react-grab:init", handleInit, { once: true });
};
var registerTextPlugin = () => {
  registerWhenReady(createTextPlugin);
};
var registerDeckPlugin = () => {
  registerWhenReady(createDeckPlugin);
};
