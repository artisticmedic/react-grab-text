import {
  HINT_PILL_OFFSET_PX,
  HINT_PILL_VIEWPORT_MARGIN_PX,
  OVERLAY_Z_INDEX,
  REACT_GRAB_IGNORE_ATTRIBUTE,
  REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE,
  UI_ATTRIBUTE,
} from "../constants.js";

export interface HintPill {
  showCopied: () => void;
  showNoChange: () => void;
  showError: (message: string) => void;
  reposition: (targetRect: DOMRect) => void;
  destroy: () => void;
}

const createStatusContent = (glyph: string, glyphColor: string, labelText: string): HTMLSpanElement => {
  const group = document.createElement("span");
  Object.assign(group.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
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

export const createHintPill = (): HintPill => {
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
    visibility: "hidden",
  });
  document.body.appendChild(pill);

  const setContent = (children: HTMLElement[]): void => {
    pill.replaceChildren(...children);
  };

  return {
    showCopied: () => {
      setContent([createStatusContent("✓", "#4ade80", "Copied")]);
    },
    showNoChange: () => {
      setContent([createStatusContent("–", "#a1a1aa", "No text change")]);
    },
    showError: (message: string) => {
      setContent([createStatusContent("✕", "#f87171", message)]);
    },
    reposition: (targetRect: DOMRect) => {
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
    },
  };
};
