import { EDITING_ATTRIBUTE, HINT_PILL_SELECTOR, expect, test } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const TAGLINE = '[data-testid="tagline"]';
const INTRO = '[data-testid="intro"]';
const FEATURE = '[data-testid="feature-recording"]';

const HEADLINE_TEXT = "Ship better copy without a handoff";
const TAGLINE_TEXT = "Edit the words where they live.";

test.describe("inline text edit session", () => {
  test("toolbar Text action opens an edit session on the clicked element", async ({ demo }) => {
    const headline = await demo.startEditing(HEADLINE);

    await expect(headline).toHaveAttribute("contenteditable", /plaintext-only|true/);
    const hintPill = demo.page.locator(HINT_PILL_SELECTOR);
    await expect(hintPill).toBeVisible();
    await expect(hintPill).toContainText("save & copy");
    await expect(hintPill).toContainText("cancel");
    // The action deactivates react-grab so the page is live to type into.
    expect(await demo.page.evaluate(() => window.__REACT_GRAB__?.isActive())).toBe(false);
  });

  test("Enter commits the replacement, copies the payload, and reports it", async ({ demo }) => {
    const replacement = "Ship better copy in one pass";
    const headline = await demo.startEditing(HEADLINE);

    await demo.selectAllInEditor();
    await demo.page.keyboard.type(replacement);
    await demo.page.keyboard.press("Enter");

    await expect(headline).toHaveText(replacement);
    await demo.waitForSessionEnded(HEADLINE);

    const edit = await demo.waitForTextEdit();
    expect(edit.before).toBe(HEADLINE_TEXT);
    expect(edit.after).toBe(replacement);
    expect(edit.didCopy).toBe(true);
    expect(edit.payload).toMatch(
      new RegExp(`^\\[<h1 data-testid="headline">${HEADLINE_TEXT}</h1>.*\\]$`, "m"),
    );
    expect(edit.payload).toContain(`BEFORE: "${HEADLINE_TEXT}"`);
    expect(edit.payload).toContain(`AFTER: "${replacement}"`);
    expect(await demo.readClipboard()).toBe(edit.payload);
  });

  test("Escape reverts the text and the markup underneath it", async ({ demo }) => {
    const intro = demo.page.locator(INTRO);
    const htmlBefore = await intro.evaluate((element) => element.innerHTML);

    await demo.startEditing(INTRO);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type("Scratch that, never mind.");
    await expect(intro).toHaveText("Scratch that, never mind.");

    await demo.page.keyboard.press("Escape");
    await demo.waitForSessionEnded(INTRO);

    expect(await intro.evaluate((element) => element.innerHTML)).toBe(htmlBefore);
    expect(await intro.evaluate((element) => element.querySelector("b") !== null)).toBe(true);
    expect(await demo.getTextEditCount()).toBe(0);
    expect(await demo.getLastTextEdit()).toBeNull();
  });

  test("committing without a change stays quiet", async ({ demo }) => {
    const sentinel = "clipboard-sentinel-no-change";
    await demo.writeClipboard(sentinel);

    const tagline = await demo.startEditing(TAGLINE);
    await demo.page.keyboard.press("Enter");
    await demo.waitForSessionEnded(TAGLINE);

    await expect(demo.page.locator(HINT_PILL_SELECTOR)).toHaveCount(0);
    await expect(tagline).toHaveText(TAGLINE_TEXT);
    expect(await demo.getTextEditCount()).toBe(0);
    expect(await demo.readClipboard()).toBe(sentinel);
  });

  test("Shift+Enter breaks the line and the payload switches to the block form", async ({
    demo,
  }) => {
    const firstLine = "Edit the words";
    const secondLine = "where they live.";
    await demo.startEditing(TAGLINE);

    await demo.selectAllInEditor();
    await demo.page.keyboard.type(firstLine);
    await demo.page.keyboard.press("Shift+Enter");
    await demo.page.keyboard.type(secondLine);
    // Still editing: Shift+Enter must not commit.
    await expect(demo.page.locator(TAGLINE)).toHaveAttribute(EDITING_ATTRIBUTE, "true");

    await demo.page.keyboard.press("Enter");
    await demo.waitForSessionEnded(TAGLINE);

    const edit = await demo.waitForTextEdit();
    expect(edit.after).toBe(`${firstLine}\n${secondLine}`);
    expect(edit.payload).toContain(`BEFORE: "${TAGLINE_TEXT}"`);
    expect(edit.payload).toContain(`AFTER:\n"""\n${firstLine}\n${secondLine}\n"""`);
  });

  test("a pointer press outside the element commits the edit", async ({ demo }) => {
    const replacement = "Committed by clicking away";
    const feature = await demo.startEditing(FEATURE);

    await demo.selectAllInEditor();
    await demo.page.keyboard.type(replacement);
    await demo.page.getByTestId("outside-area").click();

    await demo.waitForSessionEnded(FEATURE);
    await expect(feature).toHaveText(replacement);

    const edit = await demo.waitForTextEdit();
    expect(edit.before).toBe("Studio-quality recording in the browser");
    expect(edit.after).toBe(replacement);
  });

  test("an element with nested inline markup edits as one block of text", async ({ demo }) => {
    const replacement = "One flat sentence, no bold left.";
    const intro = demo.page.locator(INTRO);
    const neighbour = demo.page.getByTestId("intro-secondary");
    const neighbourText = await neighbour.innerText();
    const textBefore = await intro.evaluate((element) => (element as HTMLElement).innerText);
    expect(textBefore).toContain("editable in place");

    await demo.startEditing(INTRO);
    await demo.selectAllInEditor();
    await demo.page.keyboard.type(replacement);
    await demo.page.keyboard.press("Enter");
    await demo.waitForSessionEnded(INTRO);

    const edit = await demo.waitForTextEdit();
    expect(edit.before).toBe(textBefore);
    expect(edit.after).toBe(replacement);
    expect(edit.payload).toContain('[<p data-testid="intro">');
    expect(await intro.evaluate((element) => element.querySelector("b") !== null)).toBe(false);
    await expect(intro).toHaveText(replacement);
    // The neighbouring paragraph is left alone.
    expect(await neighbour.innerText()).toBe(neighbourText);
  });
});
