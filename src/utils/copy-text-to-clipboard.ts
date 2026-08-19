import {
  REACT_GRAB_IGNORE_ATTRIBUTE,
  REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE,
  UI_ATTRIBUTE,
} from "../constants.js";

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the execCommand path
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  textarea.setAttribute(REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE, "true");
  textarea.setAttribute(UI_ATTRIBUTE, "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";

  const previousActiveElement = document.activeElement;
  document.body.appendChild(textarea);
  textarea.select();

  let didCopy = false;
  try {
    didCopy = document.execCommand("copy");
  } catch {
    didCopy = false;
  }

  textarea.remove();
  if (previousActiveElement instanceof HTMLElement && previousActiveElement.isConnected) {
    previousActiveElement.focus({ preventScroll: true });
  }
  return didCopy;
};
