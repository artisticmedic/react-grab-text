import {
  DECK_COPIED_FLASH_DURATION_MS,
  DECK_UI_ATTRIBUTE,
  REACT_GRAB_IGNORE_ATTRIBUTE,
} from "./constants.js";

export interface DeckBadge {
  update: (count: number) => void;
  destroy: () => void;
}

const TOOLBAR_HOST_SELECTOR = "[data-react-grab]";
const TEXT_ACTION_SELECTOR = '[data-react-grab-toolbar-action="text"]';
const REATTACH_INTERVAL_MS = 500;

// The deck's whole UI is one bare number sitting next to the Text "T" button
// in react-grab's toolbar. Zero footprint while empty (display: none, so the
// bar keeps its size); appears when items accumulate. Clicking it copies the
// entire deck and flushes it.
export const createDeckBadge = (onCopyAll: () => Promise<boolean>): DeckBadge => {
  let count = 0;
  let isCopying = false;
  let copiedFlashTimer: number | undefined;

  const badge = document.createElement("button");
  badge.type = "button";
  badge.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  badge.setAttribute(DECK_UI_ATTRIBUTE, "badge");
  Object.assign(badge.style, {
    // Sized to the sibling action buttons so the bar never grows; hidden
    // entirely while the deck is empty so it adds no width either. The
    // vertical padding + negative margin pair widens the hit target to
    // ~24px without changing the 14px layout box.
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "content-box",
    height: "14px",
    flex: "none",
    padding: "5px 6px",
    margin: "-5px 0",
    border: "none",
    background: "transparent",
    // react-grab defines --rg-text-primary on its shadow :host for both
    // themes; it inherits into injected elements and tracks theme changes.
    color: "var(--rg-text-primary, #fafafa)",
    font: "inherit",
    fontVariantNumeric: "tabular-nums",
    cursor: "pointer",
    userSelect: "none",
  });


  const render = (): void => {
    const isFlashing = copiedFlashTimer !== undefined;
    if (!isFlashing) badge.textContent = count > 0 ? String(count) : "";
    // isCopying keeps the badge visible across the flush: the store empties
    // (count drops to 0) before the copy promise resolves, and hiding at that
    // moment would make the success flash invisible.
    badge.style.display = count > 0 || isCopying || isFlashing ? "inline-flex" : "none";
    badge.setAttribute(
      "aria-label",
      count > 0 ? `Copy all ${count} deck items` : "Deck empty",
    );
  };
  badge.addEventListener("click", () => {
    if (count === 0 || isCopying || copiedFlashTimer !== undefined) return;
    isCopying = true;
    void onCopyAll().then((didCopy) => {
      isCopying = false;
      if (didCopy) {
        badge.textContent = "✓";
        copiedFlashTimer = window.setTimeout(() => {
          copiedFlashTimer = undefined;
          render();
        }, DECK_COPIED_FLASH_DURATION_MS);
      }
      render();
    });
  });

  // The toolbar lives in react-grab's open shadow root and re-renders on state
  // changes, which can drop injected children — a low-cost interval re-inserts
  // the badge after the Text action button whenever it goes missing. It also
  // covers the toolbar mounting late (script-tag installs, toolbar toggles).
  const attach = (): void => {
    if (badge.isConnected) return;
    const root = document
      .querySelector(TOOLBAR_HOST_SELECTOR)
      ?.shadowRoot?.querySelector(TOOLBAR_HOST_SELECTOR);
    // Anchor after the Text action when present; a deck-only install (no
    // text plugin) still gets the badge, after the last action button.
    const actionButtons = root?.querySelectorAll("[data-react-grab-toolbar-action]");
    const anchor =
      root?.querySelector(TEXT_ACTION_SELECTOR) ??
      (actionButtons?.length ? actionButtons[actionButtons.length - 1] : null);
    if (!anchor) return;
    anchor.insertAdjacentElement("afterend", badge);
  };
  attach();
  const reattachTimer = window.setInterval(attach, REATTACH_INTERVAL_MS);

  return {
    update: (nextCount: number) => {
      count = nextCount;
      // A grab landing during the success flash must not sit masked behind
      // the checkmark (unreadable and unclickable for the flash window).
      if (nextCount > 0 && copiedFlashTimer !== undefined) {
        window.clearTimeout(copiedFlashTimer);
        copiedFlashTimer = undefined;
      }
      render();
    },
    destroy: () => {
      window.clearInterval(reattachTimer);
      if (copiedFlashTimer !== undefined) window.clearTimeout(copiedFlashTimer);
      badge.remove();
    },
  };
};
