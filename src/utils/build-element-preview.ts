import {
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
  PREVIEW_MAX_ATTRIBUTES,
  PREVIEW_MAX_ATTRIBUTE_VALUE_LENGTH,
  PREVIEW_MAX_TEXT_LENGTH,
  REACT_GRAB_INPUT_ATTRIBUTE,
} from "../constants.js";

const SKIPPED_ATTRIBUTES = new Set([
  "contenteditable",
  "spellcheck",
  EDITING_ATTRIBUTE,
  FLASH_ATTRIBUTE,
  REACT_GRAB_INPUT_ATTRIBUTE,
]);

const escapeAttributeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const escapeText = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const truncate = (value: string, maxLength: number): string =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

export const buildElementPreview = (element: HTMLElement, textContent: string): string => {
  const tagName = element.tagName.toLowerCase();
  const attributeParts: string[] = [];
  for (const attribute of Array.from(element.attributes)) {
    if (attributeParts.length >= PREVIEW_MAX_ATTRIBUTES) break;
    if (SKIPPED_ATTRIBUTES.has(attribute.name)) continue;
    const value = truncate(attribute.value, PREVIEW_MAX_ATTRIBUTE_VALUE_LENGTH);
    attributeParts.push(`${attribute.name}="${escapeAttributeValue(value)}"`);
  }
  const attributes = attributeParts.length > 0 ? ` ${attributeParts.join(" ")}` : "";
  const firstLine = textContent.trim().split("\n")[0] ?? "";
  const textPreview = escapeText(truncate(firstLine, PREVIEW_MAX_TEXT_LENGTH));
  return `<${tagName}${attributes}>${textPreview}</${tagName}>`;
};
