import { useState, type CSSProperties } from "react";
import {
  CARD_TILE_PATH,
  MOTION,
  STACK_LAYER_PATHS,
  type LayerKey,
  type LayerPose,
} from "./shared.js";

type VariantId = "face" | "lip" | "tile";
type MotionId = "plate" | "peel";

const EXPANDED_POSES: Record<LayerKey, LayerPose> = {
  back: { opacity: 0.55, tx: 0.75, ty: -6, scale: 0.84, delayMs: 0 },
  mid: { opacity: 0.8, tx: 0.35, ty: -3, scale: 0.92, delayMs: 35 },
  front: { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 70 },
};

const HIDDEN_LAYER: LayerPose = { opacity: 0, tx: 0, ty: 3, scale: 0.94, delayMs: 0 };

const layerStyle = (pose: LayerPose, origin: string): CSSProperties => ({
  transition: MOTION,
  transitionDelay: `${pose.delayMs}ms`,
  transformOrigin: origin,
  opacity: pose.opacity,
  transform: `translate(${pose.tx}px, ${pose.ty}px) scale(${pose.scale})`,
});

const StackLayers = ({
  expanded,
  frontWhenCollapsed,
  midWhenCollapsed = HIDDEN_LAYER,
}: {
  expanded: boolean;
  frontWhenCollapsed: LayerPose;
  midWhenCollapsed?: LayerPose;
}) => (
  <>
    <g style={layerStyle(expanded ? EXPANDED_POSES.back : HIDDEN_LAYER, "12px 16px")}>
      <path d={STACK_LAYER_PATHS.back} />
    </g>
    <g style={layerStyle(expanded ? EXPANDED_POSES.mid : midWhenCollapsed, "12px 16px")}>
      <path d={STACK_LAYER_PATHS.mid} />
    </g>
    <g style={layerStyle(expanded ? EXPANDED_POSES.front : frontWhenCollapsed, "12px 16px")}>
      <path d={STACK_LAYER_PATHS.front} />
    </g>
  </>
);

const BatchSvg = ({
  variant,
  motion,
  expanded,
}: {
  variant: VariantId;
  motion: MotionId;
  expanded: boolean;
}) => {
  if (variant === "face") {
    // Off: the stack's front card — same shape batch mode grows into.
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <StackLayers
          expanded={expanded}
          frontWhenCollapsed={{ opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 0 }}
        />
      </svg>
    );
  }

  if (variant === "lip") {
    // Off: front card + a ghost mid slab peeking above — "one more sheet waiting".
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <StackLayers
          expanded={expanded}
          frontWhenCollapsed={{ opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 0 }}
          midWhenCollapsed={{ opacity: 0.28, tx: 0, ty: -2.5, scale: 0.98, delayMs: 0 }}
        />
      </svg>
    );
  }

  // Tile — square card plate in stack corner language; plate motion crossfades into stack.
  const tileCollapsed = { opacity: 1, tx: 0, ty: 0, scale: 1, delayMs: 0 };
  const tileExpanded =
    motion === "peel"
      ? { opacity: 0, tx: 0, ty: 1, scale: 0.98, delayMs: 90 }
      : { opacity: 0, tx: 0, ty: 2, scale: 0.96, delayMs: 0 };

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <StackLayers
        expanded={expanded}
        frontWhenCollapsed={HIDDEN_LAYER}
        midWhenCollapsed={HIDDEN_LAYER}
      />
      <path
        d={CARD_TILE_PATH}
        style={layerStyle(expanded ? tileExpanded : tileCollapsed, "12px 14px")}
      />
    </svg>
  );
};

export const BatchIconDemo = ({
  variant,
  motion,
}: {
  variant: VariantId;
  motion: MotionId;
}) => {
  const [active, setActive] = useState(false);
  const [preview, setPreview] = useState(false);
  const expanded = active || preview;

  return (
    <div className="proto-deck-batch-stage">
      <p className="proto-deck-batch-hint">
        Hover to preview batch on · click to toggle · {motion} motion
      </p>
      <div className="proto-deck-batch-toolbar" role="toolbar" aria-label="Mock React Grab toolbar">
        <button type="button" className="proto-deck-batch-tool" aria-label="Select">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.8977 4.02356L21.8277 4.39121C22.3784 2.99813 21.0382 1.60206 19.6238 2.09546L3.47334 7.72936C1.38661 8.45728 1.49021 11.443 3.6224 12.0245L10.1289 13.799L11.2331 19.8724C11.638 22.0991 14.7072 22.4019 15.5393 20.2972L21.8277 4.39121L20.8977 4.02356Z" />
          </svg>
        </button>
        <button type="button" className="proto-deck-batch-tool" aria-label="Style">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 13.867 20.345 14.992 18.77 14.992H16.029C14.739 14.992 13.823 16.248 14.218 17.476L14.48 18.295C14.751 19.139 14.643 20.041 14.211 20.751C13.769 21.479 12.985 22 12 22C6.477 22 2 17.523 2 12ZM12.21 6.783C12.416 7.585 11.933 8.403 11.131 8.609C10.328 8.815 9.511 8.332 9.305 7.529C9.099 6.727 9.582 5.909 10.384 5.703C11.187 5.497 12.004 5.981 12.21 6.783ZM7.59 9.207C8.388 9.43 8.853 10.258 8.63 11.055C8.407 11.853 7.579 12.319 6.782 12.096C5.984 11.873 5.518 11.045 5.741 10.247C5.964 9.449 6.792 8.983 7.59 9.207ZM9.497 14.446C8.918 13.854 7.968 13.844 7.376 14.423C6.784 15.002 6.773 15.952 7.353 16.544C7.932 17.136 8.882 17.147 9.474 16.567C10.066 15.988 10.076 15.039 9.497 14.446ZM16.624 9.575C16.032 10.155 15.082 10.144 14.503 9.552C13.923 8.96 13.934 8.01 14.526 7.431C15.118 6.852 16.068 6.862 16.647 7.454C17.226 8.046 17.216 8.996 16.624 9.575Z" />
          </svg>
        </button>
        <button type="button" className="proto-deck-batch-tool" aria-label="Text">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <polyline points="2.2 3.9 2.2 2.2 9.8 2.2 9.8 3.9" />
            <line x1="4.4" y1="9.8" x2="7.6" y2="9.8" />
            <line x1="6" y1="2.2" x2="6" y2="9.8" />
          </svg>
        </button>
        <button
          type="button"
          className={`proto-deck-batch-tool proto-deck-batch-tool--deck${active ? " is-active" : ""}`}
          aria-pressed={active}
          aria-label={active ? "Batch mode on" : "Batch mode off"}
          onPointerEnter={() => {
            if (!active) setPreview(true);
          }}
          onPointerLeave={() => setPreview(false)}
          onFocus={() => {
            if (!active) setPreview(true);
          }}
          onBlur={() => setPreview(false)}
          onClick={() => {
            setPreview(false);
            setActive((value) => !value);
          }}
        >
          <BatchSvg variant={variant} motion={motion} expanded={expanded} />
        </button>
        <button type="button" className="proto-deck-batch-tool" aria-label="Collapse toolbar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
      </div>
      <p className="proto-deck-batch-state">
        {active ? "On — stack locked" : preview ? "Hover — previewing stack" : "Off — single card"}
      </p>
    </div>
  );
};
