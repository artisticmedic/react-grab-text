import { DECK_MAX_ITEMS, DECK_STORAGE_KEY } from "./constants.js";

export interface DeckItem {
  id: string;
  content: string;
}

export interface DeckCopyResult {
  itemCount: number;
  output: string;
  didCopy: boolean;
}

declare global {
  interface WindowEventMap {
    "react-grab-deck:change": CustomEvent<{ items: DeckItem[] }>;
    "react-grab-deck:copy": CustomEvent<DeckCopyResult>;
  }
}

type DeckListener = (items: DeckItem[]) => void;

// Module-level so the queue survives plugin unregister/re-register (Fast
// Refresh re-runs setup; the deck must not lose items over it).
let items: DeckItem[] = [];
const listeners = new Set<DeckListener>();
let didLoad = false;

const isDeckItem = (value: unknown): value is DeckItem =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as DeckItem).id === "string" &&
  typeof (value as DeckItem).content === "string";

// sessionStorage, not localStorage: the queue should survive reloads and
// same-tab navigation during a review pass, but a fresh tab starts empty.
const loadOnce = (): void => {
  if (didLoad) return;
  didLoad = true;
  try {
    const raw = window.sessionStorage.getItem(DECK_STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) items = parsed.filter(isDeckItem).slice(-DECK_MAX_ITEMS);
  } catch {
    // Storage-less or corrupted state: start empty.
  }
};

const persist = (): void => {
  try {
    window.sessionStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota or storage-less context: the in-memory queue still works.
  }
};

const notify = (): void => {
  persist();
  const snapshot = getDeckItems();
  for (const listener of listeners) listener(snapshot);
  window.dispatchEvent(new CustomEvent("react-grab-deck:change", { detail: { items: snapshot } }));
};

const createItemId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const getDeckItems = (): DeckItem[] => {
  loadOnce();
  return [...items];
};

export const addDeckItem = (content: string): DeckItem | null => {
  loadOnce();
  const trimmed = content.trim();
  if (!trimmed) return null;
  const item: DeckItem = { id: createItemId(), content: trimmed };
  if (items.length >= DECK_MAX_ITEMS) {
    console.warn(
      `[react-grab-text] deck full (${DECK_MAX_ITEMS}) — dropping the oldest grab to queue this one`,
    );
  }
  items = [...items, item].slice(-DECK_MAX_ITEMS);
  notify();
  return item;
};

export const removeDeckItems = (ids: readonly string[]): void => {
  loadOnce();
  const removed = new Set(ids);
  const next = items.filter((item) => !removed.has(item.id));
  if (next.length === items.length) return;
  items = next;
  notify();
};

export const clearDeck = (): void => {
  loadOnce();
  if (items.length === 0) return;
  items = [];
  notify();
};

// Subscribe-then-emit-current: the listener fires immediately with the
// present snapshot, so subscribers need no separate priming read.
export const subscribeDeck = (listener: DeckListener): (() => void) => {
  loadOnce();
  listeners.add(listener);
  listener(getDeckItems());
  return () => {
    listeners.delete(listener);
  };
};
