import { test, expect } from "./fixtures.js";
import { measureDistances } from "../src/measure-geometry.js";

const TOGGLE = '[data-react-grab-measure="toggle"]';
const OVERLAY = '[data-react-grab-measure="overlay"]';

test.use({ startPath: "/measure.html" });

test("hover measures the box without mutating it or activating its button", async ({ demo, page }) => {
  const card = page.getByTestId("measure-card-a");
  const before = await card.evaluate(element => element.outerHTML);
  await page.locator(TOGGLE).click();
  await card.hover({ position: { x: 5, y: 5 } });
  await expect(page.locator("[data-measure-details]")).toContainText("Padding  24  24  24  24");
  await page.getByTestId("measure-cta").click();
  await expect(page.getByTestId("measure-clicks")).toHaveText("Button clicks: 0");
  expect(await card.evaluate(element => element.outerHTML)).toBe(before);
  expect(await page.evaluate(() => window.__REACT_GRAB__?.isActive())).toBe(false);
  await page.keyboard.press("Escape");
  await expect(page.locator(OVERLAY)).toBeAttached();
  await page.keyboard.press("Escape");
  await expect(page.locator(OVERLAY)).not.toBeAttached();
  await page.getByTestId("measure-cta").click();
  await expect(page.getByTestId("measure-clicks")).toHaveText("Button clicks: 1");
});

test("anchored measurements show sibling gaps and all four container insets", async ({ demo, page }) => {
  await page.locator(TOGGLE).click();
  await page.getByTestId("measure-card-a").click({ position: { x: 5, y: 5 } });
  await page.getByTestId("measure-card-b").hover({ position: { x: 5, y: 5 } });
  await expect(page.locator('[data-measure-distance="32 px"]')).toHaveCount(1);
  await page.getByTestId("measure-child").click({ position: { x: 5, y: 5 } });
  await page.getByTestId("measure-parent").hover({ position: { x: 5, y: 5 } });
  await expect(page.locator('[data-measure-distance="40 px"]')).toHaveCount(4);
  await page.evaluate(() => window.scrollBy(0, 30));
  await expect(page.locator('[data-measure-distance="40 px"]')).toHaveCount(4);
});

test("the session and its anchor survive leaving the window", async ({ demo, page }) => {
  await page.locator(TOGGLE).click();
  await page.getByTestId("measure-card-a").click({ position: { x: 5, y: 5 } });
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator(OVERLAY)).toBeAttached();
  // The badge only renders against a live anchor, so its return proves the
  // anchor outlived the blur rather than the overlay merely staying mounted.
  await page.getByTestId("measure-card-b").hover({ position: { x: 5, y: 5 } });
  await expect(page.locator('[data-measure-distance="32 px"]')).toHaveCount(1);
});

test("a negative margin is drawn inward and hatched, not clamped away", async ({ demo, page }) => {
  const card = page.getByTestId("measure-card-b");
  await card.evaluate(element => { (element as HTMLElement).style.marginTop = "-24px"; });
  await page.locator(TOGGLE).click();
  await card.hover({ position: { x: 5, y: 5 } });

  await expect(page.locator("[data-measure-details]")).toContainText("Margin    -24");
  const band = await page.locator(OVERLAY).evaluate((host, box) => {
    const rect = [...(host as HTMLElement).shadowRoot!.querySelectorAll("rect")]
      .find(node => node.getAttribute("fill")?.startsWith("url(") && Number(node.getAttribute("height")) > 0);
    if (!rect) return null;
    return { top: Number(rect.getAttribute("y")), height: Number(rect.getAttribute("height")), boxTop: box };
  }, await card.evaluate(element => element.getBoundingClientRect().top));

  expect(band).not.toBeNull();
  expect(band!.height).toBeCloseTo(24, 0);
  // Inward: the band starts at the border-box edge and runs down into it,
  // rather than sitting above the edge the way a positive margin does.
  expect(band!.top).toBeCloseTo(band!.boxTop, 0);
});

test("another Grab action and plugin cleanup release measurement", async ({ demo, page }) => {
  await page.locator(TOGGLE).click();
  await page.locator('[data-react-grab-toolbar-action="text"]').click();
  await expect(page.locator(OVERLAY)).not.toBeAttached();
  await page.locator(TOGGLE).click();
  await expect(page.locator(OVERLAY)).toBeAttached();
  await page.evaluate(() => window.__REACT_GRAB__?.unregisterPlugin("measure"));
  await expect(page.locator(OVERLAY)).not.toBeAttached();
  await expect(page.locator(TOGGLE)).not.toBeAttached();
  // Removing a hovered toolbar control puts a native Grab action under the
  // stationary pointer. Move off the palette to release its hover freeze,
  // as a person does before clicking the page (Playwright hit-tests first).
  await page.mouse.move(10, 10);
  await page.getByTestId("measure-cta").click();
  await expect(page.getByTestId("measure-clicks")).toHaveText("Button clicks: 1");
});

test("distance geometry handles overlap, containment, touching and diagonal gaps", () => {
  const anchor = { left: 20, right: 120, top: 20, bottom: 120, width: 100, height: 100 };
  expect(measureDistances(anchor, { left: 152, right: 252, top: 160, bottom: 260, width: 100, height: 100 }).map(line => line.value)).toEqual([32, 40]);
  expect(measureDistances(anchor, { left: 0, right: 140, top: 0, bottom: 140, width: 140, height: 140 }).map(line => line.value)).toEqual([20, 20, 20, 20]);
  expect(measureDistances(anchor, { left: 70, right: 170, top: 20, bottom: 120, width: 100, height: 100 }).map(line => line.value)).toEqual([50, 50]);
  expect(measureDistances(anchor, anchor)).toEqual([]);
  expect(measureDistances(anchor, { left: 120, right: 220, top: 20, bottom: 120, width: 100, height: 100 })).toEqual([]);
});
