import { DECK_ITEM_SEPARATOR } from "./constants.js";
import type { DeckItem } from "./deck-store.js";

// Each grab arrives as `comment\n<fenced payload>` (comment optional) from
// react-grab's copy pipeline, already fenced by the deck plugin's
// transformCopyContent. Numbering + `--` separators keep the requests from
// bleeding into each other when the whole deck lands in one agent prompt.
export const formatDeck = (items: readonly DeckItem[]): string =>
  items.map((item, index) => `${index + 1}.\n${item.content}`).join(DECK_ITEM_SEPARATOR);

export const fencePayload = (content: string): string => "```\n" + content + "\n```";
