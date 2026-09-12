export const getToolbarEdge = (control: Element): "left" | "right" | "top" | "bottom" => {
  const panel = control.closest("[data-react-grab-toolbar-panel]");
  if (!panel) return "bottom";
  const bounds = panel.getBoundingClientRect();
  const isVertical = getComputedStyle(panel).flexDirection === "column";
  if (isVertical) return bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "left" : "right";
  return bounds.top + bounds.height / 2 < window.innerHeight / 2 ? "top" : "bottom";
};
