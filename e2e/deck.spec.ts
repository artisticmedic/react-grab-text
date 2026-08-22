import { expect, test, type DemoPageObject } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';

const BADGE = '[data-react-grab-deck-ui="badge"]';

// The toolbar animates, so Playwright's hit-testing click never sees it
// stable — click programmatically, same pattern as fixtures' activateTextAction.
const clickBadge = async (demo: DemoPageObject): Promise<void> => {
  await demo.page.evaluate(() => {
    const host = document.querySelector("[data-react-grab]");
    const root = host?.shadowRoot?.querySelector("[data-react-grab]");
    root?.querySelector<HTMLButtonElement>('[data-react-grab-deck-ui="badge"]')?.click();
  });
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
    const isAfterTextButton = await demo.page.evaluate(() => {
      const host = document.querySelector("[data-react-grab]");
      const root = host?.shadowRoot?.querySelector("[data-react-grab]");
      const textButton = root?.querySelector('[data-react-grab-toolbar-action="text"]');
      return textButton?.nextElementSibling?.getAttribute("data-react-grab-deck-ui") === "badge";
    });
    expect(isAfterTextButton).toBe(true);

    // The injected element gets none of react-grab's shadow styles — the
    // badge must resolve its own foreground with real contrast to the panel.
    const contrast = await demo.page.evaluate(() => {
      const host = document.querySelector("[data-react-grab]");
      const root = host?.shadowRoot?.querySelector("[data-react-grab]");
      const badgeElement = root?.querySelector('[data-react-grab-deck-ui="badge"]');
      if (!badgeElement) return null;
      const luminanceOf = (color: string): number => {
        const channels = color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
        return 0.299 * (channels[0] ?? 0) + 0.587 * (channels[1] ?? 0) + 0.114 * (channels[2] ?? 0);
      };
      let ancestor = badgeElement.parentElement;
      while (ancestor) {
        const background = getComputedStyle(ancestor).backgroundColor;
        const alpha = background.match(/[\d.]+/g)?.map(Number)[3] ?? 1;
        if (background !== "rgba(0, 0, 0, 0)" && alpha > 0.1) {
          return Math.abs(
            luminanceOf(getComputedStyle(badgeElement).color) - luminanceOf(background),
          );
        }
        ancestor = ancestor.parentElement;
      }
      return null;
    });
    expect(contrast).not.toBeNull();
    expect(contrast!).toBeGreaterThan(60);
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

    await expect(demo.page.locator(BADGE)).toHaveText("✓");
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
