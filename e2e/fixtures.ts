import { test as base, expect, type Locator, type Page } from "@playwright/test";
import type { EditResult } from "../src/types.js";

declare global {
  interface Window {
    __lastTextEdit?: EditResult | null;
    __textEditCount?: number;
  }
}

// react-grab renders its toolbar and context menu into an open shadow root
// under a host element carrying this attribute (library builds; the demo build
// of react-grab uses a different one, which is not what npm ships).
export const REACT_GRAB_ATTRIBUTE = "data-react-grab";
export const TOOLBAR_STORAGE_KEY = "react-grab-toolbar-state";
export const TEXT_ACTION_ID = "text";
export const TEXT_ACTION_LABEL = "Text";
export const EDITING_ATTRIBUTE = "data-react-grab-text-editing";
export const HINT_PILL_SELECTOR = "div[data-react-grab-text-ui]";

const UI_STATE_TIMEOUT_MS = 10_000;
const TARGET_HOVER_ATTEMPTS = 4;
const TARGET_HOVER_TIMEOUT_MS = 3_000;
// The commit path awaits react-grab's async source resolution (capped at
// 1.5s inside the plugin) before it copies and dispatches.
const COMMIT_TIMEOUT_MS = 7_000;

interface InteractionPosition {
  x: number;
  y: number;
}

interface ContextMenuRow {
  isPresent: boolean;
  isEnabled: boolean;
}

// A click has to land on the element's own text, otherwise react-grab targets
// whichever nested element sits under the geometric center (the intro
// paragraph wraps a <b>). Falls back to the center for elements with no direct
// text, which is what the empty decorative div needs.
const getInteractionPosition = async (
  element: Locator,
): Promise<InteractionPosition | undefined> =>
  element.evaluate((target) => {
    const targetBounds = target.getBoundingClientRect();
    for (const child of Array.from(target.childNodes)) {
      if (child.nodeType !== Node.TEXT_NODE) continue;
      if (!child.textContent?.trim()) continue;
      const textRange = document.createRange();
      textRange.selectNodeContents(child);
      for (const textBounds of Array.from(textRange.getClientRects())) {
        const left = Math.max(textBounds.left, targetBounds.left);
        const top = Math.max(textBounds.top, targetBounds.top);
        const right = Math.min(textBounds.right, targetBounds.right);
        const bottom = Math.min(textBounds.bottom, targetBounds.bottom);
        if (right > left && bottom > top) {
          return {
            x: (left + right) / 2 - targetBounds.left,
            y: (top + bottom) / 2 - targetBounds.top,
          };
        }
      }
    }
    return undefined;
  });

export interface DemoPageObject {
  page: Page;
  goto: () => Promise<void>;
  waitForPluginRegistered: () => Promise<void>;
  waitForActive: (expected: boolean) => Promise<void>;
  activateTextAction: () => Promise<void>;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
  hoverUntilTargeted: (selector: string) => Promise<void>;
  clickTarget: (selector: string) => Promise<void>;
  rightClickTarget: (selector: string) => Promise<void>;
  startEditing: (selector: string) => Promise<Locator>;
  getContextMenuRow: (label: string) => Promise<ContextMenuRow>;
  closeContextMenu: () => Promise<void>;
  selectAllInEditor: () => Promise<void>;
  readClipboard: () => Promise<string>;
  writeClipboard: (text: string) => Promise<void>;
  getLastTextEdit: () => Promise<EditResult | null>;
  getTextEditCount: () => Promise<number>;
  waitForTextEdit: () => Promise<EditResult>;
  waitForSessionEnded: (selector: string) => Promise<void>;
}

const createDemoPageObject = (page: Page): DemoPageObject => {
  const waitForActive = async (expected: boolean): Promise<void> => {
    await page.waitForFunction(
      (expectedState) => window.__REACT_GRAB__?.isActive() === expectedState,
      expected,
      { timeout: UI_STATE_TIMEOUT_MS },
    );
  };

  const waitForPluginRegistered = async (): Promise<void> => {
    await page.waitForFunction(
      (pluginName) => window.__REACT_GRAB__?.getPlugins().includes(pluginName) ?? false,
      TEXT_ACTION_ID,
      { timeout: UI_STATE_TIMEOUT_MS },
    );
  };

  const goto = async (): Promise<void> => {
    await page.goto("/");
    await expect(page.getByTestId("headline")).toBeVisible();
    await waitForPluginRegistered();
  };

  const activateTextAction = async (): Promise<void> => {
    await page.waitForFunction(
      ({ attributeName, actionId }) => {
        const host = document.querySelector(`[${attributeName}]`);
        const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
        return Boolean(root?.querySelector(`[data-react-grab-toolbar-action="${actionId}"]`));
      },
      { attributeName: REACT_GRAB_ATTRIBUTE, actionId: TEXT_ACTION_ID },
      { timeout: UI_STATE_TIMEOUT_MS },
    );
    await page.evaluate(
      ({ attributeName, actionId }) => {
        const host = document.querySelector(`[${attributeName}]`);
        const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
        const actionButton = root?.querySelector<HTMLButtonElement>(
          `[data-react-grab-toolbar-action="${actionId}"]`,
        );
        actionButton?.click();
      },
      { attributeName: REACT_GRAB_ATTRIBUTE, actionId: TEXT_ACTION_ID },
    );
    await waitForActive(true);
  };

  const activate = async (): Promise<void> => {
    await page.evaluate(() => {
      const api = window.__REACT_GRAB__;
      if (!api?.isActive()) api?.activate();
    });
    await waitForActive(true);
  };

  const deactivate = async (): Promise<void> => {
    await page.keyboard.press("Escape");
    await waitForActive(false);
  };

  const waitForTargeted = async (selector: string, timeout: number): Promise<void> => {
    await page.waitForFunction(
      (targetSelector) =>
        window.__REACT_GRAB__?.getState().targetElement === document.querySelector(targetSelector),
      selector,
      { timeout },
    );
  };

  // A single synthetic hover can race scroll-into-view, so re-hover (moving the
  // pointer away first, so the move re-fires) until react-grab targets it.
  const hoverUntilTargeted = async (selector: string): Promise<void> => {
    const element = page.locator(selector).first();
    for (let attempt = 1; attempt <= TARGET_HOVER_ATTEMPTS; attempt += 1) {
      if (attempt > 1) await page.mouse.move(0, 0);
      const position = await getInteractionPosition(element);
      await element.hover({ force: true, position });
      try {
        await waitForTargeted(selector, TARGET_HOVER_TIMEOUT_MS);
        return;
      } catch (error) {
        if (attempt === TARGET_HOVER_ATTEMPTS) throw error;
      }
    }
  };

  const clickTarget = async (selector: string): Promise<void> => {
    const element = page.locator(selector).first();
    const position = await getInteractionPosition(element);
    await element.click({ force: true, position });
  };

  const rightClickTarget = async (selector: string): Promise<void> => {
    const element = page.locator(selector).first();
    const position = await getInteractionPosition(element);
    await element.click({ button: "right", force: true, position });
    await page.waitForFunction(
      (attributeName) => {
        const host = document.querySelector(`[${attributeName}]`);
        const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
        return Boolean(
          root?.querySelector("[data-react-grab-context-menu] [data-react-grab-menu-item]"),
        );
      },
      REACT_GRAB_ATTRIBUTE,
      { timeout: UI_STATE_TIMEOUT_MS },
    );
  };

  const getContextMenuRow = async (label: string): Promise<ContextMenuRow> =>
    page.evaluate(
      ({ attributeName, itemLabel }) => {
        const host = document.querySelector(`[${attributeName}]`);
        const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
        const button = root?.querySelector<HTMLButtonElement>(
          `[data-react-grab-context-menu] [data-react-grab-menu-item="${itemLabel.toLowerCase()}"]`,
        );
        if (!button) return { isPresent: false, isEnabled: false };
        return { isPresent: true, isEnabled: !button.disabled };
      },
      { attributeName: REACT_GRAB_ATTRIBUTE, itemLabel: label },
    );

  const closeContextMenu = async (): Promise<void> => {
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      (attributeName) => {
        const host = document.querySelector(`[${attributeName}]`);
        const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
        return !root?.querySelector("[data-react-grab-context-menu] [data-react-grab-menu-item]");
      },
      REACT_GRAB_ATTRIBUTE,
      { timeout: UI_STATE_TIMEOUT_MS },
    );
  };

  const startEditing = async (selector: string): Promise<Locator> => {
    await activateTextAction();
    await hoverUntilTargeted(selector);
    await clickTarget(selector);
    const element = page.locator(selector).first();
    await expect(element).toHaveAttribute(EDITING_ATTRIBUTE, "true");
    return element;
  };

  // The caret lands where the click did, so every replacement starts by
  // selecting the whole editing host.
  const selectAllInEditor = async (): Promise<void> => {
    await page.keyboard.press("ControlOrMeta+a");
    await page.waitForFunction(
      (attributeName) => {
        const element = document.querySelector(`[${attributeName}]`);
        const selection = window.getSelection();
        if (!element || !selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        return !range.collapsed && element.contains(range.commonAncestorContainer);
      },
      EDITING_ATTRIBUTE,
      { timeout: UI_STATE_TIMEOUT_MS },
    );
  };

  const readClipboard = async (): Promise<string> =>
    page.evaluate(() => navigator.clipboard.readText());

  const writeClipboard = async (text: string): Promise<void> => {
    await page.evaluate((value) => navigator.clipboard.writeText(value), text);
  };

  const getLastTextEdit = async (): Promise<EditResult | null> =>
    page.evaluate(() => window.__lastTextEdit ?? null);

  const getTextEditCount = async (): Promise<number> =>
    page.evaluate(() => window.__textEditCount ?? 0);

  const waitForTextEdit = async (): Promise<EditResult> => {
    await page.waitForFunction(() => Boolean(window.__lastTextEdit), undefined, {
      timeout: COMMIT_TIMEOUT_MS,
    });
    const result = await getLastTextEdit();
    if (!result) throw new Error("No react-grab-text:edit detail was captured");
    return result;
  };

  const waitForSessionEnded = async (selector: string): Promise<void> => {
    const element = page.locator(selector).first();
    await expect(element).not.toHaveAttribute(EDITING_ATTRIBUTE, "true");
    await expect(element).not.toHaveAttribute("contenteditable", /.*/);
  };

  return {
    page,
    goto,
    waitForPluginRegistered,
    waitForActive,
    activateTextAction,
    activate,
    deactivate,
    hoverUntilTargeted,
    clickTarget,
    rightClickTarget,
    startEditing,
    getContextMenuRow,
    closeContextMenu,
    selectAllInEditor,
    readClipboard,
    writeClipboard,
    getLastTextEdit,
    getTextEditCount,
    waitForTextEdit,
    waitForSessionEnded,
  };
};

export const test = base.extend<{ demo: DemoPageObject }>({
  demo: async ({ page }, use) => {
    await page.addInitScript(
      ({ storageKey, actionId }) => {
        try {
          // Seeded before the app loads so react-grab boots with the Text
          // action already armed as the toolbar default.
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              edge: "bottom",
              ratio: 0.5,
              collapsed: false,
              enabled: true,
              defaultAction: actionId,
            }),
          );
        } catch {
          // A storage-less context still runs; the toolbar just defaults to copy.
        }
        window.__lastTextEdit = null;
        window.__textEditCount = 0;
        window.addEventListener("react-grab-text:edit", (event) => {
          window.__lastTextEdit = event.detail;
          window.__textEditCount = (window.__textEditCount ?? 0) + 1;
        });
      },
      { storageKey: TOOLBAR_STORAGE_KEY, actionId: TEXT_ACTION_ID },
    );
    const demo = createDemoPageObject(page);
    await demo.goto();
    await use(demo);
  },
});

export { expect };
