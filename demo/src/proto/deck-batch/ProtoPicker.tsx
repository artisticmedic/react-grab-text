import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type ProtoVariant = {
  id: string;
  label: string;
};

export const ProtoPicker = ({
  variants,
  current,
  onChange,
  onReplay,
}: {
  variants: ProtoVariant[];
  current: number;
  onChange: (index: number) => void;
  onReplay: () => void;
}) => {
  const pickerRef = useRef<HTMLElement>(null);

  const moveHighlight = useCallback(() => {
    const picker = pickerRef.current;
    if (!picker) return;
    const highlight = picker.querySelector<HTMLElement>(".proto-picker-highlight");
    const item = picker.querySelectorAll<HTMLElement>(".proto-picker-item:not(.proto-picker-replay)")[current];
    if (!highlight || !item) return;
    highlight.style.width = `${item.offsetWidth}px`;
    highlight.style.transform = `translateX(${item.offsetLeft}px)`;
  }, [current]);

  useLayoutEffect(() => {
    moveHighlight();
    const picker = pickerRef.current;
    if (!picker?.hasAttribute("data-ready")) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", ""));
      });
    }
  }, [current, moveHighlight]);

  useEffect(() => {
    window.addEventListener("resize", moveHighlight);
    return () => window.removeEventListener("resize", moveHighlight);
  }, [moveHighlight]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const num = Number.parseInt(event.key, 10);
      if (num >= 1 && num <= variants.length) onChange(num - 1);
      else if (event.key === "ArrowRight") onChange((current + 1) % variants.length);
      else if (event.key === "ArrowLeft") onChange((current - 1 + variants.length) % variants.length);
      else if (event.key === "r" || event.key === "R") onReplay();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [current, onChange, onReplay, variants.length]);

  return (
    <nav ref={pickerRef} className="proto-picker" aria-label="Prototype variants">
      <span className="proto-picker-highlight" aria-hidden="true" />
      {variants.map((variant, index) => (
        <button
          key={variant.id}
          type="button"
          className="proto-picker-item"
          data-active={index === current ? "" : undefined}
          aria-current={index === current ? "true" : undefined}
          onClick={() => onChange(index)}
        >
          {variant.label}
        </button>
      ))}
      <span className="proto-picker-divider" aria-hidden="true" />
      <button
        type="button"
        className="proto-picker-item proto-picker-replay"
        aria-label="Replay animation (R)"
        onClick={onReplay}
      >
        ↻
      </button>
    </nav>
  );
};
