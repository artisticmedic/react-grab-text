// Filled toolbar icons from Heroicons v2 solid (MIT) — https://heroicons.com
// Matches react-grab's IconSelect / IconStyle (fill="currentColor", 24 viewBox).

const SVG_NS = "http://www.w3.org/2000/svg";

type FilledPath = {
  d: string;
  fillRule?: "evenodd";
  clipRule?: "evenodd";
};

const createToolbarIconSvg = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  svg.style.pointerEvents = "none";
  return svg;
};

const createFilledToolbarIcon = (paths: FilledPath | FilledPath[]): SVGSVGElement => {
  const svg = createToolbarIconSvg();

  for (const { d, fillRule, clipRule } of [paths].flat()) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    if (fillRule) path.setAttribute("fill-rule", fillRule);
    if (clipRule) path.setAttribute("clip-rule", clipRule);
    svg.append(path);
  }

  return svg;
};

// —— Stack / batch affordance — swap active export to compare ——

/** A: `rectangle-stack` — three offset cards. */
export const iconDeckStackLayers = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",
  });

/** B: `square-2-stack` — two overlapping squares, lighter silhouette. */
export const iconDeckStackTwo = (): SVGSVGElement =>
  createFilledToolbarIcon([
    {
      d: "M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z",
    },
    {
      d: "M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z",
    },
  ]);

export const iconBatchMode = iconDeckStackLayers;

// —— List / panel toggle — swap `iconDeckList` export to compare ——

const LIST_BULLET_Y = [6.75, 12, 17.25] as const;

/** A: Bullets — crisp circles + bars (custom, tuned for 14px). */
export const iconDeckListBullets = (): SVGSVGElement => {
  const svg = createToolbarIconSvg();

  for (const cy of LIST_BULLET_Y) {
    const bullet = document.createElementNS(SVG_NS, "circle");
    bullet.setAttribute("cx", "5");
    bullet.setAttribute("cy", String(cy));
    bullet.setAttribute("r", "1.125");
    svg.append(bullet);
  }

  for (const cy of LIST_BULLET_Y) {
    const line = document.createElementNS(SVG_NS, "rect");
    line.setAttribute("x", "8.25");
    line.setAttribute("y", String(cy - 0.75));
    line.setAttribute("width", "11.75");
    line.setAttribute("height", "1.5");
    line.setAttribute("rx", "0.75");
    svg.append(line);
  }

  return svg;
};

/** B: `queue-list` — round lead marker + full-width lines. */
export const iconDeckListQueue = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z",
  });

/** C: `clipboard-document-list` — checklist on a board (review panel). */
export const iconDeckListClipboard = (): SVGSVGElement =>
  createFilledToolbarIcon([
    {
      d: "M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z",
    },
    {
      d: "M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z",
    },
  ]);

/** D: `bars-3-bottom-left` — indented lines, lighter weight. */
export const iconDeckListBars = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z",
  });

/** E: `numbered-list` — 1 / 2 / 3 markers + lines. */
export const iconDeckListNumbered = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M7.491 5.992a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.49 11.995a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.491 17.994a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.24 3.745a.75.75 0 0 1 .75-.75h1.125a.75.75 0 0 1 .75.75v3h.375a.75.75 0 0 1 0 1.5H2.99a.75.75 0 0 1 0-1.5h.375v-2.25H2.99a.75.75 0 0 1-.75-.75ZM2.79 10.602a.75.75 0 0 1 0-1.06 1.875 1.875 0 1 1 2.652 2.651l-.55.55h.35a.75.75 0 0 1 0 1.5h-2.16a.75.75 0 0 1-.53-1.281l1.83-1.83a.375.375 0 0 0-.53-.53.75.75 0 0 1-1.062 0ZM2.24 15.745a.75.75 0 0 1 .75-.75h1.125a1.875 1.875 0 0 1 1.501 2.999 1.875 1.875 0 0 1-1.501 3H2.99a.75.75 0 0 1 0-1.501h1.125a.375.375 0 0 0 .036-.748H3.74a.75.75 0 0 1-.75-.75v-.002a.75.75 0 0 1 .75-.75h.411a.375.375 0 0 0-.036-.748H2.99a.75.75 0 0 1-.75-.75Z",
  });

/** @deprecated Use `iconDeckListQueue`. */
export const iconDeckListLines = iconDeckListQueue;

export const DECK_LIST_ICON_OPTIONS = {
  bullets: iconDeckListBullets,
  queue: iconDeckListQueue,
  clipboard: iconDeckListClipboard,
  bars: iconDeckListBars,
  numbered: iconDeckListNumbered,
} as const;

export type DeckListIconKey = keyof typeof DECK_LIST_ICON_OPTIONS;

/** Active list icon for the deck panel toggle. */
export const iconDeckList = iconDeckListQueue;

export const iconTrash = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",
  });

// Plain filled check — no circle (reverted from IconCheck).
export const iconDeckCheck = (): SVGSVGElement =>
  createFilledToolbarIcon({
    d: "M20.285 6.709a1 1 0 0 1 .006 1.414l-9.2 9.25a1 1 0 0 1-1.435.01L3.71 12.09a1 1 0 0 1 1.414-1.414l5.2 5.2 8.49-8.54a1 1 0 0 1 1.471.373z",
    fillRule: "evenodd",
    clipRule: "evenodd",
  });
