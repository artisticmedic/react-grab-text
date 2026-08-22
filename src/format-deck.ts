import { DECK_ITEM_SEPARATOR } from "./constants.js";
import type { DeckItem } from "./deck-store.js";

// Each grab arrives as `comment\n<fenced payload>` (comment optional) from
// react-grab's copy pipeline, already fenced by the deck plugin's
// transformCopyContent. Numbering + `--` separators keep the requests from
// bleeding into each other when the whole deck lands in one agent prompt.
export const formatDeck = (items: readonly DeckItem[]): string =>
  items.map((item, index) => `${index + 1}.\n${item.content}`).join(DECK_ITEM_SEPARATOR);

// A payload containing its own backtick runs (grabbed <code>/<pre> text) must
// not terminate the fence early — size the fence past the longest run inside.
export const fencePayload = (content: string): string => {
  const longestRun = content.match(/`+/g)?.reduce((max, run) => Math.max(max, run.length), 0) ?? 0;
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return fence + "\n" + content + "\n" + fence;
};
