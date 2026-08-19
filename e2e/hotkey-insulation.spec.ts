import { expect, test } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';

test("the edit session swallows host hotkeys and releases them on commit", async ({ demo }) => {
  const hotkeyCount = demo.page.getByTestId("hotkey-count");
  await expect(hotkeyCount).toHaveText("0");

  await demo.startEditing(HEADLINE);
  await demo.selectAllInEditor();
  // Three "e" presses land in the editor; the host's window keydown listener
  // must not see any of them.
  await demo.page.keyboard.type("Never edit here twice");

  await expect(demo.page.locator(HEADLINE)).toHaveText("Never edit here twice");
  await expect(hotkeyCount).toHaveText("0");

  await demo.page.keyboard.press("Enter");
  await demo.waitForSessionEnded(HEADLINE);
  await demo.waitForTextEdit();

  await demo.page.keyboard.press("e");
  await expect(hotkeyCount).toHaveText("1");
});
