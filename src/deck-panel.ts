import { DECK_UI_ATTRIBUTE, REACT_GRAB_IGNORE_ATTRIBUTE, REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE } from "./constants.js";
import { type DeckItem } from "./deck-store.js";

const markPanelControl = (element: HTMLElement): void => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};

const t = {
  bg: "var(--rg-panel-bg, #161616)",
  text: "var(--rg-text-primary, #ffffff)",
  textMuted: "var(--rg-text-secondary, #a7a7a7)",
  border: "var(--rg-border-subtle, rgba(255, 255, 255, 0.1))",
  borderFocus: "var(--rg-border-button, rgba(255, 255, 255, 0.2))",
  submitBg: "var(--rg-submit-bg, #ffffff)",
  submitFg: "var(--rg-submit-fg, #161616)",
  shadow: "var(--rg-shadow, 0 2px 8px rgba(0, 0, 0, 0.08))",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

const PANEL_RADIUS = "10px";
const PANEL_PAD = "12px";
const ITEM_GAP = "16px";
const FIELD_LINE = "1.45";
const ITEM_ID_ATTR = "data-deck-item-id";

const applyFocusVisibleRing = (element: HTMLElement): void => {
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

export const createDeckPanel = (): HTMLDivElement => {
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
    zIndex: "2147483645",
  });
  return panel;
};

type PanelHandlers = {
  onCopyAll: () => void;
  onClearAll: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, content: string) => void;
  onToggleMode: () => void;
};

const createItemField = (
  itemId: string,
  content: string,
  handlers: PanelHandlers,
): HTMLTextAreaElement => {
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
    outline: "none",
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

const createIconButton = (
  label: string,
  uiPart: string,
  text: string,
  extra?: Record<string, string>,
): HTMLButtonElement => {
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
    ...extra,
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

const createItemRow = (index: number, item: DeckItem, handlers: PanelHandlers): HTMLElement => {
  const row = document.createElement("article");
  row.setAttribute(DECK_UI_ATTRIBUTE, "panel-item");
  row.setAttribute(ITEM_ID_ATTR, item.id);
  Object.assign(row.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
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
    textAlign: "right",
  });

  const field = createItemField(item.id, item.content, handlers);
  field.setAttribute(DECK_UI_ATTRIBUTE, "panel-preview");

  const deleteButton = createIconButton("Remove from deck", "delete-item", "×", {
    fontSize: "16px",
    marginTop: "-1px",
  });
  deleteButton.setAttribute(ITEM_ID_ATTR, item.id);
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    handlers.onRemoveItem(item.id);
  });

  row.append(indexLabel, field, deleteButton);
  return row;
};

export interface DeckPanelView {
  panel: HTMLDivElement;
  hasFocusedField: () => boolean;
  setBatchActive: (active: boolean) => void;
  sync: (items: readonly DeckItem[], handlers: PanelHandlers) => void;
}

export const createDeckPanelView = (): DeckPanelView => {
  const panel = createDeckPanel();
  const scroll = document.createElement("div");
  Object.assign(scroll.style, {
    flex: "1",
    minHeight: "0",
    overflowY: "auto",
    padding: PANEL_PAD,
    display: "flex",
    flexDirection: "column",
    gap: ITEM_GAP,
  });

  const footer = document.createElement("footer");
  Object.assign(footer.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: `0 ${PANEL_PAD} ${PANEL_PAD}`,
    flexShrink: "0",
  });

  const meta = document.createElement("div");
  Object.assign(meta.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "0",
    color: t.textMuted,
    fontSize: "11px",
  });

  const countLabel = document.createElement("span");
  const separator = document.createElement("span");
  separator.textContent = "·";
  separator.setAttribute("aria-hidden", "true");

  // The toolbar affordance turns into copy-all as soon as an item is queued, so
  // it can no longer double as the mode toggle. The panel is reachable in exactly
  // that state, which makes the footer the one place batch mode stays switchable.
  const modeButton = createIconButton("Turn batch mode off", "panel-mode-toggle", "Batch on", {
    fontSize: "11px",
    minWidth: "0",
    minHeight: "24px",
    padding: "4px 0",
  });

  const clearButton = createIconButton("Clear all deck items", "clear-all", "Clear", {
    fontSize: "11px",
    minWidth: "0",
    minHeight: "24px",
    padding: "4px 0",
  });

  const copyButton = createIconButton("Copy all deck items", "copy-all", "Copy all", {
    flex: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    background: t.submitBg,
    color: t.submitFg,
    fontSize: "12px",
    fontWeight: "600",
    minWidth: "0",
  });
  copyButton.addEventListener("mouseenter", () => {
    copyButton.style.color = t.submitFg;
  });
  copyButton.addEventListener("mouseleave", () => {
    copyButton.style.color = t.submitFg;
  });

  let footerHandlers: PanelHandlers | null = null;

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

  const modeSeparator = separator.cloneNode(true) as HTMLSpanElement;

  meta.append(countLabel, separator, modeButton, modeSeparator, clearButton);
  footer.append(meta, copyButton);
  panel.append(scroll, footer);

  const getRowField = (row: Element): HTMLTextAreaElement | null =>
    row.querySelector(`textarea[${DECK_UI_ATTRIBUTE}="panel-preview"]`);

  // Colour carries the state, so the hover handlers createIconButton installed
  // have to be overridden or they would repaint it back to idle on mouseleave.
  let batchActive = true;
  const paintMode = (): void => {
    modeButton.style.color = batchActive ? t.text : t.textMuted;
  };
  const setBatchActive = (active: boolean): void => {
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

  const hasFocusedField = (): boolean =>
    scroll.contains(document.activeElement) &&
    document.activeElement instanceof HTMLTextAreaElement &&
    document.activeElement.matches(`textarea[${DECK_UI_ATTRIBUTE}="panel-preview"]`);

  const sync = (items: readonly DeckItem[], handlers: PanelHandlers): void => {
    if (items.length === 0) {
      scroll.replaceChildren();
      return;
    }

    footerHandlers = handlers;
    countLabel.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

    const nextIds = new Set(items.map((item) => item.id));
    const existingRows = [...scroll.querySelectorAll<HTMLElement>(`article[${DECK_UI_ATTRIBUTE}="panel-item"]`)];
    const rowsById = new Map(existingRows.map((row) => [row.getAttribute(ITEM_ID_ATTR), row] as const));

    for (const row of existingRows) {
      const id = row.getAttribute(ITEM_ID_ATTR);
      if (!id || nextIds.has(id)) continue;
      const field = getRowField(row);
      if (field === document.activeElement) continue;
      row.remove();
      rowsById.delete(id);
    }

    const orderedRows: HTMLElement[] = [];
    for (const [index, item] of items.entries()) {
      let row = rowsById.get(item.id);
      if (!row) {
        row = createItemRow(index, item, handlers);
        rowsById.set(item.id, row);
      } else {
        const indexLabel = row.querySelector<HTMLElement>("[data-deck-item-index]");
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
