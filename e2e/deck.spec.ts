import { REACT_GRAB_ATTRIBUTE, expect, test, type DemoPageObject } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';

const DECK_TOGGLE = '[data-react-grab-deck-ui="mode-toggle"]';
const DECK_COUNT = `${DECK_TOGGLE} [data-react-grab-deck-face="count"]`;
const DECK_CHECK = `${DECK_TOGGLE} [data-react-grab-deck-face="check"]`;
const DECK_STACK = `${DECK_TOGGLE} [data-react-grab-deck-face="stack"]`;
const PANEL_TOGGLE = '[data-react-grab-deck-ui="panel-toggle"]';
const PANEL = '[data-react-grab-deck-ui="panel"]';
const DELETE_ITEM = '[data-react-grab-deck-ui="delete-item"]';

const clickDeckAffordance = async (demo: DemoPageObject): Promise<void> => {
  await demo.page.evaluate((attributeName) => {
    const host = document.querySelector(`[${attributeName}]`);
    const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
    root?.querySelector<HTMLButtonElement>('[data-react-grab-deck-ui="mode-toggle"]')?.click();
  }, REACT_GRAB_ATTRIBUTE);
};

const enableBatchMode = async (demo: DemoPageObject): Promise<void> => {
  const toggle = demo.page.locator(DECK_TOGGLE);
  if ((await toggle.getAttribute("aria-pressed")) === "true") return;
  await clickDeckAffordance(demo);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
};

const clickPanelToggle = async (demo: DemoPageObject): Promise<void> => {
  await demo.page.evaluate((attributeName) => {
    const host = document.querySelector(`[${attributeName}]`);
    const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
    root
      ?.querySelector<HTMLButtonElement>('[data-react-grab-deck-ui="panel-toggle"]')
      ?.click();
  }, REACT_GRAB_ATTRIBUTE);
};

const expectDeckCount = async (
  demo: DemoPageObject,
  expected: string,
): Promise<void> => {
  await expect(demo.page.locator(DECK_COUNT)).toHaveText(expected, { timeout: 10_000 });
};

const expectDeckStackVisible = async (demo: DemoPageObject): Promise<void> => {
  await expect(demo.page.locator(DECK_STACK)).toHaveCSS("opacity", "1");
  await expect(demo.page.locator(DECK_COUNT)).toHaveCSS("opacity", "0");
};

// Queue a copy grab into the deck (batch mode). Uses the API directly because
// the default select tool is comment-first — a click opens the prompt instead
// of copying immediately.
const copyGrab = async (
  demo: DemoPageObject,
  selector: string,
  expectedCount: number,
): Promise<void> => {
  await enableBatchMode(demo);
  const copied = await demo.page.evaluate(async (sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    return (await window.__REACT_GRAB__?.copyElement(element)) ?? false;
  }, selector);
  expect(copied).toBe(true);
  await expectDeckCount(demo, String(expectedCount));
};

test.describe("deck", () => {
  test("the deck controls sit next to the toolbar Text action", async ({ demo }) => {
    const controls = demo.page.locator('[data-react-grab-deck-ui="controls"]');
    await expect(controls).toBeAttached({ timeout: 10_000 });
    await expectDeckStackVisible(demo);
    await expect(demo.page.locator(DECK_TOGGLE)).toBeVisible();
    const placement = await demo.page.evaluate((attributeName) => {
      const host = document.querySelector(`[${attributeName}]`);
      const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
      const textButton = root?.querySelector('[data-react-grab-toolbar-action="text"]');
      const textWrapper = textButton?.parentElement ?? null;
      const deckControls = root?.querySelector('[data-react-grab-deck-ui="controls"]');
      return {
        isAfterTextWrapper:
          textWrapper?.nextElementSibling?.getAttribute("data-react-grab-deck-ui") === "controls",
        sharesToolbarRow: deckControls?.parentElement === textWrapper?.parentElement,
        notInsideTextWrapper: !textWrapper?.contains(deckControls ?? null),
      };
    }, REACT_GRAB_ATTRIBUTE);
    expect(placement.isAfterTextWrapper).toBe(true);
    expect(placement.sharesToolbarRow).toBe(true);
    expect(placement.notInsideTextWrapper).toBe(true);

    const colors = await demo.page.evaluate((attributeName) => {
      const host = document.querySelector(`[${attributeName}]`);
      const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
      const deckIcon = root?.querySelector('[data-react-grab-deck-ui="mode-toggle"] svg');
      const textIcon = root?.querySelector('[data-react-grab-toolbar-action="text"] svg');
      if (!deckIcon || !textIcon) return null;
      return {
        deck: getComputedStyle(deckIcon).color,
        text: getComputedStyle(textIcon).color,
      };
    }, REACT_GRAB_ATTRIBUTE);
    expect(colors).not.toBeNull();
    expect(colors!.deck).toBe(colors!.text);
  });

  test("single mode keeps copy grabs off the deck", async ({ demo }) => {
    await demo.activate();
    await demo.hoverUntilTargeted(HEADLINE);
    await demo.clickTarget(HEADLINE);
    await expectDeckStackVisible(demo);
  });

  test("batch mode queues copy grabs on the deck affordance", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);

    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toMatch(/\n```$/);

    await copyGrab(demo, TAGLINE, 2);
  });

  test("clicking the deck affordance copies the numbered, --separated deck and flushes it", async ({
    demo,
  }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);
    await demo.waitForActive(false);

    await clickDeckAffordance(demo);

    await expect(demo.page.locator(DECK_CHECK)).toHaveCSS("opacity", "1");
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toContain("\n--\n2.\n```\n");
    expect(clipboard).toMatch(/\[<p data-testid="tagline">/);
    expect(clipboard).toMatch(/\n```$/);

    await expectDeckStackVisible(demo);
    expect(
      await demo.page.evaluate(() => sessionStorage.getItem("react-grab-deck")),
    ).toBe("[]");
  });

  test("an empty deck shows the stack affordance, not a count", async ({ demo }) => {
    await expectDeckStackVisible(demo);
  });

  test("the deck survives a reload within the tab", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);

    await demo.goto();
    await expectDeckCount(demo, "1");
  });

  test("a text edit commit lands in the deck when batch mode is on", async ({ demo }) => {
    await enableBatchMode(demo);
    await demo.startEditing(HEADLINE);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("A different headline");
    await demo.page.keyboard.press("Enter");
    await demo.waitForTextEdit();

    await expectDeckCount(demo, "1");
  });

  test("a text edit commit stays off the deck in single mode", async ({ demo }) => {
    await demo.startEditing(HEADLINE);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("A different headline");
    await demo.page.keyboard.press("Enter");
    await demo.waitForTextEdit();

    await expectDeckStackVisible(demo);
  });

  test("deck panel items can be edited in place", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await clickPanelToggle(demo);
    const preview = demo.page.locator('[data-react-grab-deck-ui="panel-preview"]');
    await preview.fill("edited grab body");
    await preview.blur();

    await clickDeckAffordance(demo);
    await expect(demo.page.locator(DECK_CHECK)).toHaveCSS("opacity", "1");
    const clipboard = await demo.readClipboard();
    expect(clipboard).toContain("edited grab body");
  });

  test("the deck panel can delete one queued item", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);

    await clickPanelToggle(demo);
    await expect(demo.page.locator(PANEL)).toBeVisible();
    await expect(demo.page.locator(DELETE_ITEM)).toHaveCount(2);

    await demo.page.locator(DELETE_ITEM).first().click({ force: true });

    await expectDeckCount(demo, "1");
    await expect(demo.page.locator(DELETE_ITEM)).toHaveCount(1);
  });

  test("the deck panel closes on an outside click", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await clickPanelToggle(demo);
    await expect(demo.page.locator(PANEL)).toBeVisible();

    await demo.page.locator(HEADLINE).click({ force: true });
    await expect(demo.page.locator(PANEL)).toBeHidden();
  });
});
