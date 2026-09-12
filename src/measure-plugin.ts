import { createToolbarIconButton, applyIconColor } from "./deck-toolbar-button.js";
import { getActiveEditSession } from "./edit-session.js";
import { createMeasureOverlay } from "./measure-overlay.js";
import type { MeasureOverlay } from "./measure-overlay.js";
import type { ReactGrabPlugin } from "./react-grab-types.js";
import { syncToolbarSegment } from "./utils/sync-toolbar-segment.js";

const ATTACH_INTERVAL_MS = 500;
const FAILED_ATTACH_WARN_AT = 20;
const DRAG_THRESHOLD_PX = 5;
const TOOL_UI_SELECTOR = "[data-react-grab], [data-react-grab-ignore], [data-react-grab-ignore-events]";

const createRulerIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.style.pointerEvents = "none";
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", "M3 7h18v10H3z M7 7v5 M11 7v3 M15 7v5 M19 7v3");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
};

const isToolEvent = (event: Event): boolean => event.composedPath().some(
  node => node instanceof Element && node.matches(TOOL_UI_SELECTOR),
);

const elementAtPoint = (x: number, y: number): Element | null => {
  let element = document.elementFromPoint(x, y);
  while (element?.shadowRoot) {
    const nested = element.shadowRoot.elementFromPoint(x, y);
    if (!nested || nested === element) break;
    element = nested;
  }
  if (!element || element.closest(TOOL_UI_SELECTOR) || element === document.documentElement) return null;
  return element;
};

export const createMeasurePlugin = (): ReactGrabPlugin => {
  let stop = (): void => {};
  return {
    name: "measure",
    hooks: { onStateChange: state => { if (state.isActive) stop(); } },
    setup: api => {
      let overlay: MeasureOverlay | null = null;
      let anchor: Element | null = null;
      let pointer: { x: number; y: number } | null = null;
      let frame = 0;
      let press: { x: number; y: number; peak: number } | null = null;
      const icon = createRulerIcon();
      const { wrapper, button } = createToolbarIconButton("measure", "Measure", icon);
      button.removeAttribute("data-react-grab-deck-ui");
      button.setAttribute("data-react-grab-measure", "toggle");
      button.setAttribute("aria-pressed", "false");
      const layout = syncToolbarSegment(wrapper);

      stop = () => {
        cancelAnimationFrame(frame);
        overlay?.destroy();
        overlay = null;
        anchor = null;
        pointer = null;
        button.setAttribute("aria-pressed", "false");
        applyIconColor(icon, false);
      };
      const render = (): void => {
        if (!overlay) return;
        if (anchor && !anchor.isConnected) anchor = null;
        const target = pointer ? elementAtPoint(pointer.x, pointer.y) : null;
        overlay.render(target ?? anchor, anchor);
        frame = requestAnimationFrame(render);
      };
      button.addEventListener("click", event => {
        event.stopPropagation();
        if (press && press.peak > DRAG_THRESHOLD_PX) { press = null; return; }
        press = null;
        if (overlay) { stop(); return; }
        void getActiveEditSession()?.commit();
        api.deactivate();
        overlay = createMeasureOverlay(button);
        button.setAttribute("aria-pressed", "true");
        applyIconColor(icon, true);
        render();
      });
      const onMove = (event: PointerEvent): void => {
        if (press) press.peak = Math.max(press.peak, Math.hypot(event.clientX - press.x, event.clientY - press.y));
        if (!overlay) return;
        pointer = isToolEvent(event) ? null : { x: event.clientX, y: event.clientY };
      };
      const onDown = (event: PointerEvent): void => {
        if (event.composedPath().includes(button)) {
          press = { x: event.clientX, y: event.clientY, peak: 0 };
          return;
        }
        if (!overlay) return;
        if (isToolEvent(event)) { stop(); return; }
        event.preventDefault();
        event.stopPropagation();
      };
      const onClick = (event: MouseEvent): void => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.button !== 0) return;
        anchor = elementAtPoint(event.clientX, event.clientY);
        pointer = { x: event.clientX, y: event.clientY };
      };
      const onContextMenu = (event: MouseEvent): void => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
      };
      const onPointerUp = (event: PointerEvent): void => {
        if (!overlay || isToolEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
      };
      const onKey = (event: KeyboardEvent): void => {
        if (!overlay) return;
        if (event.code === "Escape" || event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          if (anchor) anchor = null;
          else stop();
        } else if (event.key === "Tab") stop();
      };
      const onLeave = (event: MouseEvent): void => { if (!event.relatedTarget) pointer = null; };
      const onCancel = (): void => { press = null; };
      window.addEventListener("pointermove", onMove, true);
      window.addEventListener("pointerdown", onDown, true);
      window.addEventListener("click", onClick, true);
      window.addEventListener("auxclick", onClick, true);
      window.addEventListener("dblclick", onClick, true);
      window.addEventListener("contextmenu", onContextMenu, true);
      window.addEventListener("pointerup", onPointerUp, true);
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("mouseout", onLeave);
      window.addEventListener("blur", onCancel);
      window.addEventListener("pointercancel", onCancel);

      let failedAttachAttempts = 0;
      const attach = (): void => {
        failedAttachAttempts += 1;
        if (failedAttachAttempts === FAILED_ATTACH_WARN_AT) {
          console.warn(
            "[react-grab-text] measure found no toolbar anchor after 10s — host toolbar markup may have changed",
          );
        }
        const root = document.querySelector("[data-react-grab]")?.shadowRoot;
        const actions = root?.querySelectorAll("[data-react-grab-toolbar-action]");
        const textAction = root?.querySelector('[data-react-grab-toolbar-action="text"]')
          ?? (actions?.length ? actions[actions.length - 1] : null);
        const anchorWrapper = textAction?.parentElement;
        if (anchorWrapper?.parentElement && wrapper.nextElementSibling !== anchorWrapper) {
          anchorWrapper.before(wrapper);
        }
        if (anchorWrapper) layout.attach(anchorWrapper);
        if (overlay && !wrapper.isConnected) stop();
        if (anchorWrapper) failedAttachAttempts = 0;
      };
      attach();
      const timer = window.setInterval(attach, ATTACH_INTERVAL_MS);
      return {
        cleanup: () => {
          stop();
          window.clearInterval(timer);
          layout.destroy();
          window.removeEventListener("pointermove", onMove, true);
          window.removeEventListener("pointerdown", onDown, true);
          window.removeEventListener("click", onClick, true);
          window.removeEventListener("auxclick", onClick, true);
          window.removeEventListener("dblclick", onClick, true);
          window.removeEventListener("contextmenu", onContextMenu, true);
          window.removeEventListener("pointerup", onPointerUp, true);
          window.removeEventListener("keydown", onKey, true);
          window.removeEventListener("mouseout", onLeave);
          window.removeEventListener("blur", onCancel);
          window.removeEventListener("pointercancel", onCancel);
          wrapper.remove();
          return undefined;
        },
      };
    },
  };
};
