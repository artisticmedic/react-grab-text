import {
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
  REACT_GRAB_IGNORE_ATTRIBUTE,
  UI_ATTRIBUTE,
} from "../constants.js";

const STYLE_ELEMENT_ID = "react-grab-text-styles";

export const ensureStyleSheet = (): void => {
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.setAttribute(REACT_GRAB_IGNORE_ATTRIBUTE, "true");
  style.setAttribute(UI_ATTRIBUTE, "true");
  style.textContent = `
[${EDITING_ATTRIBUTE}] {
  outline: 1.5px solid #a855f7 !important;
  outline-offset: 2px !important;
  cursor: text !important;
}
[${FLASH_ATTRIBUTE}] {
  outline: 1.5px solid #22c55e !important;
  outline-offset: 2px !important;
  transition: outline-color 0.9s ease 0.5s;
}
[${FLASH_ATTRIBUTE}="fading"] {
  outline-color: transparent !important;
}
`;
  document.head.appendChild(style);
};
