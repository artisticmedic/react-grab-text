import { NON_EDITABLE_TAGS, UI_ATTRIBUTE } from "../constants.js";

export const isTextEditableElement = (element: Element): element is HTMLElement => {
  if (!(element instanceof HTMLElement)) return false;
  if (NON_EDITABLE_TAGS.has(element.tagName)) return false;
  if (element.closest(`svg, [${UI_ATTRIBUTE}]`)) return false;
  if (element.querySelector("input, textarea, select, iframe, canvas, video, audio")) {
    return false;
  }
  return element.innerText.trim().length > 0;
};
