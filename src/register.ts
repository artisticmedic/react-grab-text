import { createDeckPlugin } from "./deck-plugin.js";
import type { ReactGrabApi, ReactGrabPlugin } from "./react-grab-types.js";
import { createTextPlugin } from "./text-plugin.js";

const getReactGrabApi = (): ReactGrabApi | undefined =>
  (window as Window & { __REACT_GRAB__?: ReactGrabApi }).__REACT_GRAB__;

const tryRegister = (createPlugin: () => ReactGrabPlugin): boolean => {
  const api = getReactGrabApi();
  if (!api || typeof api.registerPlugin !== "function") return false;
  try {
    // registerPlugin re-throws PluginSetupError into this call frame.
    api.registerPlugin(createPlugin());
  } catch (error) {
    // Loud on purpose: a setup() throw here means the plugin silently never
    // exists for the whole page load.
    console.error("[react-grab-text] Failed to register plugin:", error);
  }
  return true;
};

const registerWhenReady = (createPlugin: () => ReactGrabPlugin): void => {
  if (typeof window === "undefined") return;
  if (tryRegister(createPlugin)) return;
  const handleInit = (): void => {
    tryRegister(createPlugin);
  };
  window.addEventListener("react-grab:init", handleInit, { once: true });
};

export const registerTextPlugin = (): void => {
  registerWhenReady(createTextPlugin);
};

export const registerDeckPlugin = (): void => {
  registerWhenReady(createDeckPlugin);
};
