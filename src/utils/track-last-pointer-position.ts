import type { Position } from "../types.js";

let lastPointerPosition: Position | null = null;
let trackerCount = 0;

const handlePointerDown = (event: PointerEvent): void => {
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
