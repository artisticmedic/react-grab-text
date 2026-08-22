import { DECK_PLUGIN_NAME } from "./constants.js";
import { createDeckPanel } from "./deck-panel.js";
import {
  addDeckItem,
  clearDeck,
  getDeckItems,
  removeDeckItem,
  subscribeDeck,
  type DeckCopyResult,
} from "./deck-store.js";
import { fencePayload, formatDeck } from "./format-deck.js";
import type { ReactGrabPlugin } from "./react-grab-types.js";
import { copyTextToClipboard } from "./utils/copy-text-to-clipboard.js";

export const copyDeckToClipboard = async (): Promise<DeckCopyResult> => {
  const items = getDeckItems();
  const output = formatDeck(items);
  const didCopy = items.length > 0 && (await copyTextToClipboard(output));
  // Copying is what flushes the queue; a failed copy keeps it intact.
  if (didCopy) clearDeck();
  const result: DeckCopyResult = { itemCount: items.length, output, didCopy };
  window.dispatchEvent(new CustomEvent("react-grab-deck:copy", { detail: result }));
  return result;
};

export const createDeckPlugin = (): ReactGrabPlugin => ({
  name: DECK_PLUGIN_NAME,
  hooks: {
    // Runs before react-grab prepends the typed comment, so the fence wraps
    // only the element payload and the comment stays readable above it.
    transformCopyContent: (content) => fencePayload(content),
    // Content arrives as `comment\n<fenced payload>` (comment optional) —
    // every successful grab lands in the deck alongside the clipboard write.
    onCopySuccess: (_elements, content) => {
      addDeckItem(content);
    },
  },
  setup: () => {
    const panel = createDeckPanel({
      onCopyAll: async () => (await copyDeckToClipboard()).didCopy,
      onClear: clearDeck,
      onRemove: removeDeckItem,
    });
    panel.update(getDeckItems());
    const unsubscribe = subscribeDeck(panel.update);
    return {
      cleanup: () => {
        // Items survive in the module store + sessionStorage; only UI unmounts.
        unsubscribe();
        panel.destroy();
        return undefined;
      },
    };
  },
});
