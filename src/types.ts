export interface Position {
  x: number;
  y: number;
}

export interface EditSource {
  filePath?: string;
  lineNumber?: number;
  componentName?: string;
  tagName?: string;
}

export interface EditResult {
  before: string;
  after: string;
  payload: string;
  didCopy: boolean;
}

export interface EditSessionOptions {
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

export interface EditSessionHandle {
  commit: (options?: { quiet?: boolean }) => Promise<EditResult | null>;
  cancel: () => void;
  isActive: () => boolean;
}
