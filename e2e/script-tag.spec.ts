import { EDITING_ATTRIBUTE, TEXT_ACTION_ID, type DemoPageObject, expect, test } from "./fixtures.js";

// Exercises dist/global.global.js — the IIFE a consumer drops in with a plain
// <script> tag, no bundler and no React on the page. Requires `npm run build`;
// the dev server answers /vendor/* with a throwing stub if dist is missing.

const HEADLINE = '[data-testid="iife-headline"]';
const COPY = '[data-testid="iife-copy"]';

const runEditCycle = async (demo: DemoPageObject, selector: string, replacement: string) => {
  await demo.startEditing(selector);
  await demo.selectAllInEditor();
  await demo.page.keyboard.type(replacement);
  await demo.page.keyboard.press("Enter");
  await demo.waitForSessionEnded(selector);
  return demo.waitForTextEdit();
};

const getReferenceLine = (payload: string): string | undefined =>
  payload.split("\n").find((line) => line.startsWith("["));

test.describe("script tag harness — react-grab first", () => {
  test.use({ startPath: "/script-tag.html" });

  test("registers from the IIFE and completes a full edit cycle", async ({ demo }) => {
    expect(await demo.getRegisteredPlugins()).toContain(TEXT_ACTION_ID);

    const replacement = "Edited without a bundler";
    const edit = await runEditCycle(demo, HEADLINE, replacement);

    expect(edit.before).toBe("Plain HTML, no bundler");
    expect(edit.after).toBe(replacement);
    expect(edit.didCopy).toBe(true);
    expect(await demo.readClipboard()).toBe(edit.payload);
    await expect(demo.page.locator(HEADLINE)).toHaveText(replacement);
  });

  test("falls back to a bare element reference when there is no React source", async ({
    demo,
  }) => {
    const edit = await runEditCycle(demo, COPY, "No source info on this page.");

    // No React fiber to resolve, so no "in Component (at file:line)" tail: the
    // reference closes straight after the element preview, and the payload
    // still carries the edit itself.
    expect(getReferenceLine(edit.payload)).toMatch(/^\[<p data-testid="iife-copy">.*<\/p>\]$/);
    expect(edit.payload).toContain('AFTER: "No source info on this page."');
  });
});

test.describe("script tag harness — plugin script before react-grab", () => {
  test.use({ startPath: "/script-tag-plugin-first.html" });

  test("registers through the react-grab:init event and completes an edit", async ({ demo }) => {
    expect(await demo.getRegisteredPlugins()).toContain(TEXT_ACTION_ID);

    const replacement = "Registered by waiting for init";
    const edit = await runEditCycle(demo, HEADLINE, replacement);

    expect(edit.before).toBe("Plain HTML, plugin loaded first");
    expect(edit.after).toBe(replacement);
    expect(edit.didCopy).toBe(true);
    expect(getReferenceLine(edit.payload)).toMatch(/^\[<h1 data-testid="iife-headline">.*<\/h1>\]$/);
    await expect(demo.page.locator(HEADLINE)).not.toHaveAttribute(EDITING_ATTRIBUTE, "true");
  });
});
