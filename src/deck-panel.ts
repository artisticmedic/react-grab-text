import { DECK_UI_ATTRIBUTE, REACT_GRAB_IGNORE_ATTRIBUTE, REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE } from "./constants.js";
import { type DeckItem } from "./deck-store.js";
import { DECK_ITEM_KIND_LABEL, summarizeDeckItem } from "./deck-summary.js";
import { adoptReactGrabTheme, rg } from "./utils/react-grab-theme.js";

const ITEM_ID_ATTR = "data-deck-item-id";
const STYLE_ELEMENT_ID = "react-grab-deck-panel-styles";
const SVG_NS = "http://www.w3.org/2000/svg";

const part = (name: string): string => `[${DECK_UI_ATTRIBUTE}="${name}"]`;
const P = part("panel");

// Sizes and timings of react-grab's own style panel, so the deck opens, scales
// and tracks the pointer the same way.
const PANEL_WIDTH_PX = 320;
const PANEL_ENTER_MS = 220;
export const PANEL_EXIT_MS = 120;
const HIGHLIGHT_MS = 75;

// Hover, focus and press states need real selectors, so the panel is styled
// from one sheet. The panel lives in the host page's light DOM, so the first
// rule rolls host element rules (a global `button { padding }`) back to the
// browser defaults. SVG is skipped because `all` would also revert its
// presentation attributes.
const PANEL_CSS = `
${P} *:not(svg, svg *) { all: revert; }
${P} {
  position: fixed;
  flex-direction: column;
  box-sizing: border-box;
  width: min(${PANEL_WIDTH_PX}px, calc(100vw - 24px));
  max-height: min(400px, 52vh);
  overflow: hidden;
  border-radius: 14px;
  corner-shape: superellipse(1.25);
  background: ${rg.panelBg};
  color: ${rg.text};
  filter: drop-shadow(${rg.shadow});
  font: 500 13px/16px ${rg.font};
  letter-spacing: normal;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  font-synthesis: none;
  z-index: 2147483645;
  opacity: 0;
  transform: scale(0.92);
  pointer-events: none;
  transition: opacity ${PANEL_EXIT_MS}ms ${rg.easeDrawer}, transform ${PANEL_EXIT_MS}ms ${rg.easeDrawer};
}
${P}[data-state="open"] {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  transition: opacity ${PANEL_ENTER_MS}ms ${rg.easeSpring}, transform ${PANEL_ENTER_MS}ms ${rg.easeSpring};
}
${P} [hidden] { display: none !important; }
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
  height: 28px;
  padding: 0 4px 0 8px;
}
${P} ${part("panel-title")} { display: flex; align-items: baseline; gap: 4px; min-width: 0; }
${P} ${part("panel-count")} { color: ${rg.textMuted}; font-variant-numeric: tabular-nums; }
${P} ${part("clear-all")},
${P} ${part("panel-back")} {
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  color: ${rg.textMuted};
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
${P} ${part("panel-back")} { gap: 2px; margin-left: -4px; padding: 0 6px 0 2px; color: ${rg.text}; }
${P} ${part("clear-all")}:hover,
${P} ${part("panel-back")}:hover { color: ${rg.text}; background: ${rg.surfaceHover}; }
${P} ${part("panel-position")} {
  padding-right: 4px;
  color: ${rg.textMuted};
  font-variant-numeric: tabular-nums;
}

${P} ${part("panel-list")} {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-top: 0.5px solid ${rg.borderSubtle};
  scrollbar-width: thin;
  scrollbar-color: ${rg.borderButton} transparent;
}
${P} ${part("panel-highlight")} {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  background: ${rg.surfaceHover};
  opacity: 0;
  pointer-events: none;
  transition: top ${HIGHLIGHT_MS}ms ease-out, height ${HIGHLIGHT_MS}ms ease-out, opacity ${HIGHLIGHT_MS}ms ease-out;
}
${P} ${part("panel-item")} {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 6px 6px 8px;
}
${P} ${part("panel-index")} {
  flex: none;
  min-width: 12px;
  color: ${rg.textMuted};
  line-height: 16px;
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
  cursor: pointer;
}
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
  min-height: 16px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: ${rg.text};
  font: 400 13px/16px ${rg.font};
  resize: none;
  outline: none;
  overflow: hidden;
  overflow-wrap: anywhere;
}
${P}[data-editing] ${part("panel-item")}:not([data-editing]) { display: none; }
${P} ${part("delete-item")} {
  position: relative;
  z-index: 1;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
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

const ensurePanelStyles = (): void => {
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  style.textContent = PANEL_CSS;
  document.head.appendChild(style);
};

const markPanelControl = (element: HTMLElement): void => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};

const createPart = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  name: string,
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  element.setAttribute(DECK_UI_ATTRIBUTE, name);
  return element;
};

const createButton = (name: string, label: string): HTMLButtonElement => {
  const button = createPart("button", name);
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  markPanelControl(button);
  return button;
};

const createCrossIcon = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "10");
  svg.setAttribute("height", "10");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M6 6l12 12M18 6L6 18");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("stroke-linecap", "round");
  svg.append(path);
  return svg;
};

const createChevronLeftIcon = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M15 18l-6-6 6-6");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
};

export const createDeckPanel = (): HTMLDivElement => {
  ensurePanelStyles();
  const panel = createPart("div", "panel");
  markPanelControl(panel);
  panel.style.display = "none";
  return panel;
};

type PanelHandlers = {
  onCopyAll: () => void;
  onClearAll: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, content: string) => void;
  onToggleMode: () => void;
};

const autosize = (field: HTMLTextAreaElement): void => {
  field.style.height = "auto";
  field.style.height = `${field.scrollHeight}px`;
};

const renderSummary = (target: HTMLElement, meta: HTMLElement, content: string): void => {
  const summary = summarizeDeckItem(content);
  target.setAttribute("data-kind", summary.kind);
  target.replaceChildren(
    ...summary.parts.map((piece) => {
      if (piece.kind === "same") return document.createTextNode(piece.text);
      const mark = document.createElement(piece.kind === "removed" ? "del" : "ins");
      mark.textContent = piece.text;
      return mark;
    }),
  );
  meta.textContent = [
    DECK_ITEM_KIND_LABEL[summary.kind],
    summary.element ? `<${summary.element}>` : null,
    summary.component,
  ]
    .filter(Boolean)
    .join(" · ");
};

const stopHostHandlers = (element: HTMLElement): void => {
  element.addEventListener("mousedown", (event) => event.stopPropagation());
  element.addEventListener("pointerdown", (event) => event.stopPropagation());
};

interface ItemRow {
  row: HTMLElement;
  setIndex: (index: number) => void;
  setContent: (content: string) => void;
  field: () => HTMLTextAreaElement | null;
  close: () => void;
}

interface EditHandlers {
  onEditStart: (row: HTMLElement) => void;
  onEditEnd: (row: HTMLElement) => void;
}

// Rows show a two-line summary so the list is the only thing that scrolls.
// Clicking a row opens an editor for the raw payload and hides the other rows
// until the editor closes.
const createItemRow = (
  item: DeckItem,
  handlers: PanelHandlers,
  editHandlers: EditHandlers,
): ItemRow => {
  let content = item.content;
  let field: HTMLTextAreaElement | null = null;

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

  // Removing a focused textarea fires blur, which calls back in here; clearing
  // the field first makes that call a no-op.
  const collapse = (): void => {
    const editor = field;
    if (!editor) return;
    field = null;
    const next = editor.value;
    editor.remove();
    summaryButton.hidden = false;
    summaryButton.setAttribute("aria-expanded", "false");
    row.removeAttribute("data-editing");
    editHandlers.onEditEnd(row);
    if (!next.trim()) {
      handlers.onRemoveItem(item.id);
      return;
    }
    content = next.trim();
    renderSummary(summaryText, meta, content);
    handlers.onUpdateItem(item.id, next);
  };

  const close = (): void => {
    const editor = field;
    collapse();
    if (editor && row.isConnected) summaryButton.focus({ preventScroll: true });
  };

  const expand = (): void => {
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
        close();
      }
    });
    summaryButton.hidden = true;
    summaryButton.setAttribute("aria-expanded", "true");
    row.setAttribute("data-editing", "");
    editHandlers.onEditStart(row);
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

  const setContent = (next: string): void => {
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
    field: () => field,
    close,
  };
};

// One background that slides between rows, as react-grab's own menus do,
// rather than a hover fill on each row.
const createHoverHighlight = (list: HTMLElement) => {
  const highlight = createPart("div", "panel-highlight");
  highlight.setAttribute("aria-hidden", "true");
  let target: HTMLElement | null = null;

  const place = (row: HTMLElement): void => {
    highlight.style.top = `${row.offsetTop}px`;
    highlight.style.height = `${row.offsetHeight}px`;
  };

  const show = (row: HTMLElement): void => {
    if (row.hasAttribute("data-editing")) {
      hide();
      return;
    }
    const wasHidden = target === null;
    target = row;
    if (wasHidden) {
      // Appear in place; only moves between rows slide.
      highlight.style.transitionProperty = "opacity";
      place(row);
      void highlight.offsetHeight;
      highlight.style.transitionProperty = "";
    } else {
      place(row);
    }
    highlight.style.opacity = "1";
  };

  const hide = (): void => {
    target = null;
    highlight.style.opacity = "0";
  };

  const refresh = (): void => {
    if (target?.isConnected) place(target);
    else if (target) hide();
  };

  const rowFrom = (node: EventTarget | null): HTMLElement | null =>
    node instanceof Element ? node.closest<HTMLElement>(part("panel-item")) : null;

  list.addEventListener("pointerover", (event) => {
    const row = rowFrom(event.target);
    if (row && row !== target) show(row);
  });
  list.addEventListener("pointerleave", hide);
  list.addEventListener("focusin", (event) => {
    const row = rowFrom(event.target);
    if (row) show(row);
  });
  list.addEventListener("focusout", (event) => {
    if (!rowFrom(event.relatedTarget)) hide();
  });

  return { element: highlight, hide, refresh };
};

export interface DeckPanelView {
  panel: HTMLDivElement;
  hasFocusedField: () => boolean;
  setBatchActive: (active: boolean) => void;
  sync: (items: readonly DeckItem[], handlers: PanelHandlers) => void;
}

export const createDeckPanelView = (): DeckPanelView => {
  const panel = createDeckPanel();

  const header = createPart("div", "panel-header");
  const title = createPart("div", "panel-title");
  const titleLabel = document.createElement("span");
  titleLabel.textContent = "Deck";
  const countLabel = createPart("span", "panel-count");
  title.append(titleLabel, countLabel);
  const clearButton = createButton("clear-all", "Clear all deck items");
  clearButton.textContent = "Clear";

  // While a row is open the header turns into the way back to the list.
  const backButton = createButton("panel-back", "Back to all items");
  backButton.title = "Back to all items (Esc)";
  const backLabel = document.createElement("span");
  backLabel.textContent = "All items";
  backButton.append(createChevronLeftIcon(), backLabel);
  backButton.hidden = true;
  const positionLabel = createPart("span", "panel-position");
  positionLabel.hidden = true;
  header.append(backButton, title, positionLabel, clearButton);

  const list = createPart("div", "panel-list");
  const highlight = createHoverHighlight(list);
  const rows = createPart("div", "panel-rows");
  list.append(highlight.element, rows);

  const footer = createPart("div", "panel-footer");
  // The toolbar affordance turns into copy-all as soon as an item is queued, so
  // it can no longer double as the mode toggle. The panel is reachable in exactly
  // that state, which makes the footer the one place batch mode stays switchable.
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

  let footerHandlers: PanelHandlers | null = null;
  const rowsById = new Map<string, ItemRow>();
  let editingRow: HTMLElement | null = null;

  const renderHeader = (): void => {
    const isEditing = editingRow !== null;
    backButton.hidden = !isEditing;
    title.hidden = isEditing;
    clearButton.hidden = isEditing;
    positionLabel.hidden = !isEditing;
    if (isEditing) {
      const index = Array.prototype.indexOf.call(rows.children, editingRow);
      positionLabel.textContent = `${index + 1} of ${rows.children.length}`;
    }
  };

  const editHandlers: EditHandlers = {
    onEditStart: (row) => {
      editingRow = row;
      panel.setAttribute("data-editing", "");
      highlight.hide();
      renderHeader();
    },
    onEditEnd: (row) => {
      if (editingRow !== row) return;
      editingRow = null;
      panel.removeAttribute("data-editing");
      renderHeader();
    },
  };

  // Keep focus in the editor until the click lands, so the press itself does
  // not close it through blur.
  backButton.addEventListener("mousedown", (event) => event.preventDefault());
  backButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const id = editingRow?.getAttribute(ITEM_ID_ATTR);
    if (id) rowsById.get(id)?.close();
  });
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

  const setBatchActive = (active: boolean): void => {
    modeButton.title = active
      ? "Batch mode on: grabs queue in the deck"
      : "Batch mode off: grabs copy to the clipboard only";
    modeButton.setAttribute("aria-label", active ? "Turn batch mode off" : "Turn batch mode on");
    modeButton.setAttribute("aria-pressed", String(active));
  };
  setBatchActive(true);

  const hasFocusedField = (): boolean =>
    rows.contains(document.activeElement) &&
    document.activeElement instanceof HTMLTextAreaElement &&
    document.activeElement.matches(`textarea${part("panel-preview")}`);

  const sync = (items: readonly DeckItem[], handlers: PanelHandlers): void => {
    if (items.length === 0) {
      rows.replaceChildren();
      rowsById.clear();
      editingRow = null;
      panel.removeAttribute("data-editing");
      renderHeader();
      highlight.hide();
      return;
    }

    footerHandlers = handlers;
    adoptReactGrabTheme(panel);
    const noun = items.length === 1 ? "item" : "items";
    countLabel.textContent = `${items.length} ${noun}`;
    copyButton.textContent = `Copy ${items.length} ${noun}`;
    copyButton.setAttribute("aria-label", `Copy all ${items.length} deck ${noun}`);
    copyButton.title = `Copy all ${items.length} deck ${noun}`;

    const nextIds = new Set(items.map((item) => item.id));
    for (const [id, entry] of rowsById) {
      if (nextIds.has(id) || entry.field() === document.activeElement) continue;
      entry.row.remove();
      rowsById.delete(id);
    }

    const orderedRows: HTMLElement[] = [];
    for (const [index, item] of items.entries()) {
      let entry = rowsById.get(item.id);
      if (!entry) {
        entry = createItemRow(item, handlers, editHandlers);
        rowsById.set(item.id, entry);
      } else {
        entry.setContent(item.content);
      }
      entry.setIndex(index);
      orderedRows.push(entry.row);
    }

    for (const [index, row] of orderedRows.entries()) {
      if (rows.children[index] !== row) rows.insertBefore(row, rows.children[index] ?? null);
    }
    while (rows.children.length > orderedRows.length) {
      rows.lastElementChild?.remove();
    }

    renderHeader();
    highlight.refresh();
    panel.style.display = "flex";
  };

  return { panel, hasFocusedField, setBatchActive, sync };
};
