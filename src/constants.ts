export const PLUGIN_NAME = "text";
export const ACTION_ID = "text";
export const ACTION_LABEL = "Text";
export const ACTION_SHORTCUT = "T";

export const EDITING_ATTRIBUTE = "data-react-grab-text-editing";
export const FLASH_ATTRIBUTE = "data-react-grab-text-flash";
export const UI_ATTRIBUTE = "data-react-grab-text-ui";
export const REACT_GRAB_IGNORE_ATTRIBUTE = "data-react-grab-ignore";
export const REACT_GRAB_IGNORE_EVENTS_ATTRIBUTE = "data-react-grab-ignore-events";
export const REACT_GRAB_INPUT_ATTRIBUTE = "data-react-grab-input";

export const HINT_PILL_OFFSET_PX = 8;
export const HINT_PILL_VIEWPORT_MARGIN_PX = 8;
export const SUCCESS_FLASH_DURATION_MS = 1600;
export const OVERLAY_Z_INDEX = 2147483646;
export const SOURCE_RESOLVE_TIMEOUT_MS = 1500;

export const PREVIEW_MAX_ATTRIBUTES = 4;
export const PREVIEW_MAX_ATTRIBUTE_VALUE_LENGTH = 40;
export const PREVIEW_MAX_TEXT_LENGTH = 60;

export const NON_EDITABLE_TAGS = new Set([
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "IMG",
  "VIDEO",
  "AUDIO",
  "CANVAS",
  "IFRAME",
  "SCRIPT",
  "STYLE",
  "HTML",
  "BODY",
]);
