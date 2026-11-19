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
const PANEL_MODE_TOGGLE = '[data-react-grab-deck-ui="panel-mode-toggle"]';
const PANEL_SUMMARY = '[data-react-grab-deck-ui="panel-summary"]';
const PANEL_PREVIEW = '[data-react-grab-deck-ui="panel-preview"]';
const PANEL_COPY_ALL = '[data-react-grab-deck-ui="copy-all"]';
const PANEL_BACK = '[data-react-grab-deck-ui="panel-back"]';
const PANEL_ITEM = '[data-react-grab-deck-ui="panel-item"]';

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

const disableBatchMode = async (demo: DemoPageObject): Promise<void> => {
  const toggle = demo.page.locator(DECK_TOGGLE);
  if ((await toggle.getAttribute("aria-pressed")) === "false") return;
  await clickDeckAffordance(demo);
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
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
    // Colour parity is an at-rest claim: batch mode is on by default, which
    // paints the deck icon active on purpose.
    await disableBatchMode(demo);
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

    // Poll: the icon colour is transitioned, so leaving batch mode animates the
    // deck icon down to the idle token rather than snapping to it.
    await expect
      .poll(async () =>
        demo.page.evaluate((attributeName) => {
          const host = document.querySelector(`[${attributeName}]`);
          const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
          const deckIcon = root?.querySelector('[data-react-grab-deck-ui="mode-toggle"] svg');
          const textIcon = root?.querySelector('[data-react-grab-toolbar-action="text"] svg');
          if (!deckIcon || !textIcon) return null;
          return getComputedStyle(deckIcon).color === getComputedStyle(textIcon).color;
        }, REACT_GRAB_ATTRIBUTE),
      )
      .toBe(true);
  });

  test("single mode keeps copy grabs off the deck", async ({ demo }) => {
    await disableBatchMode(demo);
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
    await disableBatchMode(demo);
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
    // Rows are summaries until clicked, so no row is a scroll container of its
    // own; the editor only exists while one item is open.
    await expect(demo.page.locator(PANEL_PREVIEW)).toHaveCount(0);
    await demo.page.locator(PANEL_SUMMARY).first().click();
    const preview = demo.page.locator(PANEL_PREVIEW);
    await expect(preview).toBeFocused();
    await preview.fill("edited grab body");
    await preview.blur();
    await expect(preview).toHaveCount(0);
    await expect(demo.page.locator(PANEL_SUMMARY).first()).toContainText("edited grab body");

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

  test("batch mode stays switchable from the panel once the deck has items", async ({
    demo,
  }) => {
    // The toolbar affordance becomes copy-all at the first queued item, so the
    // panel is the only way back to single mode without emptying the deck.
    await copyGrab(demo, HEADLINE, 1);
    await clickPanelToggle(demo);

    const modeButton = demo.page.locator(PANEL_MODE_TOGGLE);
    await expect(modeButton).toHaveAttribute("aria-pressed", "true");
    await expect(modeButton).toHaveAccessibleName("Turn batch mode off");

    await modeButton.click();
    await expect(modeButton).toHaveAttribute("aria-pressed", "false");
    await expect(modeButton).toHaveAccessibleName("Turn batch mode on");
    await expect(demo.page.locator(DECK_TOGGLE)).toHaveAttribute("aria-pressed", "false");

    // Switching mode leaves the queue alone; it only stops new grabs joining it.
    await expectDeckCount(demo, "1");
    const copied = await demo.page.evaluate(async (sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      return (await window.__REACT_GRAB__?.copyElement(element)) ?? false;
    }, TAGLINE);
    expect(copied).toBe(true);
    await expectDeckCount(demo, "1");
  });

  test("a queued text edit reads as a word diff in the panel", async ({ demo }) => {
    await enableBatchMode(demo);
    await demo.startEditing(HEADLINE);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("Ship copy without a handoff");
    await demo.page.keyboard.press("Enter");
    await demo.waitForTextEdit();
    await expectDeckCount(demo, "1");

    await clickPanelToggle(demo);
    const summary = demo.page.locator(PANEL_SUMMARY).first();
    await expect(summary.locator("del")).toHaveText("better");
    await expect(summary.locator("ins")).toHaveCount(0);
    await expect(summary).toContainText("Text edit · <h1>");
  });

  test("copy all from the panel copies the deck, closes the panel and says so", async ({
    demo,
  }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);
    await clickPanelToggle(demo);

    const copyButton = demo.page.locator(PANEL_COPY_ALL);
    await expect(copyButton).toHaveText("Copy 2 items");
    await copyButton.click();

    // The label and the check both clear after a flash, so look for them
    // together rather than one after the other.
    await Promise.all([
      expect(demo.page.locator(PANEL)).toBeHidden(),
      expect(demo.page.getByRole("status").filter({ hasText: "Copied 2 items" })).toBeVisible(),
      expect(demo.page.locator(DECK_CHECK)).toHaveCSS("opacity", "1"),
    ]);
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toContain("\n--\n2.\n```\n");
  });

  test("an open item edits alone and the header leads back to the list", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);
    await clickPanelToggle(demo);
    await expect(demo.page.locator(PANEL_BACK)).toBeHidden();

    await demo.page.locator(PANEL_SUMMARY).nth(1).click();
    await expect(demo.page.locator(PANEL_PREVIEW)).toBeFocused();
    await expect(demo.page.locator(PANEL_ITEM).first()).toBeHidden();
    await expect(demo.page.locator('[data-react-grab-deck-ui="panel-position"]')).toHaveText("2 of 2");

    await demo.page.locator(PANEL_BACK).click();
    await expect(demo.page.locator(PANEL_PREVIEW)).toHaveCount(0);
    await expect(demo.page.locator(PANEL_ITEM)).toHaveCount(2);
    await expect(demo.page.locator(PANEL_ITEM).first()).toBeVisible();
    await expect(demo.page.locator(PANEL_SUMMARY).nth(1)).toBeFocused();

    // Escape takes the same way back.
    await demo.page.locator(PANEL_SUMMARY).first().click();
    await expect(demo.page.locator(PANEL_PREVIEW)).toBeFocused();
    await demo.page.keyboard.press("Escape");
    await expect(demo.page.locator(PANEL_PREVIEW)).toHaveCount(0);
    await expect(demo.page.locator(PANEL_SUMMARY).first()).toBeFocused();
    await expect(demo.page.locator(PANEL)).toBeVisible();
  });

  test("opening the deck panel closes the React Grab menu that was open", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await demo.activate();
    await demo.page.locator(TAGLINE).hover({ force: true });
    await demo.rightClickTarget(TAGLINE);

    await clickPanelToggle(demo);
    await expect(demo.page.locator(PANEL)).toBeVisible();
    await expect
      .poll(async () => (await demo.getContextMenuRow("Copy")).isPresent)
      .toBe(false);
  });

  test("the deck panel closes on an outside click", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await clickPanelToggle(demo);
    await expect(demo.page.locator(PANEL)).toBeVisible();

    await demo.page.locator(HEADLINE).click({ force: true });
    await expect(demo.page.locator(PANEL)).toBeHidden();
  });
});
