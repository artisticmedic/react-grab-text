import { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import { BatchIconDemo } from "./BatchIconDemo.js";
import { ProtoPicker } from "./ProtoPicker.js";
import "./proto.css";

const VARIANTS = [
  {
    id: "face",
    label: "Face",
    variant: "face" as const,
    motion: "peel" as const,
    axis: "Front stack card — layers peel out behind it (plate = same here)",
  },
  {
    id: "lip",
    label: "Lip",
    variant: "lip" as const,
    motion: "peel" as const,
    axis: "Front card + ghost sheet peeking above",
  },
  {
    id: "tile-peel",
    label: "Tile",
    variant: "tile" as const,
    motion: "peel" as const,
    axis: "Square stack tile yields to full stack",
  },
] as const;

const readVariantIndex = (): number => {
  const fromUrl = Number.parseInt(new URLSearchParams(window.location.search).get("v") ?? "1", 10);
  const index = Number.isFinite(fromUrl) ? fromUrl - 1 : 0;
  return Math.min(Math.max(index, 0), VARIANTS.length - 1);
};

const Harness = () => {
  const [variantIndex, setVariantIndex] = useState(readVariantIndex);
  const [mountKey, setMountKey] = useState(0);

  const setVariant = useCallback((index: number) => {
    if (index < 0 || index >= VARIANTS.length) return;
    setVariantIndex(index);
    setMountKey((value) => value + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(index + 1));
    window.history.replaceState(null, "", url);
  }, []);

  const active = VARIANTS[variantIndex];

  return (
    <>
      <main className="proto-deck-batch-page">
        <header className="proto-deck-batch-header">
          <h1>Deck batch icon — card shapes</h1>
          <p>
            <strong>{active.label}</strong> — {active.axis}. Face and Face·Peel were identical: when
            the off state is the front card, it never moves — plate and peel collapse to the same
            motion.
          </p>
        </header>
        <div key={`${active.id}-${mountKey}`} className="proto-deck-batch-mount">
          <BatchIconDemo variant={active.variant} motion={active.motion} />
        </div>
        <table className="proto-deck-batch-table">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Off-state</th>
              <th>When it wins</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Face ✓ shipped</td>
              <td>Front stack card</td>
              <td>Zero shape jump — literal “one card in the deck”</td>
              <td>None meaningful — this is the pick</td>
            </tr>
            <tr>
              <td>Lip</td>
              <td>Front + ghost mid slab</td>
              <td>Hints batching before hover</td>
              <td>Slightly busier at rest</td>
            </tr>
            <tr>
              <td>Tile</td>
              <td>Square stack tile</td>
              <td>Square footprint with stack corners</td>
              <td>Shape swap when stack opens</td>
            </tr>
          </tbody>
        </table>
      </main>
      <ProtoPicker
        variants={VARIANTS.map(({ id, label }) => ({ id, label }))}
        current={variantIndex}
        onChange={setVariant}
        onReplay={() => setMountKey((value) => value + 1)}
      />
    </>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error("Prototype root missing");

createRoot(container).render(<Harness />);
