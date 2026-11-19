import { formatDeckItemPreview } from "./deck-preview.js";

export type DeckItemKind = "text" | "comment" | "grab" | "note";

export interface DeckSummaryPart {
  kind: "same" | "removed" | "added";
  text: string;
}

export interface DeckItemSummary {
  kind: DeckItemKind;
  parts: DeckSummaryPart[];
  element: string | null;
  component: string | null;
}

const CONTEXT_WORDS = 3;
const ELLIPSIS = "…";

const OPENING_TAG_PATTERN = /<([a-z][\w-]*)\b[^>]*>/i;
// react-grab writes `in Component (at file)` after the snippet; text edits put
// it inside the bracketed reference. Uppercase-only keeps prose like "in place"
// from matching.
const COMPONENT_PATTERN = /(?:^|\s)in ([A-Z][\w$.]*)(?= \(at |\]|$)/m;

const decodeEntities = (value: string): string =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

// Matches both forms build-edit-payload writes: `LABEL: "text"` and the
// triple-quoted block used for multi-line text.
const readTextBlock = (content: string, label: "BEFORE" | "AFTER"): string | null => {
  const block = content.match(new RegExp(`^${label}:\\n"""\\n([\\s\\S]*?)\\n"""$`, "m"));
  if (block) return block[1]!;
  const inline = content.match(new RegExp(`^${label}: "(.*)"$`, "m"));
  return inline ? inline[1]! : null;
};

// Punctuation is its own token, so "backup." → "backup you can restore."
// reads as an insertion before the full stop, not a replaced word.
const tokenize = (text: string): string[] =>
  text.match(/\s+|[\p{L}\p{N}\p{M}'’_-]+|[^\s\p{L}\p{N}\p{M}]/gu) ?? [];

const isWord = (token: string): boolean => /[\p{L}\p{N}]/u.test(token);

const takeContext = (tokens: string[], fromEnd: boolean): string => {
  const ordered = fromEnd ? [...tokens].reverse() : tokens;
  const kept: string[] = [];
  let words = 0;
  for (const token of ordered) {
    if (isWord(token)) {
      if (words === CONTEXT_WORDS) break;
      words += 1;
    }
    kept.push(token);
  }
  const isTruncated = kept.length < tokens.length;
  const text = (fromEnd ? kept.reverse() : kept).join("");
  if (!isTruncated) return text;
  return fromEnd ? `${ELLIPSIS}${text.trimStart()}` : `${text.trimEnd()}${ELLIPSIS}`;
};

type DiffOp = { kind: DeckSummaryPart["kind"]; tokens: string[] };

// Past this many token pairs a rewrite is shown as one removal and one
// insertion instead of being diffed.
const MAX_DIFF_CELLS = 40_000;

const diffTokens = (a: string[], b: string[]): DiffOp[] => {
  if (a.length * b.length > MAX_DIFF_CELLS) {
    return [
      { kind: "removed", tokens: a },
      { kind: "added", tokens: b },
    ];
  }
  const lengths = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lengths[i]![j] =
        a[i] === b[j]
          ? lengths[i + 1]![j + 1]! + 1
          : Math.max(lengths[i + 1]![j]!, lengths[i]![j + 1]!);
    }
  }
  const ops: DiffOp[] = [];
  const push = (kind: DiffOp["kind"], token: string): void => {
    const last = ops[ops.length - 1];
    if (last?.kind === kind) last.tokens.push(token);
    else ops.push({ kind, tokens: [token] });
  };
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push("same", a[i]!);
      i += 1;
      j += 1;
    } else if (lengths[i + 1]![j]! >= lengths[i]![j + 1]!) {
      push("removed", a[i]!);
      i += 1;
    } else {
      push("added", b[j]!);
      j += 1;
    }
  }
  while (i < a.length) push("removed", a[i++]!);
  while (j < b.length) push("added", b[j++]!);
  return ops;
};

const countWords = (tokens: string[]): number => tokens.filter(isWord).length;

// Word-level diff with a few words of context either side, so a one-word fix
// in a long paragraph still shows the fix. Long unchanged runs between two
// changes collapse to an ellipsis.
export const diffWords = (before: string, after: string): DeckSummaryPart[] => {
  const ops = diffTokens(tokenize(before), tokenize(after));

  const parts: DeckSummaryPart[] = [];
  const pushSame = (text: string): void => {
    if (!text) return;
    const last = parts[parts.length - 1];
    if (last?.kind === "same") last.text += text;
    else parts.push({ kind: "same", text });
  };
  // Whitespace stays outside the struck and inserted runs, so the marks hug
  // the words.
  const pushChange = (kind: "removed" | "added", text: string): void => {
    const word = text.trim();
    if (!word) {
      if (kind === "added") pushSame(text);
      return;
    }
    const [, leading = "", trailing = ""] = text.match(/^(\s*)[\s\S]*?(\s*)$/) ?? [];
    pushSame(leading);
    const previous = parts[parts.length - 1];
    if (!leading && previous && previous.kind !== "same") pushSame(" ");
    parts.push({ kind, text: word });
    pushSame(trailing);
  };

  for (const [index, op] of ops.entries()) {
    if (op.kind !== "same") {
      pushChange(op.kind, op.tokens.join(""));
      continue;
    }
    if (index === 0) {
      pushSame(takeContext(op.tokens, true));
    } else if (index === ops.length - 1) {
      pushSame(takeContext(op.tokens, false));
    } else if (countWords(op.tokens) > CONTEXT_WORDS * 2) {
      const head = takeContext(op.tokens, false);
      const tail = takeContext(op.tokens, true);
      pushSame(`${head.slice(0, -ELLIPSIS.length)} ${ELLIPSIS} ${tail.slice(ELLIPSIS.length)}`);
    } else {
      pushSame(op.tokens.join(""));
    }
  }
  return parts;
};

interface ElementReference {
  element: string | null;
  text: string | null;
  component: string | null;
}

const readReference = (content: string): ElementReference => {
  const tag = content.match(OPENING_TAG_PATTERN);
  if (!tag || tag.index === undefined) return { element: null, text: null, component: null };
  const rest = content.slice(tag.index);
  const component = rest.match(COMPONENT_PATTERN);
  const snippet = component?.index === undefined ? rest : rest.slice(0, component.index);
  const text = decodeEntities(snippet.replace(/<[^>]*>/g, " ").replace(/[\[\]`]/g, ""))
    .replace(/\s+/g, " ")
    .trim();
  return {
    element: tag[1]!.toLowerCase(),
    text: text || null,
    component: component?.[1] ?? null,
  };
};

const firstLine = (text: string): string =>
  text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !/^`{3,}$/.test(line)) ?? "";

export const summarizeDeckItem = (content: string): DeckItemSummary => {
  const reference = readReference(content);
  const location = { element: reference.element, component: reference.component };

  const before = readTextBlock(content, "BEFORE");
  const after = readTextBlock(content, "AFTER");
  if (before !== null && after !== null) {
    return { kind: "text", parts: diffWords(before, after), ...location };
  }

  const { comment, body } = formatDeckItemPreview(content);
  if (comment) {
    return { kind: "comment", parts: [{ kind: "same", text: comment }], ...location };
  }
  if (reference.element) {
    const label = reference.text ?? `<${reference.element}>`;
    return { kind: "grab", parts: [{ kind: "same", text: label }], ...location };
  }
  return { kind: "note", parts: [{ kind: "same", text: firstLine(body) }], ...location };
};

export const DECK_ITEM_KIND_LABEL: Record<DeckItemKind, string> = {
  text: "Text edit",
  comment: "Comment",
  grab: "Grab",
  note: "Note",
};
