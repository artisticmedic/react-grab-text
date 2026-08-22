import {
  DECK_COPIED_FLASH_DURATION_MS,
  DECK_UI_ATTRIBUTE,
  OVERLAY_Z_INDEX,
  REACT_GRAB_IGNORE_ATTRIBUTE,
} from "./constants.js";
import type { DeckItem } from "./deck-store.js";

export interface DeckPanelHandlers {
  onCopyAll: () => Promise<boolean>;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export interface DeckPanel {
  update: (items: DeckItem[]) => void;
  destroy: () => void;
}

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Deliberately not UI_ATTRIBUTE (the Text tool's namespace — its specs assert
// on it): the ignore attribute alone keeps react-grab from targeting deck UI.
const markAsDeckUi = (element: HTMLElement, role: string): void => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(DECK_UI_ATTRIBUTE, role);
};

const createFooterButton = (label: string, role: string): HTMLButtonElement => {
  const button = document.createElement("button");
  markAsDeckUi(button, role);
  button.type = "button";
  button.textContent = label;
  Object.assign(button.style, {
    flex: "1",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    background: "transparent",
    color: "#e4e4e7",
    fontFamily: FONT_STACK,
    fontSize: "11px",
    fontWeight: "500",
    cursor: "pointer",
  });
  return button;
};

export const createDeckPanel = (handlers: DeckPanelHandlers): DeckPanel => {
  const container = document.createElement("div");
  markAsDeckUi(container, "root");
  Object.assign(container.style, {
    position: "fixed",
    left: "12px",
    bottom: "12px",
    zIndex: String(OVERLAY_Z_INDEX),
    display: "none",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    fontFamily: FONT_STACK,
  });

  const panel = document.createElement("div");
  markAsDeckUi(panel, "panel");
  Object.assign(panel.style, {
    display: "none",
    flexDirection: "column",
    gap: "6px",
    width: "320px",
    maxHeight: "40vh",
    padding: "8px",
    borderRadius: "9px",
    background: "rgba(24, 24, 27, 0.96)",
    color: "#e4e4e7",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.45)",
  });

  const rowList = document.createElement("div");
  markAsDeckUi(rowList, "rows");
  Object.assign(rowList.style, {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    overflowY: "auto",
  });

  const footer = document.createElement("div");
  markAsDeckUi(footer, "footer");
  Object.assign(footer.style, { display: "flex", gap: "6px" });

  const copyAllButton = createFooterButton("Copy all", "copy-all");
  copyAllButton.style.background = "rgba(168, 85, 247, 0.22)";
  copyAllButton.style.borderColor = "rgba(168, 85, 247, 0.5)";
  const clearButton = createFooterButton("Clear", "clear");
  footer.append(copyAllButton, clearButton);
  panel.append(rowList, footer);

  const pill = document.createElement("button");
  markAsDeckUi(pill, "pill");
  pill.type = "button";
  Object.assign(pill.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "none",
    background: "rgba(24, 24, 27, 0.94)",
    color: "#e4e4e7",
    fontFamily: FONT_STACK,
    fontSize: "11px",
    lineHeight: "1",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
    userSelect: "none",
  });

  container.append(panel, pill);

  let isOpen = false;
  let itemCount = 0;
  let copiedFlashTimer: number | undefined;

  const syncVisibility = (): void => {
    const isFlashing = copiedFlashTimer !== undefined;
    container.style.display = itemCount > 0 || isFlashing ? "flex" : "none";
    panel.style.display = isOpen && itemCount > 0 ? "flex" : "none";
    if (!isFlashing) pill.textContent = `Deck ${itemCount}`;
  };

  const showCopiedFlash = (): void => {
    if (copiedFlashTimer !== undefined) window.clearTimeout(copiedFlashTimer);
    pill.textContent = "✓ Copied";
    copiedFlashTimer = window.setTimeout(() => {
      copiedFlashTimer = undefined;
      syncVisibility();
    }, DECK_COPIED_FLASH_DURATION_MS);
    syncVisibility();
  };

  const renderRow = (item: DeckItem, index: number): HTMLDivElement => {
    const row = document.createElement("div");
    markAsDeckUi(row, "row");
    Object.assign(row.style, {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 5px",
      borderRadius: "5px",
      fontSize: "11px",
    });
    const ordinal = document.createElement("span");
    ordinal.textContent = String(index + 1);
    Object.assign(ordinal.style, { color: "#a1a1aa", minWidth: "14px", textAlign: "right" });
    const preview = document.createElement("span");
    markAsDeckUi(preview, "row-preview");
    // First line is the comment when one was typed, the payload otherwise.
    preview.textContent = item.content.split("\n").find((line) => line !== "```") ?? "";
    Object.assign(preview.style, {
      flex: "1",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
    const removeButton = document.createElement("button");
    markAsDeckUi(removeButton, "remove");
    removeButton.type = "button";
    removeButton.textContent = "✕";
    removeButton.setAttribute("aria-label", `Remove deck item ${index + 1}`);
    Object.assign(removeButton.style, {
      border: "none",
      background: "transparent",
      color: "#a1a1aa",
      fontSize: "11px",
      cursor: "pointer",
      padding: "2px 4px",
    });
    removeButton.addEventListener("click", () => handlers.onRemove(item.id));
    row.append(ordinal, preview, removeButton);
    return row;
  };

  pill.addEventListener("click", () => {
    if (copiedFlashTimer !== undefined) return;
    isOpen = !isOpen;
    syncVisibility();
  });
  clearButton.addEventListener("click", () => handlers.onClear());
  copyAllButton.addEventListener("click", () => {
    void handlers.onCopyAll().then((didCopy) => {
      if (!didCopy) return;
      isOpen = false;
      showCopiedFlash();
    });
  });

  const mount = (): void => {
    document.body.appendChild(container);
  };
  // A script-tag install in <head> can register the plugin before <body>
  // exists; the panel defers mounting until the document is ready.
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });

  return {
    update: (items: DeckItem[]) => {
      itemCount = items.length;
      rowList.replaceChildren(...items.map(renderRow));
      if (itemCount === 0) isOpen = false;
      syncVisibility();
    },
    destroy: () => {
      if (copiedFlashTimer !== undefined) window.clearTimeout(copiedFlashTimer);
      container.remove();
    },
  };
};
