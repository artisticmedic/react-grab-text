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

// The deck's whole UI is one number sitting next to the Text "T" button in
// react-grab's toolbar: an invisible fixed-size circle that shows the count
// while items accumulate. Clicking it copies the entire deck and flushes it.
export const createDeckBadge = (onCopyAll: () => Promise<boolean>): DeckBadge => {
  let count = 0;
  let copiedFlashTimer: number | undefined;

  const badge = document.createElement("button");
  badge.type = "button";
  badge.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  badge.setAttribute(DECK_UI_ATTRIBUTE, "badge");
  Object.assign(badge.style, {
    // Same footprint as a toolbar action button; invisible until it has a number.
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    flex: "none",
    padding: "0",
    border: "none",
    borderRadius: "999px",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    fontVariantNumeric: "tabular-nums",
    cursor: "default",
    userSelect: "none",
  });

  const render = (): void => {
    const isFlashing = copiedFlashTimer !== undefined;
    if (!isFlashing) badge.textContent = count > 0 ? String(count) : "";
    badge.style.cursor = count > 0 || isFlashing ? "pointer" : "default";
    badge.setAttribute(
      "aria-label",
      count > 0 ? `Copy all ${count} deck items` : "Deck empty",
    );
  };

  badge.addEventListener("mouseenter", () => {
    if (count > 0) badge.style.background = "rgba(255, 255, 255, 0.08)";
  });
  badge.addEventListener("mouseleave", () => {
    badge.style.background = "transparent";
  });
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
    textButton?.insertAdjacentElement("afterend", badge);
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
