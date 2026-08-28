import { DECK_UI_ATTRIBUTE } from "./constants.js";
import { createDeckBatchIcon } from "./deck-batch-icon.js";
import { iconDeckCheck } from "./deck-icons.js";
import {
  applyIconColor,
  applyLabelColor,
  markToolbarControl,
  TOOLBAR_BUTTON_CLASS,
  TOOLBAR_BUTTON_WRAPPER_CLASS,
} from "./deck-toolbar-button.js";

export const DECK_FACE_ATTRIBUTE = "data-react-grab-deck-face";

export type DeckAffordanceFace = "stack" | "count" | "check";

const FACE_TRANSITION =
  "opacity 160ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)";

const faceVisibilityStyle = (visible: boolean): Partial<CSSStyleDeclaration> => ({
  opacity: visible ? "1" : "0",
  transform: visible ? "scale(1)" : "scale(0.82)",
});

export interface DeckAffordance {
  wrapper: HTMLDivElement;
  button: HTMLButtonElement;
  setFace: (face: DeckAffordanceFace, count?: number) => void;
  setBatchActive: (active: boolean) => void;
}

export const createDeckAffordance = (): DeckAffordance => {
  const wrapper = document.createElement("div");
  wrapper.className = TOOLBAR_BUTTON_WRAPPER_CLASS;

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, "mode-toggle");
  button.className = `${TOOLBAR_BUTTON_CLASS} relative`;
  button.setAttribute("aria-live", "polite");
  button.setAttribute("aria-pressed", "false");
  markToolbarControl(button);

  const viewport = document.createElement("span");
  Object.assign(viewport.style, {
    position: "relative",
    display: "block",
    width: "14px",
    height: "14px",
    overflow: "visible",
  });

  const stackFace = document.createElement("span");
  stackFace.setAttribute(DECK_FACE_ATTRIBUTE, "stack");
  Object.assign(stackFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none",
    overflow: "visible",
  });
  const batchIcon = createDeckBatchIcon();
  const stackIcon = batchIcon.svg;
  stackFace.append(stackIcon);

  const countFace = document.createElement("span");
  countFace.setAttribute(DECK_FACE_ATTRIBUTE, "count");
  Object.assign(countFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none",
    fontSize: "13px",
    lineHeight: "14px",
    letterSpacing: "-0.02em",
    fontVariantNumeric: "tabular-nums",
  });

  const checkFace = document.createElement("span");
  checkFace.setAttribute(DECK_FACE_ATTRIBUTE, "check");
  Object.assign(checkFace.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: FACE_TRANSITION,
    pointerEvents: "none",
  });
  const checkIcon = iconDeckCheck();
  checkFace.append(checkIcon);

  viewport.append(stackFace, countFace, checkFace);
  button.append(viewport);
  wrapper.append(button);

  let batchActive = false;
  let currentFace: DeckAffordanceFace = "stack";

  const setFace = (face: DeckAffordanceFace, count = 0): void => {
    currentFace = face;
    if (face === "count") countFace.textContent = String(count);
    for (const [name, element] of [
      ["stack", stackFace],
      ["count", countFace],
      ["check", checkFace],
    ] as const) {
      Object.assign(element.style, faceVisibilityStyle(name === face));
    }
    applyIconColor(stackIcon, batchActive && face === "stack");
    applyIconColor(checkIcon, face === "check");
    if (face !== "stack") batchIcon.setPreview(false);
    if (face === "count") {
      countFace.className =
        "text-[var(--rg-text-primary)] font-variant-numeric tabular-nums transition-[color] duration-150 ease-drawer";
    }
  };

  const setBatchActive = (active: boolean): void => {
    batchActive = active;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    batchIcon.setActive(active);
    if (!active) batchIcon.setPreview(false);
    if (currentFace === "stack") applyIconColor(stackIcon, active);
  };

  const updateStackPreview = (): void => {
    if (currentFace !== "stack" || batchActive) {
      batchIcon.setPreview(false);
      return;
    }
    batchIcon.setPreview(button.matches(":hover"));
  };

  button.addEventListener("pointerenter", updateStackPreview);
  button.addEventListener("pointerleave", () => batchIcon.setPreview(false));
  button.addEventListener("focus", updateStackPreview);
  button.addEventListener("blur", () => batchIcon.setPreview(false));

  setFace("stack");

  return { wrapper, button, setFace, setBatchActive };
};
