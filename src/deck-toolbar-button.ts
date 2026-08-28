import { DECK_UI_ATTRIBUTE, REACT_GRAB_IGNORE_ATTRIBUTE, REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE } from "./constants.js";

export const TOOLBAR_BUTTON_CLASS =
  "group contain-layout flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox";

export const TOOLBAR_BUTTON_WRAPPER_CLASS =
  "relative contain-layout flex items-center justify-center shrink-0";

// Deck sub-controls share one toolbar segment; trailing margin matches a native
// action wrapper. Internal gap is set inline so it does not depend on Tailwind purge.
export const DECK_CONTROLS_CLASS =
  "relative overflow-visible flex items-center shrink-0 mr-1.5";

export const DECK_CONTROLS_GAP_PX = 4;

const ICON_COLOR_ACTIVE = "text-[var(--rg-text-primary)]";
const ICON_COLOR_IDLE =
  "text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)] transition-[color] duration-150 ease-drawer";

const LABEL_COLOR_ACTIVE = "text-[var(--rg-text-primary)] font-variant-numeric tabular-nums";
const LABEL_COLOR_IDLE =
  "text-[var(--rg-text-secondary)] hover:text-[var(--rg-text-primary)] font-variant-numeric tabular-nums transition-[color] duration-150 ease-drawer";

export const markToolbarControl = (element: HTMLElement): void => {
  element.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  element.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
};

export const applyIconColor = (icon: SVGSVGElement, active: boolean): void => {
  icon.setAttribute("class", active ? ICON_COLOR_ACTIVE : ICON_COLOR_IDLE);
};

export const applyLabelColor = (button: HTMLButtonElement, active: boolean): void => {
  const next = active ? LABEL_COLOR_ACTIVE : LABEL_COLOR_IDLE;
  for (const token of [...button.classList]) {
    if (token.startsWith("text-[var(--rg-text-")) button.classList.remove(token);
  }
  for (const token of next.split(/\s+/)) button.classList.add(token);
};

export interface ToolbarButtonMount {
  wrapper: HTMLDivElement;
  button: HTMLButtonElement;
}

export const createToolbarIconButton = (
  uiPart: string,
  label: string,
  icon: SVGSVGElement,
  active = false,
): ToolbarButtonMount => {
  const wrapper = document.createElement("div");
  wrapper.className = TOOLBAR_BUTTON_WRAPPER_CLASS;

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, uiPart);
  button.className = TOOLBAR_BUTTON_CLASS;
  button.setAttribute("aria-label", label);
  button.title = label;
  markToolbarControl(button);
  applyIconColor(icon, active);
  button.append(icon);

  wrapper.append(button);
  return { wrapper, button };
};

export const createToolbarLabelButton = (uiPart: string, label: string): ToolbarButtonMount => {
  const wrapper = document.createElement("div");
  wrapper.className = TOOLBAR_BUTTON_WRAPPER_CLASS;

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(DECK_UI_ATTRIBUTE, uiPart);
  button.className = `${TOOLBAR_BUTTON_CLASS} ${LABEL_COLOR_IDLE}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  markToolbarControl(button);

  wrapper.append(button);
  return { wrapper, button };
};
