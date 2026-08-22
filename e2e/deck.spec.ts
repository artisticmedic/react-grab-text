import { REACT_GRAB_ATTRIBUTE, expect, test, type DemoPageObject } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';

const BADGE = '[data-react-grab-deck-ui="badge"]';

// The toolbar animates, so Playwright's hit-testing click never sees it
// stable — click programmatically, same pattern as fixtures' activateTextAction.
const clickBadge = async (demo: DemoPageObject): Promise<void> => {
  await demo.page.evaluate((attributeName) => {
    const host = document.querySelector(`[${attributeName}]`);
    const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
    root?.querySelector<HTMLButtonElement>('[data-react-grab-deck-ui="badge"]')?.click();
  }, REACT_GRAB_ATTRIBUTE);
};

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
  test("the badge sits next to the toolbar Text action and is hidden while empty", async ({
    demo,
  }) => {
    const badge = demo.page.locator(BADGE);
    // Injection waits for the toolbar to exist (500ms reattach interval).
    await expect(badge).toBeAttached({ timeout: 10_000 });
    await expect(badge).toBeHidden();
    const isAfterTextButton = await demo.page.evaluate((attributeName) => {
      const host = document.querySelector(`[${attributeName}]`);
      const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
      const textButton = root?.querySelector('[data-react-grab-toolbar-action="text"]');
      return textButton?.nextElementSibling?.getAttribute("data-react-grab-deck-ui") === "badge";
    }, REACT_GRAB_ATTRIBUTE);
    expect(isAfterTextButton).toBe(true);

    // The injected element gets none of react-grab's shadow styles — its
    // color must resolve to react-grab's own theme foreground token.
    const colors = await demo.page.evaluate((attributeName) => {
      const host = document.querySelector(`[${attributeName}]`);
      const root = host?.shadowRoot?.querySelector(`[${attributeName}]`);
      const badgeElement = root?.querySelector('[data-react-grab-deck-ui="badge"]');
      if (!badgeElement) return null;
      return {
        badge: getComputedStyle(badgeElement).color,
        theme: getComputedStyle(badgeElement).getPropertyValue("--rg-text-primary").trim(),
      };
    }, REACT_GRAB_ATTRIBUTE);
    expect(colors).not.toBeNull();
    expect(colors!.theme).not.toBe("");
    // Resolve the token through a scratch element so both sides compare in
    // the same computed rgb() form.
    const themeAsRgb = await demo.page.evaluate((themeColor) => {
      const probe = document.createElement("span");
      probe.style.color = themeColor;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    }, colors!.theme);
    expect(colors!.badge).toBe(themeAsRgb);
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

    await clickBadge(demo);

    // The flash must be visible, not just present — the flush drops the count
    // to 0 mid-copy and the badge must not hide before the checkmark shows.
    await expect(demo.page.locator(BADGE)).toHaveText("✓");
    await expect(demo.page.locator(BADGE)).toBeVisible();
    const clipboard = await demo.readClipboard();
    expect(clipboard).toMatch(/^1\.\n```\n\[<h1 data-testid="headline">/);
    expect(clipboard).toContain("\n--\n2.\n```\n");
    expect(clipboard).toMatch(/\[<p data-testid="tagline">/);
    expect(clipboard).toMatch(/\n```$/);

    // Copying flushes the queue; after the flash the badge disappears.
    await expect(demo.page.locator(BADGE)).toBeHidden({ timeout: 5_000 });
    expect(
      await demo.page.evaluate(() => sessionStorage.getItem("react-grab-deck")),
    ).toBe("[]");
  });

  test("an empty deck leaves no visible badge to click", async ({ demo }) => {
    // Hidden = unclickable; nothing can reach the clipboard through it.
    await expect(demo.page.locator(BADGE)).toBeHidden();
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
    await expect(demo.page.locator(BADGE)).toBeHidden();
  });
});
