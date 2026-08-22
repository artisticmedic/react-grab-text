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
    color: "inherit",
    font: "inherit",
    fontVariantNumeric: "tabular-nums",
    cursor: "pointer",
    userSelect: "none",
  });

  // The toolbar's own glyphs are colored by react-grab's shadow stylesheet,
  // which never applies to an injected element — inherited color computes to
  // black on the dark panel (invisible). Resolve the panel's actual background
  // and pick the readable foreground.
  const applyColor = (): void => {
    let ancestor = badge.parentElement;
    while (ancestor) {
      const background = getComputedStyle(ancestor).backgroundColor;
      const channels = background.match(/[\d.]+/g)?.map(Number);
      if (channels && channels.length >= 3 && (channels[3] ?? 1) > 0.1) {
        const [r = 0, g = 0, b = 0] = channels;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        badge.style.color = luminance < 128 ? "#fafafa" : "#171717";
        return;
      }
      ancestor = ancestor.parentElement;
    }
    badge.style.color = "#fafafa";
  };

  const render = (): void => {
    const isFlashing = copiedFlashTimer !== undefined;
    if (!isFlashing) badge.textContent = count > 0 ? String(count) : "";
    badge.style.display = count > 0 || isFlashing ? "inline-flex" : "none";
    badge.setAttribute(
      "aria-label",
      count > 0 ? `Copy all ${count} deck items` : "Deck empty",
    );
  };
  badge.addEventListener("click", () => {
    if (count === 0 || copiedFlashTimer !== undefined) return;
    void onCopyAll().then((didCopy) => {
      if (!didCopy) return;
      badge.textContent = "✓";
      copiedFlashTimer = window.setTimeout(() => {
        copiedFlashTimer = undefined;
        render();
      }, DECK_COPIED_FLASH_DURATION_MS);
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
    const textButton = root?.querySelector(TEXT_ACTION_SELECTOR);
    if (!textButton) return;
    textButton.insertAdjacentElement("afterend", badge);
    applyColor();
  };
  attach();
  const reattachTimer = window.setInterval(attach, REATTACH_INTERVAL_MS);

  return {
    update: (nextCount: number) => {
      count = nextCount;
      render();
    },
    destroy: () => {
      window.clearInterval(reattachTimer);
      if (copiedFlashTimer !== undefined) window.clearTimeout(copiedFlashTimer);
      badge.remove();
    },
  };
};
