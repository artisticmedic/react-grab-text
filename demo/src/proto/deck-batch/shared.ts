export const STACK_LAYER_PATHS = {
  back: "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657Z",
  mid: "M5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",
  front: "M2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6Z",
} as const;

// Single-card tile — same corner language as the stack, square footprint at full width.
export const CARD_TILE_PATH =
  "M6 4.5h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3Z";

export type LayerKey = keyof typeof STACK_LAYER_PATHS;

export type LayerPose = {
  opacity: number;
  tx: number;
  ty: number;
  scale: number;
  delayMs: number;
};

export const REDUCE_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MOTION = REDUCE_MOTION
  ? "none"
  : "opacity 200ms cubic-bezier(0.32, 0.72, 0, 1), transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)";
