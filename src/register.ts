import type { ReactGrabAPI } from "react-grab";
import { createTextPlugin } from "./text-plugin.js";

declare global {
  interface Window {
    __REACT_GRAB__?: ReactGrabAPI;
  }
}

const tryRegister = (): boolean => {
  const api = window.__REACT_GRAB__;
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
