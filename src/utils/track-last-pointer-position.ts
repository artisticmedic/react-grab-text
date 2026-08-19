import { POINTER_POSITION_MAX_AGE_MS } from "../constants.js";
import type { Position } from "../types.js";

interface TrackedPointerPosition extends Position {
  recordedAt: number;
}

let lastPointerPosition: TrackedPointerPosition | null = null;
let trackerCount = 0;

// The same convention react-grab's is-event-from-overlay uses: every piece of
// react-grab UI (and this plugin's own UI) carries a data-react-grab* attribute,
// including the shadow host, so a composedPath scan works across the boundary.
const isFromReactGrabUi = (event: Event): boolean =>
  event.composedPath().some(
    (entry) =>
      entry instanceof Element &&
      entry.getAttributeNames().some((name) => name.startsWith("data-react-grab")),
  );

const handlePointerDown = (event: PointerEvent): void => {
  if (isFromReactGrabUi(event)) return;
  lastPointerPosition = { x: event.clientX, y: event.clientY, recordedAt: Date.now() };
};

export const startPointerTracking = (): (() => void) => {
  trackerCount += 1;
  if (trackerCount === 1) {
    window.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: true,
    });
  }
  let didStop = false;
  return () => {
    if (didStop) return;
    didStop = true;
    trackerCount -= 1;
    if (trackerCount === 0) {
      window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      lastPointerPosition = null;
    }
  };
};

// A stale click point that happens to land inside a later edit target would
// place the caret somewhere the user never clicked (reachable via the bare-key
// shortcut path), so old positions expire instead of lingering.
export const getLastPointerPosition = (): Position | null => {
  if (!lastPointerPosition) return null;
  if (Date.now() - lastPointerPosition.recordedAt > POINTER_POSITION_MAX_AGE_MS) return null;
  return { x: lastPointerPosition.x, y: lastPointerPosition.y };
};
