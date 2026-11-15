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
  createMeasurePlugin: () => createMeasurePlugin,
  createTextPlugin: () => createTextPlugin,
  formatDeck: () => formatDeck,
  getActiveEditSession: () => getActiveEditSession,
  getDeckItems: () => getDeckItems,
  getDeckMode: () => getDeckMode,
  isBatchMode: () => isBatchMode,
  queueDeckItemIfBatch: () => queueDeckItemIfBatch,
  registerDeckPlugin: () => registerDeckPlugin,
  registerMeasurePlugin: () => registerMeasurePlugin,
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
  const firstLine2 = textContent.trim().split("\n")[0] ?? "";
  const textPreview = escapeText(truncate(firstLine2, PREVIEW_MAX_TEXT_LENGTH));
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

// src/utils/react-grab-theme.ts
var REACT_GRAB_HOST_SELECTOR = "[data-react-grab]";
var TOKEN_NAMES = [
  "--rg-panel-bg",
  "--rg-text-primary",
  "--rg-text-primary-85",
  "--rg-text-secondary",
  "--rg-border-subtle",
  "--rg-border-button",
  "--rg-surface-hover",
  "--rg-surface-active",
  "--rg-submit-bg",
  "--rg-submit-fg",
  "--rg-shadow",
  "--rg-error-text"
];
var rg = {
  panelBg: "var(--rg-panel-bg, #161616)",
  text: "var(--rg-text-primary, #ffffff)",
  text85: "var(--rg-text-primary-85, #ffffffd9)",
  textMuted: "var(--rg-text-secondary, #a7a7a7)",
  borderSubtle: "var(--rg-border-subtle, #ffffff1a)",
  borderButton: "var(--rg-border-button, #ffffff33)",
  surfaceHover: "var(--rg-surface-hover, #ffffff1a)",
  surfaceActive: "var(--rg-surface-active, #ffffff26)",
  submitBg: "var(--rg-submit-bg, #ffffff)",
  submitFg: "var(--rg-submit-fg, #161616)",
  shadow: "var(--rg-shadow, 0 2px 8px #00000014)",
  errorText: "var(--rg-error-text, #f87171)",
  font: "Geist, ui-sans-serif, system-ui, sans-serif",
  easeDrawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
var adoptReactGrabTheme = (element) => {
  const host = document.querySelector(REACT_GRAB_HOST_SELECTOR);
  if (!host) return;
  const computed = getComputedStyle(host);
  for (const name of TOKEN_NAMES) {
    const value = computed.getPropertyValue(name).trim();
    if (value) element.style.setProperty(name, value);
  }
};

// src/utils/create-hint-pill.ts
var ARROW_WIDTH_PX = 16;
var ARROW_HEIGHT_PX = 8;
var TARGET_GAP_PX = 12;
var PILL_HEIGHT_PX = 28;
var FADE_MS = 125;
var SVG_NS = "http://www.w3.org/2000/svg";
var REACT_GRAB_CHECK_CIRCLE_PATH = "M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L11 14.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L17.7071 10.7071Z";
var svgElement = (tag, attributes) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
};
var createStatusIcon = (kind, color) => {
  const svg = svgElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    "aria-hidden": "true"
  });
  svg.style.flexShrink = "0";
  svg.style.color = color;
  if (kind === "check") {
    svg.append(
      svgElement("path", {
        fill: "currentColor",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: REACT_GRAB_CHECK_CIRCLE_PATH
      })
    );
    return svg;
  }
  svg.append(svgElement("circle", { cx: "12", cy: "12", r: "10", fill: "currentColor" }));
  const mark = kind === "minus" ? "M8 12h8" : "M9 9l6 6M15 9l-6 6";
  svg.append(
    svgElement("path", {
      d: mark,
      fill: "none",
      stroke: rg.panelBg,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })
  );
  return svg;
};
var createArrow = () => {
  const arrow = svgElement("svg", {
    width: String(ARROW_WIDTH_PX),
    height: String(ARROW_HEIGHT_PX),
    viewBox: `0 0 ${ARROW_WIDTH_PX} ${ARROW_HEIGHT_PX}`,
    "aria-hidden": "true"
  });
  arrow.append(
    svgElement("path", {
      fill: rg.panelBg,
      d: "M0 8 L7.2929 0.7071 A1 1 0 0 1 8.7071 0.7071 L16 8 Z"
    })
  );
  Object.assign(arrow.style, { position: "absolute", display: "block" });
  return arrow;
};
var createHintPill = () => {
  const root = document.createElement("div");
  root.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  root.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  root.setAttribute(UI_ATTRIBUTE, "true");
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  adoptReactGrabTheme(root);
  Object.assign(root.style, {
    position: "fixed",
    pointerEvents: "none",
    top: "0",
    left: "0",
    zIndex: String(OVERLAY_Z_INDEX),
    fontFamily: rg.font,
    fontSize: "13px",
    WebkitFontSmoothing: "antialiased",
    userSelect: "none",
    filter: `drop-shadow(${rg.shadow})`,
    visibility: "hidden",
    opacity: "0",
    transition: `opacity ${FADE_MS}ms ease-out`
  });
  const arrow = createArrow();
  const pill = document.createElement("div");
  Object.assign(pill.style, {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxSizing: "border-box",
    height: `${PILL_HEIGHT_PX}px`,
    padding: "6px 10px 6px 8px",
    borderRadius: "9999px",
    background: rg.panelBg,
    whiteSpace: "nowrap"
  });
  root.append(arrow, pill);
  document.body.appendChild(root);
  const setContent = (icon, labelText) => {
    const label = document.createElement("span");
    label.textContent = labelText;
    Object.assign(label.style, {
      color: rg.text,
      fontSize: "13px",
      lineHeight: "16px",
      fontWeight: "500"
    });
    pill.replaceChildren(icon, label);
  };
  return {
    showCopied: (label = "Copied") => {
      setContent(createStatusIcon("check", rg.text85), label);
    },
    showNoChange: () => {
      setContent(createStatusIcon("minus", rg.textMuted), "No text change");
    },
    showError: (message) => {
      setContent(createStatusIcon("cross", rg.errorText), message);
    },
    reposition: (targetRect) => {
      const width = root.getBoundingClientRect().width;
      const margin = HINT_PILL_VIEWPORT_MARGIN_PX;
      const centerX = targetRect.left + targetRect.width / 2;
      let top = targetRect.bottom + TARGET_GAP_PX;
      const fitsBelow = top + PILL_HEIGHT_PX <= window.innerHeight - margin;
      if (!fitsBelow) top = targetRect.top - TARGET_GAP_PX - PILL_HEIGHT_PX;
      top = Math.max(top, margin);
      const maxLeft = window.innerWidth - width - margin;
      const left = Math.min(Math.max(centerX - width / 2, margin), maxLeft);
      const arrowInset = PILL_HEIGHT_PX / 2 + ARROW_WIDTH_PX / 2;
      const arrowCenter = Math.min(Math.max(centerX - left, arrowInset), width - arrowInset);
      Object.assign(arrow.style, {
        left: `${arrowCenter - ARROW_WIDTH_PX / 2}px`,
        top: fitsBelow ? `${1 - ARROW_HEIGHT_PX}px` : `${PILL_HEIGHT_PX - 1}px`,
        transform: fitsBelow ? "none" : "rotate(180deg)"
      });
      root.style.top = `${top}px`;
      root.style.left = `${left}px`;
      root.style.visibility = "visible";
      requestAnimationFrame(() => {
        root.style.opacity = "1";
      });
    },
    destroy: () => {
      root.style.opacity = "0";
      window.setTimeout(() => root.remove(), FADE_MS);
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
var SVG_NS2 = "http://www.w3.org/2000/svg";
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
  const svg = document.createElementNS(SVG_NS2, "svg");
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
      const group = document.createElementNS(SVG_NS2, "g");
      const path = document.createElementNS(SVG_NS2, "path");
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
var SVG_NS3 = "http://www.w3.org/2000/svg";
var createToolbarIconSvg = () => {
  const svg = document.createElementNS(SVG_NS3, "svg");
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
    const path = document.createElementNS(SVG_NS3, "path");
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
var DECK_CONTROLS_CLASS = "relative overflow-visible flex items-center shrink-0";
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

// src/deck-preview.ts
var stripFence = (content) => {
  const fenceStart = content.indexOf("```");
  if (fenceStart === -1) {
    return { comment: null, body: content.trim() };
  }
  const comment = content.slice(0, fenceStart).trim() || null;
  const afterFence = content.slice(fenceStart + 3);
  const fenceEnd = afterFence.lastIndexOf("```");
  const inner = fenceEnd === -1 ? afterFence.trim() : afterFence.slice(0, fenceEnd).replace(/^\n/, "").trim();
  return { comment, body: inner };
};
var formatDeckItemPreview = (content) => {
  const { comment, body } = stripFence(content);
  return { comment, body: body.trim() };
};

// src/deck-summary.ts
var CONTEXT_WORDS = 3;
var ELLIPSIS = "\u2026";
var OPENING_TAG_PATTERN = /<([a-z][\w-]*)\b[^>]*>/i;
var COMPONENT_PATTERN = /(?:^|\s)in ([A-Z][\w$.]*)(?= \(at |\]|$)/m;
var decodeEntities = (value) => value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
var readTextBlock = (content, label) => {
  const block = content.match(new RegExp(`^${label}:\\n"""\\n([\\s\\S]*?)\\n"""$`, "m"));
  if (block) return block[1];
  const inline = content.match(new RegExp(`^${label}: "(.*)"$`, "m"));
  return inline ? inline[1] : null;
};
var tokenize = (text) => text.match(/\s+|[\p{L}\p{N}\p{M}'’_-]+|[^\s\p{L}\p{N}\p{M}]/gu) ?? [];
var isWord = (token) => /[\p{L}\p{N}]/u.test(token);
var takeContext = (tokens, fromEnd) => {
  const ordered = fromEnd ? [...tokens].reverse() : tokens;
  const kept = [];
  let words = 0;
  for (const token of ordered) {
    if (isWord(token)) {
      if (words === CONTEXT_WORDS) break;
      words += 1;
    }
    kept.push(token);
  }
  const isTruncated = kept.length < tokens.length;
  const text = (fromEnd ? kept.reverse() : kept).join("");
  if (!isTruncated) return text;
  return fromEnd ? `${ELLIPSIS}${text.trimStart()}` : `${text.trimEnd()}${ELLIPSIS}`;
};
var MAX_DIFF_CELLS = 4e4;
var diffTokens = (a, b) => {
  if (a.length * b.length > MAX_DIFF_CELLS) {
    return [
      { kind: "removed", tokens: a },
      { kind: "added", tokens: b }
    ];
  }
  const lengths = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i2 = a.length - 1; i2 >= 0; i2 -= 1) {
    for (let j2 = b.length - 1; j2 >= 0; j2 -= 1) {
      lengths[i2][j2] = a[i2] === b[j2] ? lengths[i2 + 1][j2 + 1] + 1 : Math.max(lengths[i2 + 1][j2], lengths[i2][j2 + 1]);
    }
  }
  const ops = [];
  const push = (kind, token) => {
    const last = ops[ops.length - 1];
    if (last?.kind === kind) last.tokens.push(token);
    else ops.push({ kind, tokens: [token] });
  };
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push("same", a[i]);
      i += 1;
      j += 1;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      push("removed", a[i]);
      i += 1;
    } else {
      push("added", b[j]);
      j += 1;
    }
  }
  while (i < a.length) push("removed", a[i++]);
  while (j < b.length) push("added", b[j++]);
  return ops;
};
var countWords = (tokens) => tokens.filter(isWord).length;
var diffWords = (before, after) => {
  const ops = diffTokens(tokenize(before), tokenize(after));
  const parts = [];
  const pushSame = (text) => {
    if (!text) return;
    const last = parts[parts.length - 1];
    if (last?.kind === "same") last.text += text;
    else parts.push({ kind: "same", text });
  };
  const pushChange = (kind, text) => {
    const word = text.trim();
    if (!word) {
      if (kind === "added") pushSame(text);
      return;
    }
    const [, leading = "", trailing = ""] = text.match(/^(\s*)[\s\S]*?(\s*)$/) ?? [];
    pushSame(leading);
    const previous = parts[parts.length - 1];
    if (!leading && previous && previous.kind !== "same") pushSame(" ");
    parts.push({ kind, text: word });
    pushSame(trailing);
  };
  for (const [index, op] of ops.entries()) {
    if (op.kind !== "same") {
      pushChange(op.kind, op.tokens.join(""));
      continue;
    }
    if (index === 0) {
      pushSame(takeContext(op.tokens, true));
    } else if (index === ops.length - 1) {
      pushSame(takeContext(op.tokens, false));
    } else if (countWords(op.tokens) > CONTEXT_WORDS * 2) {
      const head = takeContext(op.tokens, false);
      const tail = takeContext(op.tokens, true);
      pushSame(`${head.slice(0, -ELLIPSIS.length)} ${ELLIPSIS} ${tail.slice(ELLIPSIS.length)}`);
    } else {
      pushSame(op.tokens.join(""));
    }
  }
  return parts;
};
var readReference = (content) => {
  const tag = content.match(OPENING_TAG_PATTERN);
  if (!tag || tag.index === void 0) return { element: null, text: null, component: null };
  const rest = content.slice(tag.index);
  const component = rest.match(COMPONENT_PATTERN);
  const snippet = component?.index === void 0 ? rest : rest.slice(0, component.index);
  const text = decodeEntities(snippet.replace(/<[^>]*>/g, " ").replace(/[\[\]`]/g, "")).replace(/\s+/g, " ").trim();
  return {
    element: tag[1].toLowerCase(),
    text: text || null,
    component: component?.[1] ?? null
  };
};
var firstLine = (text) => text.split("\n").map((line) => line.trim()).find((line) => line && !/^`{3,}$/.test(line)) ?? "";
var summarizeDeckItem = (content) => {
  const reference = readReference(content);
  const location = { element: reference.element, component: reference.component };
  const before = readTextBlock(content, "BEFORE");
  const after = readTextBlock(content, "AFTER");
  if (before !== null && after !== null) {
    return { kind: "text", parts: diffWords(before, after), ...location };
  }
  const { comment, body } = formatDeckItemPreview(content);
  if (comment) {
    return { kind: "comment", parts: [{ kind: "same", text: comment }], ...location };
  }
  if (reference.element) {
    const label = reference.text ?? `<${reference.element}>`;
    return { kind: "grab", parts: [{ kind: "same", text: label }], ...location };
  }
  return { kind: "note", parts: [{ kind: "same", text: firstLine(body) }], ...location };
};
var DECK_ITEM_KIND_LABEL = {
  text: "Text edit",
  comment: "Comment",
  grab: "Grab",
  note: "Note"
};

// src/deck-panel.ts
var ITEM_ID_ATTR = "data-deck-item-id";
var STYLE_ELEMENT_ID2 = "react-grab-deck-panel-styles";
var SVG_NS4 = "http://www.w3.org/2000/svg";
var part = (name) => `[${DECK_UI_ATTRIBUTE}="${name}"]`;
var P = part("panel");
var PANEL_CSS = `
${P} *:not(svg, svg *) { all: revert; }
${P} {
  position: fixed;
  flex-direction: column;
  box-sizing: border-box;
  min-width: min(360px, calc(100vw - 24px));
  max-width: min(400px, calc(100vw - 24px));
  max-height: min(400px, 52vh);
  overflow: hidden;
  border-radius: 14px;
  corner-shape: superellipse(1.25);
  background: ${rg.panelBg};
  color: ${rg.text};
  box-shadow: ${rg.shadow};
  font: 500 13px/16px ${rg.font};
  letter-spacing: normal;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  font-synthesis: none;
  z-index: 2147483645;
  animation: react-grab-deck-panel-in 180ms ${rg.easeDrawer};
}
@keyframes react-grab-deck-panel-in {
  from { opacity: 0; transform: scale(0.98); }
}
${P} *, ${P} *::before, ${P} *::after { box-sizing: border-box; }
${P} button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
${P} button:focus-visible {
  outline: 1px solid ${rg.borderButton};
  outline-offset: 1px;
}

${P} ${part("panel-header")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 4px 4px 8px;
}
${P} ${part("panel-title")} { display: flex; align-items: baseline; gap: 4px; min-width: 0; }
${P} ${part("panel-count")} { color: ${rg.textMuted}; font-variant-numeric: tabular-nums; }
${P} ${part("clear-all")} {
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  color: ${rg.textMuted};
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
${P} ${part("clear-all")}:hover { color: ${rg.text}; background: ${rg.surfaceHover}; }

${P} ${part("panel-list")} {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-top: 0.5px solid ${rg.borderSubtle};
  scrollbar-width: thin;
  scrollbar-color: ${rg.borderButton} transparent;
}
${P} ${part("panel-item")} {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 6px 8px 8px;
  transition: background-color 150ms ease-out;
}
${P} ${part("panel-item")} + ${part("panel-item")} { border-top: 0.5px solid ${rg.borderSubtle}; }
${P} ${part("panel-item")}:hover,
${P} ${part("panel-item")}:focus-within { background: ${rg.surfaceHover}; }
${P} ${part("panel-index")} {
  flex: none;
  min-width: 12px;
  color: ${rg.textMuted};
  line-height: 18px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
${P} ${part("panel-summary")} {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  text-align: left;
  cursor: text;
}
${P} ${part("panel-summary")}[hidden] { display: none; }
${P} ${part("panel-summary")}::after {
  content: "";
  position: absolute;
  inset: 0;
}
${P} ${part("panel-summary")}:focus-visible { outline: none; }
${P} ${part("panel-item")}:has(${part("panel-summary")}:focus-visible) {
  box-shadow: inset 0 0 0 1px ${rg.borderButton};
}
${P} ${part("panel-summary-text")} {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${rg.text85};
  font-weight: 400;
  line-height: 18px;
  overflow-wrap: anywhere;
}
${P} ${part("panel-summary-text")}[data-kind="text"] { color: ${rg.textMuted}; }
${P} ${part("panel-summary-text")} del {
  color: ${rg.textMuted};
  text-decoration: line-through;
  text-decoration-color: ${rg.textMuted};
}
${P} ${part("panel-summary-text")} ins {
  color: ${rg.text};
  font-weight: 500;
  text-decoration: none;
}
${P} ${part("panel-meta")} {
  overflow: hidden;
  color: ${rg.textMuted};
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
${P} ${part("panel-preview")} {
  flex: 1;
  min-width: 0;
  min-height: 18px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: ${rg.text};
  font: 400 13px/18px ${rg.font};
  resize: none;
  outline: none;
  overflow: hidden;
  overflow-wrap: anywhere;
}
${P} ${part("delete-item")} {
  position: relative;
  z-index: 1;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border-radius: 4px;
  color: ${rg.textMuted};
  opacity: 0;
  transition: opacity 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out;
}
${P} ${part("panel-item")}:hover ${part("delete-item")},
${P} ${part("panel-item")}:focus-within ${part("delete-item")} { opacity: 1; }
${P} ${part("delete-item")}:hover { color: ${rg.text}; background: ${rg.surfaceActive}; }

${P} ${part("panel-footer")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 6px 6px 8px;
  border-top: 0.5px solid ${rg.borderSubtle};
}
${P} ${part("panel-mode-toggle")} {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  color: ${rg.textMuted};
  transition: color 150ms ease-out;
}
${P} ${part("panel-mode-toggle")}:hover,
${P} ${part("panel-mode-toggle")}[aria-pressed="true"] { color: ${rg.text}; }
${P} ${part("panel-switch")} {
  position: relative;
  width: 22px;
  height: 12px;
  border-radius: 9999px;
  background: ${rg.surfaceActive};
  transition: background-color 200ms ${rg.easeDrawer};
}
${P} ${part("panel-switch")}::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${rg.textMuted};
  transition: transform 200ms ${rg.easeDrawer}, background-color 200ms ${rg.easeDrawer};
}
${P} [aria-pressed="true"] ${part("panel-switch")} { background: ${rg.text}; }
${P} [aria-pressed="true"] ${part("panel-switch")}::after { transform: translateX(10px); background: ${rg.panelBg}; }
${P} ${part("copy-all")} {
  height: 28px;
  padding: 0 12px;
  font-variant-numeric: tabular-nums;
  border-radius: 9999px;
  background: ${rg.submitBg};
  color: ${rg.submitFg};
  transition: transform 400ms ${rg.easeSpring};
}
${P} ${part("copy-all")}:active {
  transform: scale(0.97);
  transition: transform 60ms cubic-bezier(0, 0, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  ${P}, ${P} *, ${P} *::after { transition: none !important; animation: none !important; }
}
`;
var ensurePanelStyles = () => {
  if (document.getElementById(STYLE_ELEMENT_ID2)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID2;
  style.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  style.textContent = PANEL_CSS;
  document.head.appendChild(style);
};
var markPanelControl = (element) => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};
var createPart = (tag, name) => {
  const element = document.createElement(tag);
  element.setAttribute(DECK_UI_ATTRIBUTE, name);
  return element;
};
var createButton = (name, label) => {
  const button = createPart("button", name);
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  markPanelControl(button);
  return button;
};
var createCrossIcon = () => {
  const svg = document.createElementNS(SVG_NS4, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "10");
  svg.setAttribute("height", "10");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS4, "path");
  path.setAttribute("d", "M6 6l12 12M18 6L6 18");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("stroke-linecap", "round");
  svg.append(path);
  return svg;
};
var createDeckPanel = () => {
  ensurePanelStyles();
  const panel = createPart("div", "panel");
  markPanelControl(panel);
  panel.style.display = "none";
  return panel;
};
var autosize = (field) => {
  field.style.height = "auto";
  field.style.height = `${field.scrollHeight}px`;
};
var renderSummary = (target, meta, content) => {
  const summary = summarizeDeckItem(content);
  target.setAttribute("data-kind", summary.kind);
  target.replaceChildren(
    ...summary.parts.map((piece) => {
      if (piece.kind === "same") return document.createTextNode(piece.text);
      const mark = document.createElement(piece.kind === "removed" ? "del" : "ins");
      mark.textContent = piece.text;
      return mark;
    })
  );
  meta.textContent = [
    DECK_ITEM_KIND_LABEL[summary.kind],
    summary.element ? `<${summary.element}>` : null,
    summary.component
  ].filter(Boolean).join(" \xB7 ");
};
var stopHostHandlers = (element) => {
  element.addEventListener("mousedown", (event) => event.stopPropagation());
  element.addEventListener("pointerdown", (event) => event.stopPropagation());
};
var createItemRow = (item, handlers) => {
  let content = item.content;
  let field = null;
  const row = createPart("article", "panel-item");
  row.setAttribute(ITEM_ID_ATTR, item.id);
  const indexLabel = createPart("span", "panel-index");
  indexLabel.setAttribute("data-deck-item-index", "true");
  const summaryButton = createPart("button", "panel-summary");
  summaryButton.type = "button";
  summaryButton.title = "Edit this item";
  summaryButton.setAttribute("aria-expanded", "false");
  markPanelControl(summaryButton);
  stopHostHandlers(summaryButton);
  const summaryText = createPart("span", "panel-summary-text");
  const meta = createPart("span", "panel-meta");
  summaryButton.append(summaryText, meta);
  const deleteButton = createButton("delete-item", "Remove from deck");
  deleteButton.append(createCrossIcon());
  deleteButton.setAttribute(ITEM_ID_ATTR, item.id);
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    handlers.onRemoveItem(item.id);
  });
  const collapse = () => {
    if (!field) return;
    const next = field.value;
    field.remove();
    field = null;
    summaryButton.hidden = false;
    summaryButton.setAttribute("aria-expanded", "false");
    if (!next.trim()) {
      handlers.onRemoveItem(item.id);
      return;
    }
    content = next.trim();
    renderSummary(summaryText, meta, content);
    handlers.onUpdateItem(item.id, next);
  };
  const expand = () => {
    if (field) return;
    field = createPart("textarea", "panel-preview");
    field.value = content;
    field.rows = 1;
    field.spellcheck = false;
    field.setAttribute(ITEM_ID_ATTR, item.id);
    field.setAttribute("aria-label", "Deck item");
    markPanelControl(field);
    stopHostHandlers(field);
    field.addEventListener("input", () => {
      if (field) autosize(field);
    });
    field.addEventListener("blur", collapse);
    field.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Escape") {
        event.preventDefault();
        const editor = field;
        collapse();
        if (editor) summaryButton.focus();
      }
    });
    summaryButton.hidden = true;
    summaryButton.setAttribute("aria-expanded", "true");
    summaryButton.after(field);
    autosize(field);
    field.focus({ preventScroll: true });
    field.setSelectionRange(0, 0);
    row.scrollIntoView({ block: "nearest" });
  };
  summaryButton.addEventListener("click", (event) => {
    event.stopPropagation();
    expand();
  });
  row.append(indexLabel, summaryButton, deleteButton);
  const setContent = (next) => {
    if (field || next === content) return;
    content = next;
    renderSummary(summaryText, meta, content);
  };
  renderSummary(summaryText, meta, content);
  return {
    row,
    setIndex: (index) => {
      indexLabel.textContent = String(index + 1);
    },
    setContent,
    field: () => field
  };
};
var createDeckPanelView = () => {
  const panel = createDeckPanel();
  const header = createPart("div", "panel-header");
  const title = createPart("div", "panel-title");
  const titleLabel = document.createElement("span");
  titleLabel.textContent = "Deck";
  const countLabel = createPart("span", "panel-count");
  title.append(titleLabel, countLabel);
  const clearButton = createButton("clear-all", "Clear all deck items");
  clearButton.textContent = "Clear";
  header.append(title, clearButton);
  const list = createPart("div", "panel-list");
  const footer = createPart("div", "panel-footer");
  const modeButton = createButton("panel-mode-toggle", "Turn batch mode off");
  const modeLabel = document.createElement("span");
  modeLabel.textContent = "Batch";
  const modeSwitch = createPart("span", "panel-switch");
  modeSwitch.setAttribute("aria-hidden", "true");
  modeButton.append(modeLabel, modeSwitch);
  const copyButton = createButton("copy-all", "Copy all deck items");
  copyButton.textContent = "Copy all";
  footer.append(modeButton, copyButton);
  panel.append(header, list, footer);
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
  const rowsById = /* @__PURE__ */ new Map();
  const setBatchActive = (active) => {
    modeButton.title = active ? "Batch mode on: grabs queue in the deck" : "Batch mode off: grabs copy to the clipboard only";
    modeButton.setAttribute("aria-label", active ? "Turn batch mode off" : "Turn batch mode on");
    modeButton.setAttribute("aria-pressed", String(active));
  };
  setBatchActive(true);
  const hasFocusedField = () => list.contains(document.activeElement) && document.activeElement instanceof HTMLTextAreaElement && document.activeElement.matches(`textarea${part("panel-preview")}`);
  const sync = (items2, handlers) => {
    if (items2.length === 0) {
      list.replaceChildren();
      rowsById.clear();
      return;
    }
    footerHandlers = handlers;
    adoptReactGrabTheme(panel);
    const noun = items2.length === 1 ? "item" : "items";
    countLabel.textContent = `${items2.length} ${noun}`;
    copyButton.textContent = `Copy ${items2.length} ${noun}`;
    copyButton.setAttribute("aria-label", `Copy all ${items2.length} deck ${noun}`);
    copyButton.title = `Copy all ${items2.length} deck ${noun}`;
    const nextIds = new Set(items2.map((item) => item.id));
    for (const [id, entry] of rowsById) {
      if (nextIds.has(id) || entry.field() === document.activeElement) continue;
      entry.row.remove();
      rowsById.delete(id);
    }
    const orderedRows = [];
    for (const [index, item] of items2.entries()) {
      let entry = rowsById.get(item.id);
      if (!entry) {
        entry = createItemRow(item, handlers);
        rowsById.set(item.id, entry);
      } else {
        entry.setContent(item.content);
      }
      entry.setIndex(index);
      orderedRows.push(entry.row);
    }
    for (const [index, row] of orderedRows.entries()) {
      if (list.children[index] !== row) list.insertBefore(row, list.children[index] ?? null);
    }
    while (list.children.length > orderedRows.length) {
      list.lastElementChild?.remove();
    }
    panel.style.display = "flex";
  };
  return { panel, hasFocusedField, setBatchActive, sync };
};

// src/utils/sync-toolbar-segment.ts
var syncToolbarSegment = (segment) => {
  let currentAnchor = null;
  let currentParent = null;
  const sync = () => {
    if (!currentAnchor || !currentParent) return;
    const anchorStyle = getComputedStyle(currentAnchor);
    segment.style.flexDirection = getComputedStyle(currentParent).flexDirection;
    segment.style.marginRight = anchorStyle.marginRight;
    segment.style.marginBottom = anchorStyle.marginBottom;
  };
  const observer = new MutationObserver(sync);
  return {
    attach: (anchor) => {
      if (anchor === currentAnchor && anchor.parentElement === currentParent) return;
      observer.disconnect();
      currentAnchor = anchor;
      currentParent = anchor.parentElement;
      observer.observe(anchor, { attributes: true, attributeFilter: ["class", "style"] });
      if (currentParent) observer.observe(currentParent, { attributes: true, attributeFilter: ["class", "style"] });
      sync();
    },
    destroy: () => observer.disconnect()
  };
};

// src/utils/get-toolbar-edge.ts
var getToolbarEdge = (control) => {
  const panel = control.closest("[data-react-grab-toolbar-panel]");
  if (!panel) return "bottom";
  const bounds = panel.getBoundingClientRect();
  const isVertical = getComputedStyle(panel).flexDirection === "column";
  if (isVertical) return bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "left" : "right";
  return bounds.top + bounds.height / 2 < window.innerHeight / 2 ? "top" : "bottom";
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
  const layout = syncToolbarSegment(controls);
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
    const edge = getToolbarEdge(panelToggle);
    if (edge === "left" || edge === "right") {
      const toolbarBounds = panelToggle.closest("[data-react-grab-toolbar-panel]").getBoundingClientRect();
      const panelWidth2 = panel.offsetWidth || 420;
      const left2 = edge === "left" ? toolbarBounds.right + gap : toolbarBounds.left - gap - panelWidth2;
      panel.style.left = `${Math.max(12, Math.min(left2, window.innerWidth - panelWidth2 - 12))}px`;
      panel.style.top = `${Math.max(12, Math.min(rect.top, window.innerHeight - Math.min(panelHeight, 360) - 12))}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.maxHeight = `${Math.min(360, window.innerHeight - 24)}px`;
      return;
    }
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
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && panel.contains(focused)) focused.blur();
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
  const showCopiedPill = (copiedCount) => {
    const pill = createHintPill();
    pill.showCopied(`Copied ${copiedCount} ${copiedCount === 1 ? "item" : "items"}`);
    requestAnimationFrame(() => pill.reposition(deckButton.getBoundingClientRect()));
    window.setTimeout(() => pill.destroy(), SUCCESS_FLASH_DURATION_MS);
  };
  const copyAll = () => {
    if (status !== "idle" || count === 0) return;
    const copiedCount = count;
    panelOpen = false;
    setStatus("copying");
    void onCopyAll().then((didCopy) => {
      if (!didCopy) return;
      showCopiedPill(copiedCount);
      if (getDeckItems().length === 0) setStatus("flash");
    }).catch(() => {
    }).finally(() => {
      if (status === "copying") setStatus("idle");
    });
  };
  const panelHandlers = {
    onCopyAll: copyAll,
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
      copyAll();
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
  let lastPanelEdge = null;
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
    layout.attach(anchor);
    const existing = root?.querySelector(`[${DECK_UI_ATTRIBUTE}="controls"]`);
    if (existing && existing !== controls) existing.remove();
    const isCorrectlyPlaced = controls.isConnected && controls.previousElementSibling === anchor && controls.parentElement === anchor.parentElement;
    if (!isCorrectlyPlaced) {
      if (controls.isConnected) controls.remove();
      anchor.insertAdjacentElement("afterend", controls);
    }
    const edge = getToolbarEdge(panelToggle);
    if (edge !== lastPanelEdge) {
      lastPanelEdge = edge;
      if (panelOpen) positionPanel();
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
      layout.destroy();
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

// src/measure-geometry.ts
var axisGaps = (start, end, otherStart, otherEnd) => {
  if (end <= otherStart) return [[end, otherStart]];
  if (otherEnd <= start) return [[otherEnd, start]];
  return [
    [Math.min(start, otherStart), Math.max(start, otherStart)],
    [Math.min(end, otherEnd), Math.max(end, otherEnd)]
  ];
};
var measureDistances = (anchor, target) => {
  const lines = [];
  const horizontalY = (anchor.top + anchor.bottom) / 2;
  const verticalX = (anchor.left + anchor.right) / 2;
  for (const [start, end] of axisGaps(anchor.left, anchor.right, target.left, target.right)) {
    if (start === void 0 || end === void 0 || start === end) continue;
    lines.push({ x1: start, y1: horizontalY, x2: end, y2: horizontalY, value: end - start });
  }
  for (const [start, end] of axisGaps(anchor.top, anchor.bottom, target.top, target.bottom)) {
    if (start === void 0 || end === void 0 || start === end) continue;
    lines.push({ x1: verticalX, y1: start, x2: verticalX, y2: end, value: end - start });
  }
  return lines;
};
var formatMeasurement = (value) => String(Math.round(value * 10) / 10);

// src/measure-overlay.ts
var SVG_NS5 = "http://www.w3.org/2000/svg";
var VIEWPORT_INSET_PX = 8;
var LABEL_HEIGHT_PX = 22;
var NEGATIVE_MARGIN_PATTERN_ID = "negative-margin";
var svgNode = (tag, attributes) => {
  const element = document.createElementNS(SVG_NS5, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};
var createMeasureOverlay = (control) => {
  const host = document.createElement("div");
  host.setAttribute("data-react-grab-measure", "overlay");
  host.setAttribute("data-react-grab-ignore", "true");
  host.style.cssText = `all:initial;position:fixed;inset:0;pointer-events:none;z-index:${OVERLAY_Z_INDEX};`;
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { --measure-ink: #7c3aed; --measure-anchor: #2563eb; }
    svg { position:fixed; inset:0; width:100%; height:100%; overflow:hidden; }
    .details, .hint { position:fixed; box-sizing:border-box; margin:0; color:#fafafa;
      background:#202024; border:1px solid #414147; border-radius:6px;
      box-shadow:0 2px 8px #0002; font:12px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      font-variant-numeric:tabular-nums; -webkit-font-smoothing:antialiased; }
    .details { padding:6px 9px; max-width:calc(100vw - 16px); white-space:pre-wrap; }
    .hint { width:max-content; padding:5px 10px;
      max-width:calc(100vw - 16px); text-align:center; }
    text { font:11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      font-variant-numeric:tabular-nums; fill:white; }
  `;
  const svg = document.createElementNS(SVG_NS5, "svg");
  svg.setAttribute("aria-hidden", "true");
  const hatch = svgNode("pattern", {
    id: NEGATIVE_MARGIN_PATTERN_ID,
    width: 6,
    height: 6,
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  });
  hatch.append(
    svgNode("rect", { width: 6, height: 6, fill: "#f59e0b26" }),
    svgNode("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#f59e0b", "stroke-width": 2, "stroke-opacity": 0.5 })
  );
  const defs = svgNode("defs", {});
  defs.append(hatch);
  svg.append(defs);
  const details = document.createElement("div");
  details.className = "details";
  details.setAttribute("data-measure-details", "");
  const hint = document.createElement("div");
  hint.className = "hint";
  hint.setAttribute("data-measure-hint", "");
  hint.setAttribute("role", "status");
  root.append(style, svg, details, hint);
  document.body.append(host);
  let lastSignature = "";
  let hintBox = { text: "", maxWidth: "", width: 0, height: 0 };
  const shape = (tag, attributes) => {
    svg.append(svgNode(tag, attributes));
  };
  const box = (left, top, width, height, fill, stroke = "none") => {
    shape("rect", { x: left, y: top, width: Math.max(0, width), height: Math.max(0, height), fill, stroke });
  };
  const line = (x1, y1, x2, y2, color, dashed = false) => {
    shape("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 1, ...dashed ? { "stroke-dasharray": "3 3" } : {} });
  };
  const badge = (x, y, value) => {
    const width = value.length * 7 + 12;
    const left = Math.max(VIEWPORT_INSET_PX, Math.min(x - width / 2, innerWidth - width - VIEWPORT_INSET_PX));
    const top = Math.max(VIEWPORT_INSET_PX, Math.min(y - LABEL_HEIGHT_PX / 2, innerHeight - LABEL_HEIGHT_PX - VIEWPORT_INSET_PX));
    shape("rect", { x: left, y: top, width, height: LABEL_HEIGHT_PX, rx: 4, fill: "var(--measure-ink)" });
    const text = document.createElementNS(SVG_NS5, "text");
    text.setAttribute("x", String(left + width / 2));
    text.setAttribute("y", String(top + 15));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("data-measure-distance", value);
    text.textContent = value;
    svg.append(text);
  };
  return {
    host,
    render: (target, anchor) => {
      const element = target ?? anchor;
      const bounds = element?.getBoundingClientRect();
      const anchorBounds = anchor?.getBoundingClientRect();
      const computed = element ? getComputedStyle(element) : null;
      const padding = ["Top", "Right", "Bottom", "Left"].map((side) => parseFloat(computed?.getPropertyValue(`padding-${side.toLowerCase()}`) ?? "0") || 0);
      const margin = ["top", "right", "bottom", "left"].map((side) => parseFloat(computed?.getPropertyValue(`margin-${side}`) ?? "0") || 0);
      const border = ["top", "right", "bottom", "left"].map((side) => parseFloat(computed?.getPropertyValue(`border-${side}-width`) ?? "0") || 0);
      const name = element ? `${element.localName}${element.id ? `#${element.id}` : ""}` : "";
      const toolbarBounds = control.closest("[data-react-grab-toolbar-panel]")?.getBoundingClientRect() ?? control.getBoundingClientRect();
      const edge = getToolbarEdge(control);
      const signature = JSON.stringify([bounds, anchorBounds, padding, margin, border, name, target === anchor, innerWidth, innerHeight, toolbarBounds, edge]);
      if (signature === lastSignature) return;
      lastSignature = signature;
      const scaleX = element instanceof HTMLElement && bounds && element.offsetWidth ? bounds.width / element.offsetWidth : 1;
      const scaleY = element instanceof HTMLElement && bounds && element.offsetHeight ? bounds.height / element.offsetHeight : 1;
      svg.replaceChildren(defs);
      const hintText = anchor ? "Hover another element to measure \xB7 Click to change anchor \xB7 Esc to clear" : "Measure \xB7 Hover to inspect \xB7 Click to anchor \xB7 Esc to exit";
      const isVertical = edge === "left" || edge === "right";
      const hintMaxWidth = `${Math.min(isVertical ? 260 : 600, window.innerWidth - VIEWPORT_INSET_PX * 2)}px`;
      if (hintText !== hintBox.text || hintMaxWidth !== hintBox.maxWidth) {
        hint.textContent = hintText;
        hint.style.maxWidth = hintMaxWidth;
        hintBox = { text: hintText, maxWidth: hintMaxWidth, width: hint.offsetWidth, height: hint.offsetHeight };
      }
      const { width: hintWidth, height: hintHeight } = hintBox;
      const hintLeft = edge === "left" ? toolbarBounds.right + VIEWPORT_INSET_PX : edge === "right" ? toolbarBounds.left - hintWidth - VIEWPORT_INSET_PX : toolbarBounds.left + (toolbarBounds.width - hintWidth) / 2;
      const hintTop = edge === "top" ? toolbarBounds.bottom + VIEWPORT_INSET_PX : edge === "bottom" ? toolbarBounds.top - hintHeight - VIEWPORT_INSET_PX : toolbarBounds.top + (toolbarBounds.height - hintHeight) / 2;
      hint.style.left = `${Math.max(VIEWPORT_INSET_PX, Math.min(hintLeft, window.innerWidth - hintWidth - VIEWPORT_INSET_PX))}px`;
      hint.style.top = `${Math.max(VIEWPORT_INSET_PX, Math.min(hintTop, window.innerHeight - hintHeight - VIEWPORT_INSET_PX))}px`;
      details.hidden = !bounds;
      if (!bounds || !element) return;
      const { left, top, right, bottom, width, height } = bounds;
      const [paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0] = padding;
      const [marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0] = margin;
      const [borderTop = 0, borderRight = 0, borderBottom = 0, borderLeft = 0] = border;
      const marginFill = "#f59e0b30";
      const bandFill = (value) => value < 0 ? `url(#${NEGATIVE_MARGIN_PATTERN_ID})` : marginFill;
      const topBand = Math.abs(marginTop) * scaleY;
      const rightBand = Math.abs(marginRight) * scaleX;
      const bottomBand = Math.abs(marginBottom) * scaleY;
      const leftBand = Math.abs(marginLeft) * scaleX;
      box(left, marginTop < 0 ? top : top - topBand, width, topBand, bandFill(marginTop));
      box(marginRight < 0 ? right - rightBand : right, top, rightBand, height, bandFill(marginRight));
      box(left, marginBottom < 0 ? bottom - bottomBand : bottom, width, bottomBand, bandFill(marginBottom));
      box(marginLeft < 0 ? left : left - leftBand, top, leftBand, height, bandFill(marginLeft));
      const innerLeft = left + borderLeft * scaleX;
      const innerTop = top + borderTop * scaleY;
      const paddingBoxWidth = Math.max(0, width - (borderLeft + borderRight) * scaleX);
      const paddingBoxHeight = Math.max(0, height - (borderTop + borderBottom) * scaleY);
      const paddingFill = "#22c55e35";
      box(innerLeft, innerTop, paddingBoxWidth, paddingTop * scaleY, paddingFill);
      box(right - (borderRight + paddingRight) * scaleX, innerTop, paddingRight * scaleX, paddingBoxHeight, paddingFill);
      box(innerLeft, bottom - (borderBottom + paddingBottom) * scaleY, paddingBoxWidth, paddingBottom * scaleY, paddingFill);
      box(innerLeft, innerTop, paddingLeft * scaleX, paddingBoxHeight, paddingFill);
      box(left, top, width, height, "#7c3aed08", "var(--measure-ink)");
      for (const x of [left, right]) line(x, 0, x, window.innerHeight, "#7c3aed35", true);
      for (const y of [top, bottom]) line(0, y, window.innerWidth, y, "#7c3aed35", true);
      if (anchorBounds && target && target !== anchor) {
        box(anchorBounds.left, anchorBounds.top, anchorBounds.width, anchorBounds.height, "none", "var(--measure-anchor)");
        for (const measurement of measureDistances(anchorBounds, bounds)) {
          const { x1, y1, x2, y2, value } = measurement;
          const horizontal = y1 === y2;
          line(x1, y1, x2, y2, "var(--measure-ink)");
          for (const [x, y] of [[x1, y1], [x2, y2]]) {
            if (x === void 0 || y === void 0) continue;
            line(x - (horizontal ? 0 : 3), y - (horizontal ? 3 : 0), x + (horizontal ? 0 : 3), y + (horizontal ? 3 : 0), "var(--measure-ink)");
          }
          badge((x1 + x2) / 2, (y1 + y2) / 2, `${formatMeasurement(value)} px`);
        }
      }
      details.textContent = `${target === anchor ? "Anchor \xB7 " : ""}${name}  ${formatMeasurement(width)} \xD7 ${formatMeasurement(height)} px
Padding  ${padding.map(formatMeasurement).join("  ")}
Margin    ${margin.map(formatMeasurement).join("  ")}
Top \xB7 Right \xB7 Bottom \xB7 Left`;
      const detailsWidth = details.offsetWidth;
      const detailsHeight = details.offsetHeight;
      const preferredTop = top - detailsHeight - VIEWPORT_INSET_PX;
      details.style.left = `${Math.max(VIEWPORT_INSET_PX, Math.min(left, window.innerWidth - detailsWidth - VIEWPORT_INSET_PX))}px`;
      details.style.top = `${Math.max(VIEWPORT_INSET_PX, Math.min(preferredTop >= VIEWPORT_INSET_PX ? preferredTop : bottom + VIEWPORT_INSET_PX, window.innerHeight - detailsHeight - VIEWPORT_INSET_PX))}px`;
    },
    destroy: () => host.remove()
  };
};

// src/measure-plugin.ts
var ATTACH_INTERVAL_MS = 500;
var FAILED_ATTACH_WARN_AT2 = 20;
var DRAG_THRESHOLD_PX = 5;
var TOOL_UI_SELECTOR = "[data-react-grab], [data-react-grab-ignore], [data-react-grab-ignore-events]";
var createRulerIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.style.pointerEvents = "none";
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", "M3 7h18v10H3z M7 7v5 M11 7v3 M15 7v5 M19 7v3");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
};
var isToolEvent = (event) => event.composedPath().some(
  (node) => node instanceof Element && node.matches(TOOL_UI_SELECTOR)
);
var elementAtPoint = (x, y) => {
  let element = document.elementFromPoint(x, y);
  while (element?.shadowRoot) {
    const nested = element.shadowRoot.elementFromPoint(x, y);
    if (!nested || nested === element) break;
    element = nested;
  }
  if (!element || element.closest(TOOL_UI_SELECTOR) || element === document.documentElement) return null;
  return element;
};
var createMeasurePlugin = () => {
  let stop = () => {
  };
  return {
    name: "measure",
    hooks: { onStateChange: (state) => {
      if (state.isActive) stop();
    } },
    setup: (api) => {
      let overlay = null;
      let anchor = null;
      let pointer = null;
      let frame = 0;
      let press = null;
      const icon = createRulerIcon();
      const { wrapper, button } = createToolbarIconButton("measure", "Measure", icon);
      button.removeAttribute("data-react-grab-deck-ui");
      button.setAttribute("data-react-grab-measure", "toggle");
      button.setAttribute("aria-pressed", "false");
      const layout = syncToolbarSegment(wrapper);
      stop = () => {
        cancelAnimationFrame(frame);
        overlay?.destroy();
        overlay = null;
        anchor = null;
        pointer = null;
        button.setAttribute("aria-pressed", "false");
        applyIconColor(icon, false);
      };
      const render = () => {
        if (!overlay) return;
        if (anchor && !anchor.isConnected) anchor = null;
        const target = pointer ? elementAtPoint(pointer.x, pointer.y) : null;
        overlay.render(target ?? anchor, anchor);
        frame = requestAnimationFrame(render);
      };
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (press && press.peak > DRAG_THRESHOLD_PX) {
          press = null;
          return;
        }
        press = null;
        if (overlay) {
          stop();
          return;
        }
        void getActiveEditSession()?.commit();
        api.deactivate();
        overlay = createMeasureOverlay(button);
        button.setAttribute("aria-pressed", "true");
        applyIconColor(icon, true);
        render();
      });
      const onMove = (event) => {
        if (press) press.peak = Math.max(press.peak, Math.hypot(event.clientX - press.x, event.clientY - press.y));
        if (!overlay) return;
        pointer = isToolEvent(event) ? null : { x: event.clientX, y: event.clientY };
      };
      const onDown = (event) => {
        if (event.composedPath().includes(button)) {
          press = { x: event.clientX, y: event.clientY, peak: 0 };
          return;
        }
        if (!overlay) return;
        if (isToolEvent(event)) {
          stop();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
      };
      const onClick = (event) => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.button !== 0) return;
        anchor = elementAtPoint(event.clientX, event.clientY);
        pointer = { x: event.clientX, y: event.clientY };
      };
      const onContextMenu = (event) => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
      };
      const onPointerUp = (event) => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
      };
      const onKey = (event) => {
        if (!overlay) return;
        if (event.code === "Escape" || event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          if (anchor) anchor = null;
          else stop();
        } else if (event.key === "Tab") stop();
      };
      const onLeave = (event) => {
        if (!event.relatedTarget) pointer = null;
      };
      const onCancel = () => {
        press = null;
      };
      window.addEventListener("pointermove", onMove, true);
      window.addEventListener("pointerdown", onDown, true);
      window.addEventListener("click", onClick, true);
      window.addEventListener("auxclick", onClick, true);
      window.addEventListener("dblclick", onClick, true);
      window.addEventListener("contextmenu", onContextMenu, true);
      window.addEventListener("pointerup", onPointerUp, true);
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("mouseout", onLeave);
      window.addEventListener("blur", onCancel);
      window.addEventListener("pointercancel", onCancel);
      let failedAttachAttempts = 0;
      const attach = () => {
        failedAttachAttempts += 1;
        if (failedAttachAttempts === FAILED_ATTACH_WARN_AT2) {
          console.warn(
            "[react-grab-text] measure found no toolbar anchor after 10s \u2014 host toolbar markup may have changed"
          );
        }
        const root = document.querySelector("[data-react-grab]")?.shadowRoot;
        const actions = root?.querySelectorAll("[data-react-grab-toolbar-action]");
        const textAction = root?.querySelector('[data-react-grab-toolbar-action="text"]') ?? (actions?.length ? actions[actions.length - 1] : null);
        const anchorWrapper = textAction?.parentElement;
        if (anchorWrapper?.parentElement && wrapper.nextElementSibling !== anchorWrapper) {
          anchorWrapper.before(wrapper);
        }
        if (anchorWrapper) layout.attach(anchorWrapper);
        if (overlay && !wrapper.isConnected) stop();
        if (anchorWrapper) failedAttachAttempts = 0;
      };
      attach();
      const timer = window.setInterval(attach, ATTACH_INTERVAL_MS);
      return {
        cleanup: () => {
          stop();
          window.clearInterval(timer);
          layout.destroy();
          window.removeEventListener("pointermove", onMove, true);
          window.removeEventListener("pointerdown", onDown, true);
          window.removeEventListener("click", onClick, true);
          window.removeEventListener("auxclick", onClick, true);
          window.removeEventListener("dblclick", onClick, true);
          window.removeEventListener("contextmenu", onContextMenu, true);
          window.removeEventListener("pointerup", onPointerUp, true);
          window.removeEventListener("keydown", onKey, true);
          window.removeEventListener("mouseout", onLeave);
          window.removeEventListener("blur", onCancel);
          window.removeEventListener("pointercancel", onCancel);
          wrapper.remove();
          return void 0;
        }
      };
    }
  };
};

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
var registerMeasurePlugin = () => {
  registerWhenReady(createMeasurePlugin);
};
