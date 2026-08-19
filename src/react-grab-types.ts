// Minimal structural mirror of react-grab@0.2.0's public plugin surface,
// vendored so the published d.ts carries no import from "react-grab" (an
// optional peer that script-tag consumers never install). Shapes must stay
// assignment-compatible with the real types.

export interface ReactGrabSourceInfo {
  filePath: string;
  lineNumber: number | null;
  columnNumber: number | null;
  componentName: string | null;
}

export interface ReactGrabState {
  isActive: boolean;
}

export interface ReactGrabActionContext {
  element: Element;
  elements: Element[];
  filePath?: string;
  lineNumber?: number;
  componentName?: string;
  tagName?: string;
  hideContextMenu: () => void;
  cleanup: () => void;
}

export interface ReactGrabContextMenuAction {
  id: string;
  label: string;
  shortcut?: string;
  shortcutModifier?: boolean;
  showInToolbarMenu?: boolean;
  enabled?: boolean | ((context: ReactGrabActionContext) => boolean);
  onAction: (context: ReactGrabActionContext) => void | Promise<void>;
}

export interface ReactGrabPluginHooks {
  onDragStart?: (startX: number, startY: number) => void | Promise<void>;
  onStateChange?: (state: ReactGrabState) => void | Promise<void>;
}

export interface ReactGrabPluginConfig {
  actions?: ReactGrabContextMenuAction[];
  hooks?: ReactGrabPluginHooks;
  cleanup?: () => undefined;
}

export interface ReactGrabApi {
  deactivate: () => void;
  registerPlugin: (plugin: ReactGrabPlugin) => void;
  unregisterPlugin: (name: string) => void;
  getSource: (element: Element) => Promise<ReactGrabSourceInfo | null>;
  getDisplayName: (element: Element) => string | null;
}

export interface ReactGrabPlugin {
  name: string;
  actions?: ReactGrabContextMenuAction[];
  hooks?: ReactGrabPluginHooks;
  // The real setup also receives a second ActionContextHooks argument
  // (transformHtmlContent / onOpenFile / transformOpenFileUrl), not modeled
  // here — this mirror covers only the surface this plugin uses.
  setup?: (api: ReactGrabApi) => ReactGrabPluginConfig | void;
}
