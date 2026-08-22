import { DECK_PLUGIN_NAME } from "./constants.js";
import { createDeckBadge } from "./deck-badge.js";
import {
  addDeckItem,
  getDeckItems,
  removeDeckItems,
  subscribeDeck,
  type DeckCopyResult,
} from "./deck-store.js";
import { formatDeck } from "./format-deck.js";
import type { ReactGrabPlugin } from "./react-grab-types.js";
import { copyTextToClipboard } from "./utils/copy-text-to-clipboard.js";

// A payload containing its own backtick runs (grabbed <code>/<pre> text) must
// not terminate the fence early — size the fence past the longest run inside.
// Runs in the host's shared copy pipeline, so every single grab is fenced
// too: an explicit product decision, not deck-only plumbing.
const fencePayload = (content: string): string => {
  const longestRun = content.match(/`+/g)?.reduce((max, run) => Math.max(max, run.length), 0) ?? 0;
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return fence + "\n" + content + "\n" + fence;
};

export const copyDeckToClipboard = async (): Promise<DeckCopyResult> => {
  const items = getDeckItems();
  const output = formatDeck(items);
  const didCopy = items.length > 0 && (await copyTextToClipboard(output));
  // Copying is what flushes the queue; a failed copy keeps it intact. Only the
  // copied snapshot is flushed — a grab landing during the clipboard await
  // survives for the next copy.
  if (didCopy) removeDeckItems(items.map((item) => item.id));
  const result: DeckCopyResult = { itemCount: items.length, output, didCopy };
  window.dispatchEvent(new CustomEvent("react-grab-deck:copy", { detail: result }));
  return result;
};

export const createDeckPlugin = (): ReactGrabPlugin => ({
  name: DECK_PLUGIN_NAME,
  hooks: {
    // Runs before react-grab prepends the typed comment, so the fence wraps
    // only the element payload and the comment stays readable above it.
    transformCopyContent: fencePayload,
    // Content arrives as `comment\n<fenced payload>` (comment optional) —
    // every successful grab lands in the deck alongside the clipboard write.
    onCopySuccess: (_elements, content) => {
      addDeckItem(content);
    },
  },
  setup: () => {
    const badge = createDeckBadge(async () => (await copyDeckToClipboard()).didCopy);
    const unsubscribe = subscribeDeck((items) => badge.update(items.length));
    return {
      cleanup: () => {
        // Items survive in the module store + sessionStorage; only UI unmounts.
        unsubscribe();
        badge.destroy();
        return undefined;
      },
    };
  },
});
