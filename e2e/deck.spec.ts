import { expect, test, type DemoPageObject } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';

const BADGE = '[data-react-grab-deck-ui="badge"]';

// A plain react-grab copy grab: activate select mode, click the target, then
// wait for the deck badge to register the copy (the copy pipeline resolves
// source info asynchronously before the hooks fire).
const copyGrab = async (
  demo: DemoPageObject,
  selector: string,
  expectedCount: number,
): Promise<void> => {
  await demo.activate();
  await demo.hoverUntilTargeted(selector);
  await demo.clickTarget(selector);
  await expect(demo.page.locator(BADGE)).toHaveText(String(expectedCount), { timeout: 10_000 });
};

test.describe("deck", () => {
  test("the badge sits next to the toolbar Text action and starts empty", async ({ demo }) => {
    const badge = demo.page.locator(BADGE);
    await expect(badge).toHaveText("");
    const isAfterTextButton = await demo.page.evaluate(() => {
      const host = document.querySelector("[data-react-grab]");
      const root = host?.shadowRoot?.querySelector("[data-react-grab]");
      const textButton = root?.querySelector('[data-react-grab-toolbar-action="text"]');
      return textButton?.nextElementSibling?.getAttribute("data-react-grab-deck-ui") === "badge";
    });
    expect(isAfterTextButton).toBe(true);
  });

  test("a copy grab is fenced on the clipboard and counts up the badge", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);

    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toMatch(/\n```$/);

    await copyGrab(demo, TAGLINE, 2);
  });

  test("clicking the badge copies the numbered, --separated deck and flushes it", async ({
    demo,
  }) => {
    await copyGrab(demo, HEADLINE, 1);
    await copyGrab(demo, TAGLINE, 2);
    await demo.waitForActive(false);

    await demo.page.locator(BADGE).click();

    await expect(demo.page.locator(BADGE)).toHaveText("✓");
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toContain("\n--\n2.\n```\n");
    expect(clipboard).toMatch(/\[<p data-testid="tagline">/);
    expect(clipboard).toMatch(/\n```$/);

    // Copying flushes the queue; after the flash the badge goes blank.
    await expect(demo.page.locator(BADGE)).toHaveText("", { timeout: 5_000 });
    expect(
      await demo.page.evaluate(() => sessionStorage.getItem("react-grab-deck")),
    ).toBe("[]");
  });

  test("an empty badge ignores clicks and leaves the clipboard alone", async ({ demo }) => {
    const sentinel = "deck-untouched";
    await demo.writeClipboard(sentinel);

    await demo.page.locator(BADGE).click();

    expect(await demo.readClipboard()).toBe(sentinel);
  });

  test("the deck survives a reload within the tab", async ({ demo }) => {
    await copyGrab(demo, HEADLINE, 1);

    await demo.goto();
    await expect(demo.page.locator(BADGE)).toHaveText("1");
  });

  test("a text edit commit does not land in the deck", async ({ demo }) => {
    await demo.startEditing(HEADLINE);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("A different headline");
    await demo.page.keyboard.press("Enter");
    await demo.waitForTextEdit();

    // The Text tool copies through its own path, not react-grab's pipeline.
    await expect(demo.page.locator(BADGE)).toHaveText("");
  });
});
