import {
  DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX,
  DECK_COPIED_FLASH_DURATION_MS,
  DECK_MAX_ITEMS,
  DECK_UI_ATTRIBUTE,
} from "./constants.js";
import { createDeckAffordance } from "./deck-affordance.js";
import { createDeckPanelView } from "./deck-panel.js";
import { iconDeckList } from "./deck-icons.js";
import {
  applyIconColor,
  createToolbarIconButton,
  DECK_CONTROLS_CLASS,
  DECK_CONTROLS_GAP_PX,
} from "./deck-toolbar-button.js";
import { subscribeDeckMode, toggleDeckMode } from "./deck-mode.js";
import {
  clearDeck,
  getDeckItems,
  removeDeckItems,
  subscribeDeck,
  updateDeckItem,
  type DeckItem,
} from "./deck-store.js";

export interface DeckUi {
  update: (count: number) => void;
  destroy: () => void;
}

const TOOLBAR_HOST_SELECTOR = "[data-react-grab]";
const TEXT_ACTION_SELECTOR = '[data-react-grab-toolbar-action="text"]';
const REATTACH_INTERVAL_MS = 500;
const FAILED_ATTACH_WARN_AT = 20;

const getToolbarActionAnchor = (button: Element | null | undefined): Element | null => {
  if (!button) return null;
  return button.parentElement ?? button;
};

type DeckAffordanceStatus = "idle" | "copying" | "flash";

export const createDeckUi = (onCopyAll: () => Promise<boolean>): DeckUi => {
  let count = 0;
  let batchMode = false;
  let panelOpen = false;
  let status: DeckAffordanceStatus = "idle";
  let flashTimer: number | undefined;
  let drag: { x: number; y: number; peak: number } | null = null;

  const controls = document.createElement("div");
  controls.setAttribute(DECK_UI_ATTRIBUTE, "controls");
  controls.className = DECK_CONTROLS_CLASS;
  Object.assign(controls.style, { gap: `${DECK_CONTROLS_GAP_PX}px` });

  const deckAffordance = createDeckAffordance();
  const deckButton = deckAffordance.button;

  const panelMount = createToolbarIconButton(
    "panel-toggle",
    "Review deck items",
    iconDeckList(),
    false,
  );
  const panelToggle = panelMount.button;
  panelToggle.setAttribute("aria-expanded", "false");
  panelMount.wrapper.style.display = "none";

  const deckPanel = createDeckPanelView();
  const panel = deckPanel.panel;

  controls.append(deckAffordance.wrapper, panelMount.wrapper);

  const getAffordanceFace = (): "stack" | "count" | "check" => {
    if (status === "flash") return "check";
    if (count > 0) return "count";
    return "stack";
  };

  const positionPanel = (): void => {
    const anchor = panelToggle;
    const rect = anchor.getBoundingClientRect();
    const panelHeight = panel.offsetHeight || 240;
    const gap = 10;
    const spaceAbove = rect.top - gap;
    const openUp = spaceAbove >= Math.min(panelHeight, 200) || spaceAbove > window.innerHeight - rect.bottom;

    if (openUp) {
      panel.style.top = "auto";
      panel.style.bottom = `${window.innerHeight - rect.top + gap}px`;
    } else {
      panel.style.bottom = "auto";
      panel.style.top = `${rect.bottom + gap}px`;
    }

    const panelWidth = panel.offsetWidth || 420;
    let left = rect.right - panelWidth;
    left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12));
    panel.style.left = `${left}px`;
    panel.style.right = "auto";
    panel.style.maxHeight = openUp
      ? `${Math.max(160, Math.min(360, spaceAbove - 8))}px`
      : `${Math.max(160, Math.min(360, window.innerHeight - rect.bottom - gap - 12))}px`;
  };

  const syncPanelMount = (): void => {
    if (panelOpen && count > 0) {
      if (!panel.isConnected) document.body.append(panel);
      panel.style.display = "flex";
      positionPanel();
      panelToggle.setAttribute("aria-expanded", "true");
      return;
    }
    panel.style.display = "none";
    panelToggle.setAttribute("aria-expanded", "false");
    if (panel.isConnected) panel.remove();
  };

  const affordanceLabel = (): string => {
    if (status === "flash") return "Deck copied to clipboard";
    if (status === "copying") return `Copying ${count} deck items`;
    if (count > 0) {
      return count >= DECK_MAX_ITEMS
        ? `Copy all ${count} deck items — deck full (${DECK_MAX_ITEMS})`
        : `Copy all ${count} deck items`;
    }
    return batchMode
      ? "Batch mode on — grabs queue in the deck"
      : "Batch mode off — grabs copy to clipboard only";
  };

  const renderDeckAffordance = (): void => {
    deckAffordance.setBatchActive(batchMode);
    deckPanel.setBatchActive(batchMode);
    deckAffordance.setFace(getAffordanceFace(), count);
    const label = affordanceLabel();
    deckButton.title = label;
    deckButton.setAttribute("aria-label", label);
  };

  const renderPanelToggle = (): void => {
    const visible = count > 0;
    panelMount.wrapper.style.display = visible ? "" : "none";
    if (!visible) panelOpen = false;
    const icon = panelToggle.querySelector("svg");
    if (icon) applyIconColor(icon, panelOpen);
    panelToggle.title = panelOpen ? "Close deck panel" : "Review deck items";
    panelToggle.setAttribute("aria-label", panelOpen ? "Close deck panel" : "Review deck items");
  };

  const panelHandlers = {
    onCopyAll: () => {
      void onCopyAll();
    },
    onClearAll: () => {
      clearDeck();
    },
    onRemoveItem: (id: string) => {
      removeDeckItems([id]);
    },
    onUpdateItem: (id: string, content: string) => {
      updateDeckItem(id, content);
    },
    onToggleMode: () => {
      toggleDeckMode();
    },
  };

  const renderPanelItems = (items: readonly DeckItem[]): void => {
    if (items.length === 0) {
      deckPanel.sync([], panelHandlers);
      panelOpen = false;
      syncPanelMount();
      return;
    }

    deckPanel.sync(items, panelHandlers);
    syncPanelMount();
    if (panelOpen) positionPanel();
  };

  const render = (items: readonly DeckItem[] = getDeckItems()): void => {
    renderDeckAffordance();
    renderPanelToggle();
    renderPanelItems(items);
  };

  const closePanel = (): void => {
    if (!panelOpen) return;
    panelOpen = false;
    render();
  };

  const onPointerDownOutsidePanel = (event: PointerEvent): void => {
    if (!panelOpen) return;
    const path = event.composedPath();
    if (path.includes(panel) || path.includes(controls)) return;
    closePanel();
  };

  window.addEventListener("pointerdown", onPointerDownOutsidePanel, true);

  const setStatus = (next: DeckAffordanceStatus): void => {
    if (status === next) return;
    if (flashTimer !== undefined) {
      window.clearTimeout(flashTimer);
      flashTimer = undefined;
    }
    status = next;
    if (next === "flash") {
      renderDeckAffordance();
      flashTimer = window.setTimeout(() => {
        flashTimer = undefined;
        status = "idle";
        render();
      }, DECK_COPIED_FLASH_DURATION_MS);
      return;
    }
    render();
  };

  const trackDragTravel = (event: PointerEvent): void => {
    if (!drag) return;
    drag.peak = Math.max(drag.peak, Math.hypot(event.clientX - drag.x, event.clientY - drag.y));
  };
  const endDragTracking = (): void => {
    window.removeEventListener("pointermove", trackDragTravel);
    window.removeEventListener("pointerup", endDragTracking);
    window.removeEventListener("pointercancel", endDragTracking);
  };

  deckButton.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY, peak: 0 };
    window.addEventListener("pointermove", trackDragTravel);
    window.addEventListener("pointerup", endDragTracking);
    window.addEventListener("pointercancel", endDragTracking);
  });

  deckButton.addEventListener("click", () => {
    const wasDrag = drag !== null && drag.peak > DECK_BADGE_DRAG_SUPPRESS_THRESHOLD_PX;
    drag = null;
    if (wasDrag || status !== "idle") return;

    if (count > 0) {
      panelOpen = false;
      setStatus("copying");
      void onCopyAll()
        .then((didCopy) => {
          if (didCopy && getDeckItems().length === 0) setStatus("flash");
        })
        .catch(() => {
          // Clipboard failure or subscriber throw — unlock the affordance.
        })
        .finally(() => {
          if (status === "copying") setStatus("idle");
        });
      return;
    }

    toggleDeckMode();
  });

  panelToggle.addEventListener("click", () => {
    if (count === 0) return;
    panelOpen = !panelOpen;
    render();
  });

  const onViewportChange = (): void => {
    if (panelOpen) positionPanel();
  };
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("scroll", onViewportChange, true);

  let failedAttachAttempts = 0;
  const attach = (): void => {
    failedAttachAttempts += 1;
    if (failedAttachAttempts === FAILED_ATTACH_WARN_AT) {
      console.warn(
        "[react-grab-text] deck UI found no toolbar anchor after 10s — host toolbar markup may have changed",
      );
    }
    const root = document
      .querySelector(TOOLBAR_HOST_SELECTOR)
      ?.shadowRoot?.querySelector(TOOLBAR_HOST_SELECTOR);
    const actionButtons = root?.querySelectorAll("[data-react-grab-toolbar-action]");
    const textButton = root?.querySelector(TEXT_ACTION_SELECTOR);
    const fallbackButton = actionButtons?.length
      ? actionButtons[actionButtons.length - 1]
      : null;
    const anchor = getToolbarActionAnchor(textButton) ?? getToolbarActionAnchor(fallbackButton);
    if (!anchor?.parentElement) return;

    const existing = root?.querySelector(`[${DECK_UI_ATTRIBUTE}="controls"]`);
    if (existing && existing !== controls) existing.remove();

    const isCorrectlyPlaced =
      controls.isConnected &&
      controls.previousElementSibling === anchor &&
      controls.parentElement === anchor.parentElement;

    if (!isCorrectlyPlaced) {
      if (controls.isConnected) controls.remove();
      anchor.insertAdjacentElement("afterend", controls);
    }

    failedAttachAttempts = 0;
  };

  attach();
  const reattachTimer = window.setInterval(attach, REATTACH_INTERVAL_MS);

  const unsubscribeDeck = subscribeDeck((items) => {
    count = items.length;
    if (count === 0) panelOpen = false;
    if (count > 0 && status === "flash") setStatus("idle");
    else render(items);
  });

  const unsubscribeMode = subscribeDeckMode((mode) => {
    batchMode = mode === "batch";
    render();
  });

  return {
    update: (nextCount: number) => {
      count = nextCount;
      if (count === 0) panelOpen = false;
      if (count > 0 && status === "flash") setStatus("idle");
      else render();
    },
    destroy: () => {
      window.clearInterval(reattachTimer);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("pointerdown", onPointerDownOutsidePanel, true);
      if (flashTimer !== undefined) window.clearTimeout(flashTimer);
      endDragTracking();
      unsubscribeDeck();
      unsubscribeMode();
      panel.remove();
      controls.remove();
    },
  };
};
