// The e2e suite drives the real react-grab bundle through its window global,
// which reaches further than src/react-grab-types.ts — that mirror models only
// the surface this plugin consumes. Declared here rather than inherited from
// the npm package's own augmentation: the demo loads the fork from vendor/, so
// nothing in the program imports "react-grab" to pull those types in.
interface ReactGrabTestApi {
  activate: () => void;
  deactivate: () => void;
  isActive: () => boolean;
  getPlugins: () => string[];
  getState: () => { targetElement: Element | null };
  copyElement: (element: Element) => Promise<boolean>;
}

interface Window {
  __REACT_GRAB__?: ReactGrabTestApi;
}
