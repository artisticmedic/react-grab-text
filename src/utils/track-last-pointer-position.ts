import type { Position } from "../types.js";

let lastPointerPosition: Position | null = null;
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
  lastPointerPosition = { x: event.clientX, y: event.clientY };
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

export const getLastPointerPosition = (): Position | null => lastPointerPosition;
