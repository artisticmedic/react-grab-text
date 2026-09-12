import { test, expect } from "./fixtures.js";

const MEASURE = '[data-react-grab-measure="toggle"]';
const DECK = '[data-react-grab-deck-ui="mode-toggle"]';
const REVIEW = '[data-react-grab-deck-ui="panel-toggle"]';

test("Measure and a numbered Deck follow the palette around all four edges", async ({ demo, page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem("react-grab-deck", JSON.stringify(Array.from({ length: 12 }, (_, index) => ({
      id: `layout-${index}`, content: `Review item ${index + 1}`,
    }))));
  });
  await page.reload();
  await expect(page.locator(`${DECK} [data-react-grab-deck-face="count"]`)).toHaveText("12");
  await expect(page.locator(`${DECK} [data-react-grab-deck-face="stack"]`)).toHaveCSS("opacity", "0");

  for (const edge of ["left", "right", "top", "bottom"] as const) {
    await page.locator('[data-react-grab-toolbar-action="comment"]').hover();
    const dragHandle = (await page.locator('[data-react-grab-toolbar-action="comment"]').boundingBox())!;
    const viewport = page.viewportSize()!;
    const destination = {
      left: { x: 16, y: viewport.height / 2 },
      right: { x: viewport.width - 16, y: viewport.height / 2 },
      top: { x: viewport.width / 2, y: 16 },
      bottom: { x: viewport.width / 2, y: viewport.height - 16 },
    }[edge];
    await page.mouse.move(dragHandle.x + dragHandle.width / 2, dragHandle.y + dragHandle.height / 2);
    await page.mouse.down();
    await page.mouse.move(destination.x, destination.y, { steps: 12 });
    await page.mouse.up();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("react-grab-toolbar-state") ?? "{}").edge)).toBe(edge);

    const vertical = edge === "left" || edge === "right";
    await expect.poll(async () => {
      const measure = (await page.locator(MEASURE).boundingBox())!;
      const deck = (await page.locator(DECK).boundingBox())!;
      const review = (await page.locator(REVIEW).boundingBox())!;
      return vertical
        ? Math.max(Math.abs(measure.x - deck.x), Math.abs(deck.x - review.x))
        : Math.max(Math.abs(measure.y - deck.y), Math.abs(deck.y - review.y));
    }).toBeLessThan(1);

    await page.locator(MEASURE).click();
    const hint = page.locator("[data-measure-hint]");
    await expect(hint).toBeVisible();
    const hintBounds = (await hint.boundingBox())!;
    const toolbar = (await page.locator("[data-react-grab-toolbar-panel]").boundingBox())!;
    if (edge === "left") expect(hintBounds.x).toBeGreaterThan(toolbar.x + toolbar.width);
    if (edge === "right") expect(hintBounds.x + hintBounds.width).toBeLessThan(toolbar.x);
    if (edge === "top") expect(hintBounds.y).toBeGreaterThan(toolbar.y + toolbar.height);
    if (edge === "bottom") expect(hintBounds.y + hintBounds.height).toBeLessThan(toolbar.y);
    await page.locator('[data-testid="headline"]').hover();
    await expect(page.locator("[data-measure-details]")).toContainText("h1");
    await page.keyboard.press("Escape");

    const count = (await page.locator(`${DECK} [data-react-grab-deck-face="count"]`).boundingBox())!;
    const batchControl = (await page.locator(DECK).boundingBox())!;
    expect(Math.abs(count.x + count.width / 2 - batchControl.x - batchControl.width / 2)).toBeLessThan(1);
    expect(Math.abs(count.y + count.height / 2 - batchControl.y - batchControl.height / 2)).toBeLessThan(1);
    await expect(page.locator(`${DECK} [data-react-grab-deck-face="stack"]`)).toHaveCSS("opacity", "0");

    await page.locator(REVIEW).click();
    const panel = (await page.locator('[data-react-grab-deck-ui="panel"]').boundingBox())!;
    if (edge === "left") expect(panel.x).toBeGreaterThan(toolbar.x + toolbar.width);
    if (edge === "right") expect(panel.x + panel.width).toBeLessThan(toolbar.x);
    expect(panel.x).toBeGreaterThanOrEqual(0);
    expect(panel.x + panel.width).toBeLessThanOrEqual(viewport.width);
    await page.locator(REVIEW).click();
  }
});
