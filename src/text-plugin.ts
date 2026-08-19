import { ACTION_ID, ACTION_LABEL, ACTION_SHORTCUT, PLUGIN_NAME } from "./constants.js";
import { getActiveEditSession, startEditSession } from "./edit-session.js";
import type {
  ReactGrabActionContext,
  ReactGrabApi,
  ReactGrabPlugin,
} from "./react-grab-types.js";
import type { EditSource, Position } from "./types.js";
import { isTextEditableElement } from "./utils/is-text-editable-element.js";
import {
  getLastPointerPosition,
  startPointerTracking,
} from "./utils/track-last-pointer-position.js";

const buildSourceFromContext = (context: ReactGrabActionContext): EditSource => ({
  filePath: context.filePath,
  lineNumber: context.lineNumber,
  componentName: context.componentName,
  tagName: context.tagName,
});

// Source fields on the action context are resolved asynchronously by react-grab
// and can still be undefined on a fast click, so the session re-resolves them
// while the user types.
const createResolveSource =
  (api: ReactGrabApi | null, element: Element, fallback: EditSource) =>
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

export const createTextPlugin = (): ReactGrabPlugin => {
  let reactGrabApi: ReactGrabApi | null = null;
  // react-grab swallows the selecting pointerdown before it can reach any
  // later-registered window listener, but its onDragStart hook reports that
  // pointerdown's page coordinates — the only reliable record of where the
  // user actually clicked the element.
  let selectionPagePoint: Position | null = null;

  const takeCaretPoint = (): Position | undefined => {
    if (selectionPagePoint) {
      const clientPoint = {
        x: selectionPagePoint.x - window.scrollX,
        y: selectionPagePoint.y - window.scrollY,
      };
      selectionPagePoint = null;
      return clientPoint;
    }
    return getLastPointerPosition() ?? undefined;
  };

  const handleTextAction = (context: ReactGrabActionContext): void => {
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
      caretPoint: takeCaretPoint(),
    });
  };

  return {
    name: PLUGIN_NAME,
    hooks: {
      onDragStart: (startX, startY) => {
        selectionPagePoint = { x: startX, y: startY };
      },
      // Covers react-grab being reactivated over a live session through paths
      // no pointerdown reaches (keyboard hold, programmatic activate).
      onStateChange: (state) => {
        if (state.isActive) void getActiveEditSession()?.commit();
      },
    },
    setup: (api) => {
      reactGrabApi = api;
      const stopPointerTracking = startPointerTracking();
      return {
        cleanup: () => {
          reactGrabApi = null;
          selectionPagePoint = null;
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
        enabled: (context) =>
          context.elements.length <= 1 && isTextEditableElement(context.element),
        onAction: handleTextAction,
      },
    ],
  };
};
