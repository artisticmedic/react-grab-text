import { isBatchMode } from "./deck-mode.js";
import { addDeckItem, type DeckItem } from "./deck-store.js";

export const queueDeckItemIfBatch = (content: string): DeckItem | null => {
  if (!isBatchMode()) return null;
  return addDeckItem(content);
};
