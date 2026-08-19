import { EDITING_ATTRIBUTE, TEXT_ACTION_LABEL, expect, test } from "./fixtures.js";

const HEADLINE = '[data-testid="headline"]';
const DECORATIVE = '[data-testid="decorative"]';

test("the context menu greys the Text row out on an element with no text", async ({ demo }) => {
  await demo.activate();
  await demo.hoverUntilTargeted(DECORATIVE);
  await demo.rightClickTarget(DECORATIVE);

  const decorativeRow = await demo.getContextMenuRow(TEXT_ACTION_LABEL);
  expect(decorativeRow.isPresent).toBe(true);
  expect(decorativeRow.isEnabled).toBe(false);

  await demo.closeContextMenu();

  await demo.activate();
  await demo.hoverUntilTargeted(HEADLINE);
  await demo.rightClickTarget(HEADLINE);

  const headlineRow = await demo.getContextMenuRow(TEXT_ACTION_LABEL);
  expect(headlineRow.isPresent).toBe(true);
  expect(headlineRow.isEnabled).toBe(true);
});

test("arming the Text action on an element with no text starts no session", async ({ demo }) => {
  await demo.activateTextAction();
  await demo.hoverUntilTargeted(DECORATIVE);
  await demo.clickTarget(DECORATIVE);

  await expect(demo.page.locator(DECORATIVE)).not.toHaveAttribute(EDITING_ATTRIBUTE, "true");
  expect(await demo.getTextEditCount()).toBe(0);
});
