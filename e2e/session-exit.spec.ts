import { EDITING_ATTRIBUTE, HINT_PILL_SELECTOR, expect, test } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const INTRO = '[data-testid="intro"]';
const EMAIL_INPUT = '[data-testid="email-input"]';

test("react-grab reactivating over a live session commits it", async ({ demo }) => {
  const replacement = "Committed by reactivation";
  await demo.startEditing(HEADLINE);
  await demo.selectAllInEditor();
  await demo.page.keyboard.type(replacement);

  // Programmatic activation reaches no pointerdown and no keystroke, so only
  // the onStateChange hook can end the session.
  await demo.page.evaluate(() => window.__REACT_GRAB__?.activate());

  await demo.waitForSessionEnded(HEADLINE);
  const edit = await demo.waitForTextEdit();
  expect(edit.after).toBe(replacement);
  expect(edit.didCopy).toBe(true);
  await expect(demo.page.locator(HEADLINE)).toHaveText(replacement);
  // The overlay is up and owns the page again, with no edit left underneath it.
  expect(await demo.page.evaluate(() => window.__REACT_GRAB__?.isActive())).toBe(true);
});

test("an out-of-session Escape commits the edit and passes through to the host", async ({
  demo,
}) => {
  const replacement = "Survives the outside Escape";
  const headline = demo.page.locator(HEADLINE);

  await demo.startEditing(HEADLINE);
  await demo.selectAllInEditor();
  await demo.page.keyboard.type(replacement);
  await expect(headline).toHaveText(replacement);

  // Focus moves without a pointerdown — the case an outside-click commit
  // cannot cover. The Escape is aimed at the host UI, so the typed edit must
  // survive (commit, not cancel) and the host must still see the key.
  await demo.focusElement(EMAIL_INPUT);
  expect(await demo.page.evaluate(() => document.activeElement?.getAttribute("data-testid"))).toBe(
    "email-input",
  );
  await demo.page.evaluate(() => {
    (window as Window & { __escapeSeen?: number }).__escapeSeen = 0;
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        (window as Window & { __escapeSeen?: number }).__escapeSeen! += 1;
      }
    });
  });

  await demo.page.keyboard.press("Escape");

  await demo.waitForSessionEnded(HEADLINE);
  const edit = await demo.waitForTextEdit();
  expect(edit.after).toBe(replacement);
  await expect(headline).toHaveText(replacement);
  expect(
    await demo.page.evaluate(() => (window as Window & { __escapeSeen?: number }).__escapeSeen),
  ).toBe(1);
});

test("Escape inside the session cancels and is swallowed", async ({ demo }) => {
  const headline = demo.page.locator(HEADLINE);
  const htmlBefore = await headline.evaluate((element) => element.innerHTML);

  await demo.startEditing(HEADLINE);
  await demo.selectAllInEditor();
  await demo.page.keyboard.type("This should never survive");
  await expect(headline).toHaveText("This should never survive");

  await demo.page.keyboard.press("Escape");

  await demo.waitForSessionEnded(HEADLINE);
  expect(await headline.evaluate((element) => element.innerHTML)).toBe(htmlBefore);
  expect(await demo.getTextEditCount()).toBe(0);
});

test("a commit that flattens markup without changing text restores the DOM", async ({ demo }) => {
  const sentinel = "clipboard-sentinel-no-change-restore";
  await demo.writeClipboard(sentinel);

  const intro = demo.page.locator(INTRO);
  const htmlBefore = await intro.evaluate((element) => element.innerHTML);
  const textBefore = await intro.evaluate((element) => (element as HTMLElement).innerText);
  expect(htmlBefore).toContain("<b");

  await demo.startEditing(INTRO);
  await demo.selectAllInEditor();
  // Retyping the identical text destroys the nested <b> but leaves innerText
  // unchanged, so the commit classifies as a no-op and has to put the markup
  // back rather than leave an unrecorded mutation on the page.
  await demo.page.keyboard.type(textBefore);
  expect(await intro.evaluate((element) => element.querySelector("b") !== null)).toBe(false);

  await demo.page.keyboard.press("Enter");

  await expect(demo.page.locator(HINT_PILL_SELECTOR)).toContainText("No text change");
  await expect(intro).not.toHaveAttribute(EDITING_ATTRIBUTE, "true");
  expect(await intro.evaluate((element) => element.innerHTML)).toBe(htmlBefore);
  expect(await intro.evaluate((element) => element.querySelector("b") !== null)).toBe(true);
  expect(await demo.getTextEditCount()).toBe(0);
  expect(await demo.readClipboard()).toBe(sentinel);
});
