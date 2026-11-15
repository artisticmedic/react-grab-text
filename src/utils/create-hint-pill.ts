import {
  HINT_PILL_VIEWPORT_MARGIN_PX,
  OVERLAY_Z_INDEX,
  REACT_GRAB_IGNORE_ATTRIBUTE,
  REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE,
  UI_ATTRIBUTE,
} from "../constants.js";
import { adoptReactGrabTheme, rg } from "./react-grab-theme.js";

export interface HintPill {
  showCopied: (label?: string) => void;
  showNoChange: () => void;
  showError: (message: string) => void;
  reposition: (targetRect: DOMRect) => void;
  destroy: () => void;
}

// Geometry of react-grab's own completion label, so a Text commit reads as the
// same "Copied" a native grab shows.
const ARROW_WIDTH_PX = 16;
const ARROW_HEIGHT_PX = 8;
const TARGET_GAP_PX = 12;
const PILL_HEIGHT_PX = 28;
const FADE_MS = 125;

const SVG_NS = "http://www.w3.org/2000/svg";

// The check-circle react-grab's completion label uses.
const REACT_GRAB_CHECK_CIRCLE_PATH =
  "M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L11 14.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L17.7071 10.7071Z";

const svgElement = (tag: string, attributes: Record<string, string>): SVGElement => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
};

const createStatusIcon = (kind: "check" | "minus" | "cross", color: string): SVGSVGElement => {
  const svg = svgElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    "aria-hidden": "true",
  }) as SVGSVGElement;
  svg.style.flexShrink = "0";
  svg.style.color = color;
  if (kind === "check") {
    svg.append(
      svgElement("path", {
        fill: "currentColor",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: REACT_GRAB_CHECK_CIRCLE_PATH,
      }),
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
      "stroke-linejoin": "round",
    }),
  );
  return svg;
};

const createArrow = (): SVGSVGElement => {
  const arrow = svgElement("svg", {
    width: String(ARROW_WIDTH_PX),
    height: String(ARROW_HEIGHT_PX),
    viewBox: `0 0 ${ARROW_WIDTH_PX} ${ARROW_HEIGHT_PX}`,
    "aria-hidden": "true",
  }) as SVGSVGElement;
  arrow.append(
    svgElement("path", {
      fill: rg.panelBg,
      d: "M0 8 L7.2929 0.7071 A1 1 0 0 1 8.7071 0.7071 L16 8 Z",
    }),
  );
  Object.assign(arrow.style, { position: "absolute", display: "block" });
  return arrow;
};

export const createHintPill = (): HintPill => {
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
    transition: `opacity ${FADE_MS}ms ease-out`,
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
    whiteSpace: "nowrap",
  });

  root.append(arrow, pill);
  document.body.appendChild(root);

  const setContent = (icon: SVGSVGElement, labelText: string): void => {
    const label = document.createElement("span");
    label.textContent = labelText;
    Object.assign(label.style, {
      color: rg.text,
      fontSize: "13px",
      lineHeight: "16px",
      fontWeight: "500",
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
    showError: (message: string) => {
      setContent(createStatusIcon("cross", rg.errorText), message);
    },
    reposition: (targetRect: DOMRect) => {
      const width = root.getBoundingClientRect().width;
      const margin = HINT_PILL_VIEWPORT_MARGIN_PX;
      const centerX = targetRect.left + targetRect.width / 2;

      let top = targetRect.bottom + TARGET_GAP_PX;
      const fitsBelow = top + PILL_HEIGHT_PX <= window.innerHeight - margin;
      if (!fitsBelow) top = targetRect.top - TARGET_GAP_PX - PILL_HEIGHT_PX;
      top = Math.max(top, margin);

      const maxLeft = window.innerWidth - width - margin;
      const left = Math.min(Math.max(centerX - width / 2, margin), maxLeft);

      // The arrow keeps pointing at the target when the pill is clamped, but
      // never slides into the rounded ends.
      const arrowInset = PILL_HEIGHT_PX / 2 + ARROW_WIDTH_PX / 2;
      const arrowCenter = Math.min(Math.max(centerX - left, arrowInset), width - arrowInset);
      Object.assign(arrow.style, {
        left: `${arrowCenter - ARROW_WIDTH_PX / 2}px`,
        top: fitsBelow ? `${1 - ARROW_HEIGHT_PX}px` : `${PILL_HEIGHT_PX - 1}px`,
        transform: fitsBelow ? "none" : "rotate(180deg)",
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
    },
  };
};
