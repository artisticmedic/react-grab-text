export const caretRangeFromPoint = (x: number, y: number): Range | null => {
  if (typeof document.caretPositionFromPoint === "function") {
    const caretPosition = document.caretPositionFromPoint(x, y);
    if (!caretPosition) return null;
    try {
      const range = document.createRange();
      range.setStart(caretPosition.offsetNode, caretPosition.offset);
      range.collapse(true);
      return range;
    } catch {
      return null;
    }
  }
  if (typeof document.caretRangeFromPoint === "function") {
    return document.caretRangeFromPoint(x, y);
  }
  return null;
};
