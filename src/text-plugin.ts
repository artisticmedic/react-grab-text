import {
  ACTION_ID,
  ACTION_LABEL,
  ACTION_SHORTCUT,
  PLUGIN_NAME,
  POINTER_POSITION_MAX_AGE_MS,
} from "./constants.js";
import {
  getActiveEditSession,
  installEditSessionGuards,
  startEditSession,
} from "./edit-session.js";
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
  // user actually clicked the element. It fires for every selection (plain
  // Copy grabs too), so the point expires like the tracker's does — a stale
  // point landing inside a later target would misplace the caret.
  let selectionPagePoint: (Position & { recordedAt: number }) | null = null;

  const takeCaretPoint = (): Position | undefined => {
    const point = selectionPagePoint;
    selectionPagePoint = null;
    if (point && Date.now() - point.recordedAt <= POINTER_POSITION_MAX_AGE_MS) {
      return {
        x: point.x - window.scrollX,
        y: point.y - window.scrollY,
      };
    }
    return getLastPointerPosition() ?? undefined;
  };

  const handleTextAction = (context: ReactGrabActionContext): void => {
    const { element } = context;
    if (!isTextEditableElement(element)) return;
    const fallbackSource = buildSourceFromContext(context);
    context.hideContextMenu();
    // The caret point must be taken BEFORE deactivate(): deactivation fires
    // onStateChange(isActive: false) synchronously, which clears the stored
    // selection point.
    const caretPoint = takeCaretPoint();
    // Full deactivation (not context.cleanup) releases the pointer-events and
    // React-update freezes in every activation mode, so the page is live to type
    // into. Focus must land on the element after this call — deactivation
    // synchronously refocuses the previously-focused page element.
    reactGrabApi?.deactivate();
    startEditSession({
      element,
      source: fallbackSource,
      resolveSource: createResolveSource(reactGrabApi, element, fallbackSource),
      caretPoint,
    });
  };

  return {
    name: PLUGIN_NAME,
    hooks: {
      onDragStart: (startX, startY) => {
        selectionPagePoint = { x: startX, y: startY, recordedAt: Date.now() };
      },
      // Covers react-grab being reactivated over a live session through paths
      // no pointerdown reaches (keyboard hold, programmatic activate). On
      // deactivation the selection point is cleared so it cannot outlive the
      // activation cycle that produced it.
      onStateChange: (state) => {
        if (state.isActive) {
          void getActiveEditSession()?.commit();
        } else {
          selectionPagePoint = null;
        }
      },
    },
    setup: (api) => {
      reactGrabApi = api;
      const stopPointerTracking = startPointerTracking();
      // Guards must register before the host app's hydration-time listeners so
      // keys typed inside an edit can be stopped from reaching app hotkeys.
      const uninstallGuards = installEditSessionGuards();
      return {
        cleanup: () => {
          // Unregister/dispose/Fast Refresh must not strand a live session as
          // a bare contenteditable with no handlers — commit it first.
          void getActiveEditSession()?.commit({ quiet: true });
          reactGrabApi = null;
          selectionPagePoint = null;
          stopPointerTracking();
          uninstallGuards();
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
