export { createTextPlugin } from "./text-plugin.js";
export { registerDeckPlugin, registerTextPlugin } from "./register.js";
export { getActiveEditSession, startEditSession } from "./edit-session.js";
export { buildEditPayload } from "./build-edit-payload.js";
export { copyDeckToClipboard, createDeckPlugin } from "./deck-plugin.js";
export {
  addDeckItem,
  clearDeck,
  getDeckItems,
  removeDeckItems,
  subscribeDeck,
} from "./deck-store.js";
export { formatDeck } from "./format-deck.js";
export type { DeckCopyResult, DeckItem } from "./deck-store.js";
export type {
  EditResult,
  EditSessionHandle,
  EditSessionOptions,
  EditSource,
  Position,
} from "./types.js";
export type {
  ReactGrabActionContext,
  ReactGrabApi,
  ReactGrabPlugin,
} from "./react-grab-types.js";
