const SVG_NS = "http://www.w3.org/2000/svg";

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Heroicons `rectangle-stack` — split into paint-order layers (back → front).
const STACK_LAYER_PATHS = {
  back: "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657Z",
  mid: "M5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",
  front: "M2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6Z",
} as const;

type LayerPose = {
  opacity: number;
  tx: number;
  ty: number;
  scale: number;
  delayMs: number;
};

const HIDDEN_LAYER: LayerPose = { opacity: 0, tx: 0, ty: 3, scale: 0.94, delayMs: 0 };

const LAYER_POSES: Record<keyof typeof STACK_LAYER_PATHS, { collapsed: LayerPose; expanded: LayerPose }> =
  {
    back: {
      collapsed: HIDDEN_LAYER,
      expanded: { opacity: 0.55, tx: 0.75, ty: -6, scale: 0.84, delayMs: 0 },
    },
    mid: {
      collapsed: HIDDEN_LAYER,
      expanded: { opacity: 0.8, tx: 0.35, ty: -3, scale: 0.92, delayMs: 35 },
    },
    front: {
      collapsed: { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 0 },
      expanded: { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 70 },
    },
  };

const applyPose = (
  element: SVGGraphicsElement,
  pose: LayerPose,
  origin: string,
): void => {
  const delay = REDUCE_MOTION ? "" : ` ${pose.delayMs}ms`;
  element.style.transition = REDUCE_MOTION
    ? "none"
    : `opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)${delay}, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)${delay}`;
  element.style.transformOrigin = origin;
  element.style.opacity = String(pose.opacity);
  element.style.transform = `translate(${pose.tx}px, ${pose.ty}px) scale(${pose.scale})`;
};

export interface DeckBatchIcon {
  svg: SVGSVGElement;
  setActive: (active: boolean) => void;
  setPreview: (preview: boolean) => void;
}

export const createDeckBatchIcon = (): DeckBatchIcon => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  svg.style.pointerEvents = "none";
  svg.style.overflow = "visible";

  const layerNodes = (Object.keys(STACK_LAYER_PATHS) as Array<keyof typeof STACK_LAYER_PATHS>).map(
    (key) => {
      const group = document.createElementNS(SVG_NS, "g");
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", STACK_LAYER_PATHS[key]);
      group.append(path);
      svg.append(group);
      return { key, group };
    },
  );

  let active = false;
  let preview = false;

  const render = (): void => {
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
    },
  };
};
