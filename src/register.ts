import type { ReactGrabApi } from "./react-grab-types.js";
import { createTextPlugin } from "./text-plugin.js";

const getReactGrabApi = (): ReactGrabApi | undefined =>
  (window as Window & { __REACT_GRAB__?: ReactGrabApi }).__REACT_GRAB__;

const tryRegister = (): boolean => {
  const api = getReactGrabApi();
  if (!api || typeof api.registerPlugin !== "function") return false;
  try {
    // registerPlugin re-throws PluginSetupError into this call frame.
    api.registerPlugin(createTextPlugin());
  } catch (error) {
    console.warn("[react-grab-text] Failed to register plugin:", error);
  }
  return true;
};

export const registerTextPlugin = (): void => {
  if (typeof window === "undefined") return;
  if (tryRegister()) return;
  const handleInit = (): void => {
    tryRegister();
  };
  window.addEventListener("react-grab:init", handleInit, { once: true });
};
