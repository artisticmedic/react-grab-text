import { DECK_MODE_STORAGE_KEY } from "./constants.js";

export type DeckMode = "single" | "batch";

type DeckModeListener = (mode: DeckMode) => void;

let mode: DeckMode = "single";
const listeners = new Set<DeckModeListener>();
let didLoad = false;

const isDeckMode = (value: unknown): value is DeckMode => value === "single" || value === "batch";

const loadOnce = (): void => {
  if (didLoad) return;
  didLoad = true;
  try {
    const stored = window.sessionStorage.getItem(DECK_MODE_STORAGE_KEY);
    if (isDeckMode(stored)) mode = stored;
  } catch {
    // Storage-less context: stay on the default.
  }
};

const persist = (): void => {
  try {
    window.sessionStorage.setItem(DECK_MODE_STORAGE_KEY, mode);
  } catch {
    // Quota or storage-less context: in-memory mode still works.
  }
};

const notify = (): void => {
  persist();
  for (const listener of listeners) listener(mode);
};

export const getDeckMode = (): DeckMode => {
  loadOnce();
  return mode;
};

export const isBatchMode = (): boolean => getDeckMode() === "batch";

export const setDeckMode = (next: DeckMode): void => {
  loadOnce();
  if (mode === next) return;
  mode = next;
  notify();
};

export const toggleDeckMode = (): DeckMode => {
  setDeckMode(isBatchMode() ? "single" : "batch");
  return getDeckMode();
};

export const subscribeDeckMode = (listener: DeckModeListener): (() => void) => {
  loadOnce();
  listeners.add(listener);
  listener(mode);
  return () => {
    listeners.delete(listener);
  };
};
