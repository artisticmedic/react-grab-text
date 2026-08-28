import { DECK_UI_ATTRIBUTE, REACT_GRAB_IGNORE_ATTRIBUTE, REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE } from "./constants.js";
import { updateDeckItem, type DeckItem } from "./deck-store.js";

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

const createItemField = (content: string, onCommit: (next: string) => void): HTMLTextAreaElement => {
  const field = document.createElement("textarea");
  field.value = content;
  field.rows = 3;
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

  field.addEventListener("focus", () => {
    field.style.outline = `1px solid ${t.borderFocus}`;
    field.style.outlineOffset = "2px";
  });
  field.addEventListener("blur", () => {
    field.style.outline = "none";
    field.style.outlineOffset = "0";
    onCommit(field.value);
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
  button.addEventListener("focus-visible", () => {
    button.style.outline = `1px solid ${t.borderFocus}`;
    button.style.outlineOffset = "2px";
  });
  button.addEventListener("blur", () => {
    button.style.outline = "none";
    button.style.outlineOffset = "0";
  });
  return button;
};

export interface DeckPanelView {
  panel: HTMLDivElement;
  render: (
    items: readonly DeckItem[],
    handlers: {
      onCopyAll: () => void;
      onClearAll: () => void;
      onRemoveItem: (id: string) => void;
    },
  ) => void;
}

export const createDeckPanelView = (): DeckPanelView => {
  const panel = createDeckPanel();

  const render = (
    items: readonly DeckItem[],
    handlers: {
      onCopyAll: () => void;
      onClearAll: () => void;
      onRemoveItem: (id: string) => void;
    },
  ): void => {
    panel.replaceChildren();
    if (items.length === 0) return;

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

    for (const [index, item] of items.entries()) {
      const row = document.createElement("article");
      row.setAttribute(DECK_UI_ATTRIBUTE, "panel-item");
      Object.assign(row.style, {
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      });

      const indexLabel = document.createElement("span");
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

      const field = createItemField(item.content, (next) => {
        if (next.trim()) updateDeckItem(item.id, next);
      });
      field.setAttribute(DECK_UI_ATTRIBUTE, "panel-preview");

      const deleteButton = createIconButton("Remove from deck", "delete-item", "×", {
        fontSize: "16px",
        marginTop: "-1px",
      });
      deleteButton.setAttribute("data-deck-item-id", item.id);
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handlers.onRemoveItem(item.id);
      });

      row.append(indexLabel, field, deleteButton);
      scroll.append(row);
    }

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
    countLabel.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

    const separator = document.createElement("span");
    separator.textContent = "·";
    separator.setAttribute("aria-hidden", "true");

    const clearButton = createIconButton("Clear all deck items", "clear-all", "Clear", {
      fontSize: "11px",
      minWidth: "0",
      minHeight: "24px",
      padding: "4px 0",
    });
    clearButton.addEventListener("click", (event) => {
      event.stopPropagation();
      handlers.onClearAll();
    });

    meta.append(countLabel, separator, clearButton);

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
    copyButton.addEventListener("click", (event) => {
      event.stopPropagation();
      handlers.onCopyAll();
    });

    footer.append(meta, copyButton);
    panel.style.display = "flex";
    panel.append(scroll, footer);
  };

  return { panel, render };
};
