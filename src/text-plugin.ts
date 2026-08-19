import type { ContextMenuActionContext, Plugin, ReactGrabAPI } from "react-grab";
import { ACTION_ID, ACTION_LABEL, ACTION_SHORTCUT, PLUGIN_NAME } from "./constants.js";
import { startEditSession } from "./edit-session.js";
import type { EditSource } from "./types.js";
import { isTextEditableElement } from "./utils/is-text-editable-element.js";
import {
  getLastPointerPosition,
  startPointerTracking,
} from "./utils/track-last-pointer-position.js";

const buildSourceFromContext = (context: ContextMenuActionContext): EditSource => ({
  filePath: context.filePath,
  lineNumber: context.lineNumber,
  componentName: context.componentName,
  tagName: context.tagName,
});

// Source fields on ActionContext are resolved asynchronously by react-grab and
// can still be undefined on a fast click, so the session re-resolves them while
// the user types.
const createResolveSource =
  (api: ReactGrabAPI | null, element: Element, fallback: EditSource) =>
  async (): Promise<EditSource> => {
    if (!api || (fallback.filePath && fallback.componentName)) return fallback;
    const sourceInfo = await api.getSource(element).catch(() => null);
    return {
      filePath: fallback.filePath ?? sourceInfo?.filePath,
      lineNumber: fallback.lineNumber ?? sourceInfo?.lineNumber ?? undefined,
      componentName:
        fallback.componentName ??
        sourceInfo?.componentName ??
        api.getDisplayName(element) ??
        undefined,
      tagName: fallback.tagName,
    };
  };

export const createTextPlugin = (): Plugin => {
  let reactGrabApi: ReactGrabAPI | null = null;

  const handleTextAction = (context: ContextMenuActionContext): void => {
    const { element } = context;
    if (!isTextEditableElement(element)) return;
    const fallbackSource = buildSourceFromContext(context);
    context.hideContextMenu();
    // Full deactivation (not context.cleanup) releases the pointer-events and
    // React-update freezes in every activation mode, so the page is live to type
    // into. Focus must land on the element after this call — deactivation
    // synchronously refocuses the previously-focused page element.
    reactGrabApi?.deactivate();
    startEditSession({
      element,
      source: fallbackSource,
      resolveSource: createResolveSource(reactGrabApi, element, fallbackSource),
      caretPoint: getLastPointerPosition() ?? undefined,
    });
  };

  return {
    name: PLUGIN_NAME,
    setup: (api) => {
      reactGrabApi = api;
      const stopPointerTracking = startPointerTracking();
      return {
        cleanup: () => {
          reactGrabApi = null;
          stopPointerTracking();
          return undefined;
        },
      };
    },
    actions: [
      {
        id: ACTION_ID,
        label: ACTION_LABEL,
        shortcut: ACTION_SHORTCUT,
        shortcutModifier: false,
        showInToolbarMenu: true,
        enabled: (context) => isTextEditableElement(context.element),
        onAction: handleTextAction,
      },
    ],
  };
};
