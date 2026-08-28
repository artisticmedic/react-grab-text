export interface DeckItemPreview {
  comment: string | null;
  body: string;
}

const stripFence = (content: string): { comment: string | null; body: string } => {
  const fenceStart = content.indexOf("```");
  if (fenceStart === -1) {
    return { comment: null, body: content.trim() };
  }

  const comment = content.slice(0, fenceStart).trim() || null;
  const afterFence = content.slice(fenceStart + 3);
  const fenceEnd = afterFence.lastIndexOf("```");
  const inner =
    fenceEnd === -1 ? afterFence.trim() : afterFence.slice(0, fenceEnd).replace(/^\n/, "").trim();
  return { comment, body: inner };
};

export const formatDeckItemPreview = (content: string): DeckItemPreview => {
  const { comment, body } = stripFence(content);
  return { comment, body: body.trim() };
};

const fenceForBody = (body: string): string => {
  const longestRun = body.match(/`+/g)?.reduce((max, run) => Math.max(max, run.length), 0) ?? 0;
  return "`".repeat(Math.max(3, longestRun + 1));
};

export const serializeDeckItemContent = (comment: string | null, body: string): string => {
  const trimmedBody = body.trim();
  if (!trimmedBody) return comment?.trim() ?? "";
  const fence = fenceForBody(trimmedBody);
  const payload = `${fence}\n${trimmedBody}\n${fence}`;
  const trimmedComment = comment?.trim();
  return trimmedComment ? `${trimmedComment}\n${payload}` : payload;
};
