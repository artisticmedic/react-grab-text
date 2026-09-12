export interface ToolbarSegmentLayout {
  attach: (anchor: Element) => void;
  destroy: () => void;
}

export const syncToolbarSegment = (segment: HTMLElement): ToolbarSegmentLayout => {
  let currentAnchor: Element | null = null;
  let currentParent: Element | null = null;
  const sync = (): void => {
    if (!currentAnchor || !currentParent) return;
    const anchorStyle = getComputedStyle(currentAnchor);
    segment.style.flexDirection = getComputedStyle(currentParent).flexDirection;
    segment.style.marginRight = anchorStyle.marginRight;
    segment.style.marginBottom = anchorStyle.marginBottom;
  };
  const observer = new MutationObserver(sync);
  return {
    attach: anchor => {
      if (anchor === currentAnchor && anchor.parentElement === currentParent) return;
      observer.disconnect();
      currentAnchor = anchor;
      currentParent = anchor.parentElement;
      observer.observe(anchor, { attributes: true, attributeFilter: ["class", "style"] });
      if (currentParent) observer.observe(currentParent, { attributes: true, attributeFilter: ["class", "style"] });
      sync();
    },
    destroy: () => observer.disconnect(),
  };
};
