// React Grab defines its design tokens on its shadow host, so UI mounted in the
// light DOM can't inherit them. Copying the resolved values onto our own root
// makes var(--rg-*) match the host's current theme (light or dark).
const REACT_GRAB_HOST_SELECTOR = "[data-react-grab]";

const TOKEN_NAMES = [
  "--rg-panel-bg",
  "--rg-text-primary",
  "--rg-text-primary-85",
  "--rg-text-secondary",
  "--rg-border-subtle",
  "--rg-border-button",
  "--rg-surface-hover",
  "--rg-surface-active",
  "--rg-submit-bg",
  "--rg-submit-fg",
  "--rg-shadow",
  "--rg-error-text",
] as const;

// Dark-theme values from react-grab, used when no host is mounted yet.
export const rg = {
  panelBg: "var(--rg-panel-bg, #161616)",
  text: "var(--rg-text-primary, #ffffff)",
  text85: "var(--rg-text-primary-85, #ffffffd9)",
  textMuted: "var(--rg-text-secondary, #a7a7a7)",
  borderSubtle: "var(--rg-border-subtle, #ffffff1a)",
  borderButton: "var(--rg-border-button, #ffffff33)",
  surfaceHover: "var(--rg-surface-hover, #ffffff1a)",
  surfaceActive: "var(--rg-surface-active, #ffffff26)",
  submitBg: "var(--rg-submit-bg, #ffffff)",
  submitFg: "var(--rg-submit-fg, #161616)",
  shadow: "var(--rg-shadow, 0 2px 8px #00000014)",
  errorText: "var(--rg-error-text, #f87171)",
  font: "Geist, ui-sans-serif, system-ui, sans-serif",
  easeDrawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const adoptReactGrabTheme = (element: HTMLElement): void => {
  const host = document.querySelector(REACT_GRAB_HOST_SELECTOR);
  if (!host) return;
  const computed = getComputedStyle(host);
  for (const name of TOKEN_NAMES) {
    const value = computed.getPropertyValue(name).trim();
    if (value) element.style.setProperty(name, value);
  }
};
