import { OVERLAY_Z_INDEX } from "./constants.js";
import { formatMeasurement, measureDistances } from "./measure-geometry.js";
import { getToolbarEdge } from "./utils/get-toolbar-edge.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWPORT_INSET_PX = 8;
const LABEL_HEIGHT_PX = 22;

export interface MeasureOverlay {
  host: HTMLDivElement;
  render: (target: Element | null, anchor: Element | null) => void;
  destroy: () => void;
}

export const createMeasureOverlay = (control: HTMLElement): MeasureOverlay => {
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
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
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

  const shape = (tag: "rect" | "line", attributes: Record<string, string | number>): void => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    svg.append(element);
  };
  const box = (left: number, top: number, width: number, height: number, fill: string, stroke = "none"): void => {
    shape("rect", { x: left, y: top, width: Math.max(0, width), height: Math.max(0, height), fill, stroke });
  };
  const line = (x1: number, y1: number, x2: number, y2: number, color: string, dashed = false): void => {
    shape("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 1, ...(dashed ? { "stroke-dasharray": "3 3" } : {}) });
  };
  const badge = (x: number, y: number, value: string): void => {
    const width = value.length * 7 + 12;
    const left = Math.max(VIEWPORT_INSET_PX, Math.min(x - width / 2, innerWidth - width - VIEWPORT_INSET_PX));
    const top = Math.max(VIEWPORT_INSET_PX, Math.min(y - LABEL_HEIGHT_PX / 2, innerHeight - LABEL_HEIGHT_PX - VIEWPORT_INSET_PX));
    shape("rect", { x: left, y: top, width, height: LABEL_HEIGHT_PX, rx: 4, fill: "var(--measure-ink)" });
    const text = document.createElementNS(SVG_NS, "text");
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
      const padding = ["Top", "Right", "Bottom", "Left"].map(side => parseFloat(computed?.getPropertyValue(`padding-${side.toLowerCase()}`) ?? "0") || 0);
      const margin = ["top", "right", "bottom", "left"].map(side => parseFloat(computed?.getPropertyValue(`margin-${side}`) ?? "0") || 0);
      const border = ["top", "right", "bottom", "left"].map(side => parseFloat(computed?.getPropertyValue(`border-${side}-width`) ?? "0") || 0);
      const name = element ? `${element.localName}${element.id ? `#${element.id}` : ""}` : "";
      const toolbarBounds = control.closest("[data-react-grab-toolbar-panel]")?.getBoundingClientRect() ?? control.getBoundingClientRect();
      const edge = getToolbarEdge(control);
      const signature = JSON.stringify([bounds, anchorBounds, padding, margin, border, name, target === anchor, innerWidth, innerHeight, toolbarBounds, edge]);
      if (signature === lastSignature) return;
      lastSignature = signature;
      svg.replaceChildren();
      hint.textContent = anchor
        ? "Hover another element to measure · Click to change anchor · Esc to clear"
        : "Measure · Hover to inspect · Click to anchor · Esc to exit";
      const isVertical = edge === "left" || edge === "right";
      hint.style.maxWidth = `${Math.min(isVertical ? 260 : 600, window.innerWidth - VIEWPORT_INSET_PX * 2)}px`;
      const hintWidth = hint.offsetWidth;
      const hintHeight = hint.offsetHeight;
      const hintLeft = edge === "left" ? toolbarBounds.right + VIEWPORT_INSET_PX
        : edge === "right" ? toolbarBounds.left - hintWidth - VIEWPORT_INSET_PX
        : toolbarBounds.left + (toolbarBounds.width - hintWidth) / 2;
      const hintTop = edge === "top" ? toolbarBounds.bottom + VIEWPORT_INSET_PX
        : edge === "bottom" ? toolbarBounds.top - hintHeight - VIEWPORT_INSET_PX
        : toolbarBounds.top + (toolbarBounds.height - hintHeight) / 2;
      hint.style.left = `${Math.max(VIEWPORT_INSET_PX, Math.min(hintLeft, window.innerWidth - hintWidth - VIEWPORT_INSET_PX))}px`;
      hint.style.top = `${Math.max(VIEWPORT_INSET_PX, Math.min(hintTop, window.innerHeight - hintHeight - VIEWPORT_INSET_PX))}px`;
      details.hidden = !bounds;
      if (!bounds || !element) return;

      const { left, top, right, bottom, width, height } = bounds;
      const scaleX = element instanceof HTMLElement && element.offsetWidth ? width / element.offsetWidth : 1;
      const scaleY = element instanceof HTMLElement && element.offsetHeight ? height / element.offsetHeight : 1;
      const [paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0] = padding;
      const [marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0] = margin;
      const [borderTop = 0, borderRight = 0, borderBottom = 0, borderLeft = 0] = border;
      const marginFill = "#f59e0b30";
      box(left, top - Math.max(0, marginTop) * scaleY, width, Math.max(0, marginTop) * scaleY, marginFill);
      box(right, top, Math.max(0, marginRight) * scaleX, height, marginFill);
      box(left, bottom, width, Math.max(0, marginBottom) * scaleY, marginFill);
      box(left - Math.max(0, marginLeft) * scaleX, top, Math.max(0, marginLeft) * scaleX, height, marginFill);
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
            if (x === undefined || y === undefined) continue;
            line(x - (horizontal ? 0 : 3), y - (horizontal ? 3 : 0), x + (horizontal ? 0 : 3), y + (horizontal ? 3 : 0), "var(--measure-ink)");
          }
          badge((x1 + x2) / 2, (y1 + y2) / 2, `${formatMeasurement(value)} px`);
        }
      }
      details.textContent = `${target === anchor ? "Anchor · " : ""}${name}  ${formatMeasurement(width)} × ${formatMeasurement(height)} px\nPadding  ${padding.map(formatMeasurement).join("  ")}\nMargin    ${margin.map(formatMeasurement).join("  ")}\nTop · Right · Bottom · Left`;
      details.style.left = `${Math.max(VIEWPORT_INSET_PX, Math.min(left, window.innerWidth - details.offsetWidth - VIEWPORT_INSET_PX))}px`;
      const preferredTop = top - details.offsetHeight - VIEWPORT_INSET_PX;
      details.style.top = `${Math.max(VIEWPORT_INSET_PX, Math.min(preferredTop >= VIEWPORT_INSET_PX ? preferredTop : bottom + VIEWPORT_INSET_PX, window.innerHeight - details.offsetHeight - VIEWPORT_INSET_PX))}px`;
    },
    destroy: () => host.remove(),
  };
};
