import { OVERLAY_Z_INDEX } from "./constants.js";
import { formatMeasurement, measureDistances } from "./measure-geometry.js";
import { getToolbarEdge } from "./utils/get-toolbar-edge.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWPORT_INSET_PX = 8;
const LABEL_HEIGHT_PX = 22;
const NEGATIVE_MARGIN_PATTERN_ID = "negative-margin";

export interface MeasureOverlay {
  host: HTMLDivElement;
  render: (target: Element | null, anchor: Element | null) => void;
  destroy: () => void;
}

const svgNode = (tag: string, attributes: Record<string, string | number>): SVGElement => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

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
  // A negative margin is space taken rather than space reserved, so it is drawn
  // inside the border box. The hatch keeps a pull from reading as a gap.
  const hatch = svgNode("pattern", {
    id: NEGATIVE_MARGIN_PATTERN_ID, width: 6, height: 6,
    patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)",
  });
  hatch.append(
    svgNode("rect", { width: 6, height: 6, fill: "#f59e0b26" }),
    svgNode("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#f59e0b", "stroke-width": 2, "stroke-opacity": 0.5 }),
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

  const shape = (tag: "rect" | "line", attributes: Record<string, string | number>): void => {
    svg.append(svgNode(tag, attributes));
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
      const scaleX = element instanceof HTMLElement && bounds && element.offsetWidth ? bounds.width / element.offsetWidth : 1;
      const scaleY = element instanceof HTMLElement && bounds && element.offsetHeight ? bounds.height / element.offsetHeight : 1;
      svg.replaceChildren(defs);
      const hintText = anchor
        ? "Hover another element to measure · Click to change anchor · Esc to clear"
        : "Measure · Hover to inspect · Click to anchor · Esc to exit";
      const isVertical = edge === "left" || edge === "right";
      const hintMaxWidth = `${Math.min(isVertical ? 260 : 600, window.innerWidth - VIEWPORT_INSET_PX * 2)}px`;
      if (hintText !== hintBox.text || hintMaxWidth !== hintBox.maxWidth) {
        hint.textContent = hintText;
        hint.style.maxWidth = hintMaxWidth;
        hintBox = { text: hintText, maxWidth: hintMaxWidth, width: hint.offsetWidth, height: hint.offsetHeight };
      }
      const { width: hintWidth, height: hintHeight } = hintBox;
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
      const [paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0] = padding;
      const [marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0] = margin;
      const [borderTop = 0, borderRight = 0, borderBottom = 0, borderLeft = 0] = border;
      const marginFill = "#f59e0b30";
      const bandFill = (value: number): string =>
        value < 0 ? `url(#${NEGATIVE_MARGIN_PATTERN_ID})` : marginFill;
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
            if (x === undefined || y === undefined) continue;
            line(x - (horizontal ? 0 : 3), y - (horizontal ? 3 : 0), x + (horizontal ? 0 : 3), y + (horizontal ? 3 : 0), "var(--measure-ink)");
          }
          badge((x1 + x2) / 2, (y1 + y2) / 2, `${formatMeasurement(value)} px`);
        }
      }
      details.textContent = `${target === anchor ? "Anchor · " : ""}${name}  ${formatMeasurement(width)} × ${formatMeasurement(height)} px\nPadding  ${padding.map(formatMeasurement).join("  ")}\nMargin    ${margin.map(formatMeasurement).join("  ")}\nTop · Right · Bottom · Left`;
      const detailsWidth = details.offsetWidth;
      const detailsHeight = details.offsetHeight;
      const preferredTop = top - detailsHeight - VIEWPORT_INSET_PX;
      details.style.left = `${Math.max(VIEWPORT_INSET_PX, Math.min(left, window.innerWidth - detailsWidth - VIEWPORT_INSET_PX))}px`;
      details.style.top = `${Math.max(VIEWPORT_INSET_PX, Math.min(preferredTop >= VIEWPORT_INSET_PX ? preferredTop : bottom + VIEWPORT_INSET_PX, window.innerHeight - detailsHeight - VIEWPORT_INSET_PX))}px`;
    },
    destroy: () => host.remove(),
  };
};
