import {
  EDITING_ATTRIBUTE,
  HINT_PILL_SELECTOR,
  type DemoPageObject,
  expect,
  test,
} from "./fixtures.js";

const INTRO = '[data-testid="intro"]';
const TAGLINE = '[data-testid="tagline"]';

interface WordTarget {
  x: number;
  y: number;
  offset: number;
  nodeText: string;
}

// Locates a specific word's on-screen box so the click can land on it rather
// than on whatever sits at the element's centre.
const findWord = async (
  demo: DemoPageObject,
  selector: string,
  word: string,
): Promise<WordTarget> => {
  const target = await demo.page.locator(selector).first().evaluate((element, searchWord) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const text = node.textContent ?? "";
      const index = text.indexOf(searchWord);
      if (index >= 0) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + searchWord.length);
        const bounds = range.getBoundingClientRect();
        return {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          offset: index,
          nodeText: text,
        };
      }
      node = walker.nextNode();
    }
    return null;
  }, word);
  if (!target) throw new Error(`Could not locate the word "${word}" in ${selector}`);
  return target;
};

test("the caret lands on the clicked word, not at the end of the text", async ({ demo }) => {
  const word = "wording";
  const target = await findWord(demo, INTRO, word);

  await demo.activateTextAction();
  await demo.hoverPointUntilTargeted(INTRO, target);
  await demo.clickPoint(target);
  await expect(demo.page.locator(INTRO)).toHaveAttribute(EDITING_ATTRIBUTE, "true");

  const caret = await demo.getCaret();
  // The fallback in placeCaret collapses to the end of the element's contents,
  // which anchors on the element itself — so a text-node anchor already proves
  // the click coordinates survived react-grab's onDragStart hook.
  expect(caret.isTextNode).toBe(true);
  expect(caret.isAtContentEnd).toBe(false);
  expect(caret.anchorText).toContain(word);
  // Clicking the middle of the word puts the caret inside it; allow the whole
  // word plus a character of slack on either side for sub-pixel hit testing.
  expect(caret.anchorOffset).toBeGreaterThanOrEqual(target.offset - 1);
  expect(caret.anchorOffset).toBeLessThanOrEqual(target.offset + word.length + 1);

  // Typing at the caret inserts mid-sentence rather than appending.
  await demo.page.keyboard.type("XX");
  const text = await demo.page.locator(INTRO).innerText();
  expect(text).toContain("XX");
  expect(text.endsWith("XX")).toBe(false);
});

test("the bare t shortcut starts a session on the hovered element", async ({ demo }) => {
  // Plain activation, no armed toolbar action: the shortcut is the only thing
  // that can open a session here.
  await demo.activate();
  await demo.hoverUntilTargeted(TAGLINE);

  await demo.page.keyboard.press("t");

  await expect(demo.page.locator(TAGLINE)).toHaveAttribute(EDITING_ATTRIBUTE, "true");
  await expect(demo.page.locator(HINT_PILL_SELECTOR)).toBeVisible();
  expect(await demo.page.evaluate(() => window.__REACT_GRAB__?.isActive())).toBe(false);

  // And it is a real session: it commits like any other.
  await demo.selectAllInEditor();
  await demo.page.keyboard.type("Opened with a keystroke");
  await demo.page.keyboard.press("Enter");
  const edit = await demo.waitForTextEdit();
  expect(edit.after).toBe("Opened with a keystroke");
});
