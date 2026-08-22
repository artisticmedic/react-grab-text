import { expect, test, type DemoPageObject } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';

const PILL = '[data-react-grab-deck-ui="pill"]';
const PANEL = '[data-react-grab-deck-ui="panel"]';
const COPY_ALL = '[data-react-grab-deck-ui="copy-all"]';
const CLEAR = '[data-react-grab-deck-ui="clear"]';
const REMOVE = '[data-react-grab-deck-ui="remove"]';

// A plain react-grab copy grab: activate select mode, click the target, then
// wait for the deck to register the copy (the copy pipeline resolves source
// info asynchronously before the hooks fire).
const copyGrab = async (
  demo: DemoPageObject,
  selector: string,
  expectedCount: number,
): Promise<void> => {
  await demo.activate();
  await demo.hoverUntilTargeted(selector);
  await demo.clickTarget(selector);
  await expect(demo.page.locator(PILL)).toHaveText(`Deck ${expectedCount}`, { timeout: 10_000 });
};

const openPanel = async (demo: DemoPageObject): Promise<void> => {
  await demo.waitForActive(false);
  await demo.page.locator(PILL).click();
  await expect(demo.page.locator(PANEL)).toBeVisible();
};

test.describe("deck", () => {
  test("a copy grab is fenced on the clipboard and lands in the deck", async ({ demo }) => {
    await expect(demo.page.locator(PILL)).toBeHidden();

    await copyGrab(demo, HEADLINE, 1);

    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toMatch(/\n```$/);
  });

  test("Copy all joins items with numbering and -- separators, then clears the deck", async ({
    demo,
  }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);

    await openPanel(demo);
    await demo.page.locator(COPY_ALL).click();

    await expect(demo.page.locator(PILL)).toHaveText("✓ Copied");
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toContain("\n--\n2.\n```\n");
    expect(clipboard).toMatch(/\[<p data-testid="tagline">/);
    expect(clipboard).toMatch(/\n```$/);

    // Copying flushes the queue; after the flash the pill disappears.
    await expect(demo.page.locator(PILL)).toBeHidden({ timeout: 5_000 });
  });

  test("Clear empties the deck without touching the clipboard", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    const clipboardBefore = await demo.readClipboard();

    await openPanel(demo);
    await demo.page.locator(CLEAR).click();

    await expect(demo.page.locator(PILL)).toBeHidden();
    expect(await demo.readClipboard()).toBe(clipboardBefore);
  });

  test("removing a row renumbers the remaining items", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);

    await openPanel(demo);
    await demo.page.locator(REMOVE).first().click();
    await expect(demo.page.locator(PILL)).toHaveText("Deck 1");

    await demo.page.locator(COPY_ALL).click();
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<p data-testid="tagline">/);
    expect(clipboard).not.toContain("--");
    expect(clipboard).not.toContain("headline");
  });

  test("the deck survives a reload within the tab", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);

    await demo.goto();
    await expect(demo.page.locator(PILL)).toHaveText("Deck 1");
  });

  test("a text edit commit does not land in the deck", async ({ demo }) => {
    await demo.startEditing(HEADLINE);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("A different headline");
    await demo.page.keyboard.press("Enter");
    await demo.waitForTextEdit();

    // The Text tool copies through its own path, not react-grab's pipeline.
    await expect(demo.page.locator(PILL)).toBeHidden();
  });
});
