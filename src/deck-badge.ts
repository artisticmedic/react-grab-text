import {
  DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX,
  DECK_COPIED_FLASH_DURATION_MS,
  DECK_MAX_ITEMS,
  DECK_UI_ATTRIBUTE,
  REACT_GRAB_IGNORE_ATTRIBUTE,
  REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE,
} from "./constants.js";

export interface DeckBadge {
  update: (count: number) => void;
  destroy: () => void;
}

const TOOLBAR_HOST_SELECTOR = "[data-react-grab]";
const TEXT_ACTION_SELECTOR = '[data-react-grab-toolbar-action="text"]';
const REATTACH_INTERVAL_MS = 500;
const FAILED_ATTACH_WARN_AT = 20;

// "copying" spans the click-to-promise-resolution gap (the store empties
// before the copy resolves, and the badge must stay visible through it);
// "flash" is the 1600ms checkmark after a copy that left the deck empty.
type BadgeStatus = "idle" | "copying" | "flash";

// The deck's whole UI is one bare number sitting next to the Text "T" button
// in react-grab's toolbar. Zero footprint while empty; appears when items
// accumulate. Clicking it copies the entire deck and flushes it.
export const createDeckBadge = (onCopyAll: () => Promise<boolean>): DeckBadge => {
  let count = 0;
  let status: BadgeStatus = "idle";
  let flashTimer: number | undefined;
  let drag: { x: number; y: number; peak: number } | null = null;

  const badge = document.createElement("button");
  badge.type = "button";
  badge.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  // The toolbar panel already exempts its subtree from the host's global
  // pointer/key handlers; carrying the attribute directly matches the host's
  // own buttons and survives a build where the panel-level exemption moves.
  badge.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  badge.setAttribute(DECK_UI_ATTRIBUTE, "badge");
  // Announce content swaps (count, checkmark) to assistive technology.
  badge.setAttribute("aria-live", "polite");
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

  const isShown = (): boolean => count > 0 || status !== "idle";

  // A keyboard user's focus must not die on a control about to disappear.
  const handOffFocus = (): void => {
    const rootNode = badge.getRootNode();
    if (rootNode instanceof ShadowRoot && rootNode.activeElement === badge) {
      (badge.previousElementSibling as HTMLElement | null)?.focus?.();
    }
  };

  const render = (): void => {
    if (status !== "flash") badge.textContent = count > 0 ? String(count) : "";
    if (!isShown()) handOffFocus();
    badge.style.display = isShown() ? "inline-flex" : "none";
    const label =
      status === "flash"
        ? "Deck copied to clipboard"
        : count > 0
          ? `Copy all ${count} deck items`
          : "Deck empty";
    badge.setAttribute("aria-label", label);
    badge.title =
      count >= DECK_MAX_ITEMS ? `Deck full (${DECK_MAX_ITEMS}) — oldest grabs drop off` : label;
  };

  const setStatus = (next: BadgeStatus): void => {
    if (status === next) return;
    if (flashTimer !== undefined) {
      window.clearTimeout(flashTimer);
      flashTimer = undefined;
    }
    status = next;
    if (next === "flash") {
      badge.textContent = "✓";
      flashTimer = window.setTimeout(() => {
        flashTimer = undefined;
        status = "idle";
        render();
      }, DECK_COPIED_FLASH_DURATION_MS);
    }
    render();
  };

  // The toolbar can be dragged starting on the badge: its bubbling
  // pointerdown handler begins the drag, and the browser still fires click on
  // release. Suppress the copy when the gesture's PEAK travel crossed the
  // drag threshold — endpoint distance alone misses a drag that returns to
  // its origin, which still moved the toolbar. Movement is tracked on window
  // because the host may capture the pointer mid-drag.
  const trackDragTravel = (event: PointerEvent): void => {
    if (!drag) return;
    drag.peak = Math.max(drag.peak, Math.hypot(event.clientX - drag.x, event.clientY - drag.y));
  };
  const endDragTracking = (): void => {
    window.removeEventListener("pointermove", trackDragTravel);
    window.removeEventListener("pointerup", endDragTracking);
    window.removeEventListener("pointercancel", endDragTracking);
  };
  badge.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY, peak: 0 };
    window.addEventListener("pointermove", trackDragTravel);
    window.addEventListener("pointerup", endDragTracking);
    window.addEventListener("pointercancel", endDragTracking);
  });

  badge.addEventListener("click", () => {
    const wasDrag = drag !== null && drag.peak > DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX;
    drag = null;
    if (wasDrag || count === 0 || status !== "idle") return;
    setStatus("copying");
    void onCopyAll()
      .then((didCopy) => {
        // Flash only when the flush left the deck empty — a grab that landed
        // during the clipboard await must show as its count, not sit masked
        // and unclickable behind the checkmark.
        if (didCopy && count === 0) setStatus("flash");
      })
      .catch(() => {
        // A rejected copy (throwing external subscriber, clipboard failure
        // path) must not strand the badge in "copying" and dead-lock it.
      })
      .finally(() => {
        if (status === "copying") setStatus("idle");
      });
  });

  // The toolbar lives in react-grab's open shadow root and re-renders on
  // state changes, which can drop injected children — a low-cost interval
  // re-inserts the badge whenever it goes missing. It also covers the toolbar
  // mounting late (script-tag installs, toolbar toggles).
  let failedAttachAttempts = 0;
  const attach = (): void => {
    if (badge.isConnected) return;
    failedAttachAttempts += 1;
    if (failedAttachAttempts === FAILED_ATTACH_WARN_AT) {
      console.warn(
        "[react-grab-text] deck badge found no toolbar anchor after 10s — host toolbar markup may have changed",
      );
    }
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
    failedAttachAttempts = 0;
  };
  attach();
  const reattachTimer = window.setInterval(attach, REATTACH_INTERVAL_MS);

  return {
    update: (nextCount: number) => {
      count = nextCount;
      // A grab landing during the success flash must not sit masked behind
      // the checkmark (unreadable and unclickable for the flash window).
      if (nextCount > 0 && status === "flash") setStatus("idle");
      else render();
    },
    destroy: () => {
      window.clearInterval(reattachTimer);
      if (flashTimer !== undefined) window.clearTimeout(flashTimer);
      endDragTracking();
      badge.remove();
    },
  };
};
