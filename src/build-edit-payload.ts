import type { EditSource } from "./types.js";
import { safeDecodeFilePath } from "./utils/safe-decode-file-path.js";

interface BuildEditPayloadOptions {
  source: EditSource;
  elementPreview: string;
  before: string;
  after: string;
  textTransform?: string;
  preserveWhitespace?: boolean;
}

const formatReference = (source: EditSource, elementPreview: string): string => {
  const parts = [elementPreview];
  if (source.componentName) parts.push(`in ${source.componentName}`);
  if (source.filePath) {
    const lineSuffix = source.lineNumber ? `:${source.lineNumber}` : "";
    parts.push(`(at ${safeDecodeFilePath(source.filePath)}${lineSuffix})`);
  }
  return `[${parts.join(" ")}]`;
};

const formatTextBlock = (label: string, text: string, preserveWhitespace?: boolean): string => {
  const normalized = preserveWhitespace ? text : text.trim();
  if (normalized.includes("\n")) {
    return `${label}:\n"""\n${normalized}\n"""`;
  }
  return `${label}: "${normalized}"`;
};

export const buildEditPayload = ({
  source,
  elementPreview,
  before,
  after,
  textTransform,
  preserveWhitespace,
}: BuildEditPayloadOptions): string => {
  const hasTextTransform = Boolean(textTransform) && textTransform !== "none";
  const instruction = [
    "Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.",
    hasTextTransform
      ? ` NOTE: this element renders with CSS text-transform: ${textTransform}; BEFORE/AFTER are shown as rendered — keep the source string's original casing.`
      : "",
  ].join("");
  return [
    instruction,
    "",
    formatReference(source, elementPreview),
    formatTextBlock("BEFORE", before, preserveWhitespace),
    formatTextBlock("AFTER", after, preserveWhitespace),
  ].join("\n");
};
