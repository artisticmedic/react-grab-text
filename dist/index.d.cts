interface ReactGrabSourceInfo {
    filePath: string;
    lineNumber: number | null;
    columnNumber: number | null;
    componentName: string | null;
}
interface ReactGrabState {
    isActive: boolean;
}
interface ReactGrabActionContext {
    element: Element;
    elements: Element[];
    filePath?: string;
    lineNumber?: number;
    componentName?: string;
    tagName?: string;
    hideContextMenu: () => void;
    cleanup: () => void;
}
interface ReactGrabContextMenuAction {
    id: string;
    label: string;
    shortcut?: string;
    shortcutModifier?: boolean;
    showInToolbarMenu?: boolean;
    enabled?: boolean | ((context: ReactGrabActionContext) => boolean);
    onAction: (context: ReactGrabActionContext) => void | Promise<void>;
}
interface ReactGrabPluginHooks {
    onDragStart?: (startX: number, startY: number) => void | Promise<void>;
    onStateChange?: (state: ReactGrabState) => void | Promise<void>;
    transformCopyContent?: (content: string, elements: Element[]) => string | Promise<string>;
    onCopySuccess?: (elements: Element[], content: string) => void | Promise<void>;
}
interface ReactGrabPluginConfig {
    actions?: ReactGrabContextMenuAction[];
    hooks?: ReactGrabPluginHooks;
    cleanup?: () => undefined;
}
interface ReactGrabApi {
    deactivate: () => void;
    registerPlugin: (plugin: ReactGrabPlugin) => void;
    unregisterPlugin: (name: string) => void;
    getSource: (element: Element) => Promise<ReactGrabSourceInfo | null>;
    getDisplayName: (element: Element) => string | null;
}
interface ReactGrabPlugin {
    name: string;
    actions?: ReactGrabContextMenuAction[];
    hooks?: ReactGrabPluginHooks;
    setup?: (api: ReactGrabApi) => ReactGrabPluginConfig | void;
}

declare const createTextPlugin: () => ReactGrabPlugin;

declare const registerTextPlugin: () => void;
declare const registerDeckPlugin: () => void;

interface Position {
    x: number;
    y: number;
}
interface EditSource {
    filePath?: string;
    lineNumber?: number;
    componentName?: string;
    tagName?: string;
}
interface EditResult {
    before: string;
    after: string;
    payload: string;
    didCopy: boolean;
}
interface EditSessionOptions {
    element: HTMLElement;
    source: EditSource;
    resolveSource?: () => Promise<EditSource>;
    caretPoint?: Position;
    onFinish?: (result: EditResult | null) => void;
}
declare global {
    interface WindowEventMap {
        "react-grab-text:edit": CustomEvent<EditResult>;
    }
}
interface EditSessionHandle {
    commit: (options?: {
        quiet?: boolean;
    }) => Promise<EditResult | null>;
    cancel: () => void;
    isActive: () => boolean;
}

declare const getActiveEditSession: () => EditSessionHandle | null;
declare const startEditSession: (options: EditSessionOptions) => EditSessionHandle;

interface BuildEditPayloadOptions {
    source: EditSource;
    elementPreview: string;
    before: string;
    after: string;
    textTransform?: string;
    preserveWhitespace?: boolean;
}
declare const buildEditPayload: ({ source, elementPreview, before, after, textTransform, preserveWhitespace, }: BuildEditPayloadOptions) => string;

interface DeckItem {
    id: string;
    content: string;
}
interface DeckCopyResult {
    itemCount: number;
    output: string;
    didCopy: boolean;
}
declare global {
    interface WindowEventMap {
        "react-grab-deck:change": CustomEvent<{
            items: DeckItem[];
        }>;
        "react-grab-deck:copy": CustomEvent<DeckCopyResult>;
    }
}
type DeckListener = (items: DeckItem[]) => void;
declare const getDeckItems: () => DeckItem[];
declare const addDeckItem: (content: string) => DeckItem | null;
declare const removeDeckItems: (ids: readonly string[]) => void;
declare const clearDeck: () => void;
declare const subscribeDeck: (listener: DeckListener) => (() => void);

declare const copyDeckToClipboard: () => Promise<DeckCopyResult>;
declare const createDeckPlugin: () => ReactGrabPlugin;

type DeckMode = "single" | "batch";
type DeckModeListener = (mode: DeckMode) => void;
declare const getDeckMode: () => DeckMode;
declare const isBatchMode: () => boolean;
declare const setDeckMode: (next: DeckMode) => void;
declare const toggleDeckMode: () => DeckMode;
declare const subscribeDeckMode: (listener: DeckModeListener) => (() => void);

declare const queueDeckItemIfBatch: (content: string) => DeckItem | null;

declare const formatDeck: (items: readonly DeckItem[]) => string;

export { type DeckCopyResult, type DeckItem, type DeckMode, type EditResult, type EditSessionHandle, type EditSessionOptions, type EditSource, type Position, type ReactGrabActionContext, type ReactGrabApi, type ReactGrabPlugin, addDeckItem, buildEditPayload, clearDeck, copyDeckToClipboard, createDeckPlugin, createTextPlugin, formatDeck, getActiveEditSession, getDeckItems, getDeckMode, isBatchMode, queueDeckItemIfBatch, registerDeckPlugin, registerTextPlugin, removeDeckItems, setDeckMode, startEditSession, subscribeDeck, subscribeDeckMode, toggleDeckMode };
