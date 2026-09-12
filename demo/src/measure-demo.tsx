import { createRoot } from "react-dom/client";
import { useState } from "react";
import { registerDeckPlugin, registerTextPlugin, registerMeasurePlugin } from "../../src/index.js";
import "./styles.css";
import "./measure-demo.css";

registerTextPlugin();
registerDeckPlugin();
registerMeasurePlugin();

const MeasureDemo = () => {
  const [clicks, setClicks] = useState(0);
  return (
    <main className="page measure-page">
      <header className="stack">
        <p className="meta">REACT GRAB / MEASURE</p>
        <h1>A little room to measure.</h1>
        <p>Choose the ruler in the palette. Hover to inspect, then click an element and hover another to compare.</p>
      </header>
      <section className="measure-pair" aria-label="Cards with a 32 pixel gap">
        <article className="measure-card" data-testid="measure-card-a">
          <span className="meta">24 px padding</span>
          <h2>Find the breathing room</h2>
          <p>Hover the card’s edges to see its box. Hover the text to inspect what’s inside.</p>
          <button type="button" data-testid="measure-cta" onClick={() => setClicks(value => value + 1)}>Try this button</button>
        </article>
        <article className="measure-card" data-testid="measure-card-b">
          <span className="meta">32 px between cards</span>
          <h2>Compare the neighbours</h2>
          <p>Anchor the left card, then hover this one. The distance should read 32 px.</p>
          <p className="meta" data-testid="measure-clicks">Button clicks: {clicks}</p>
        </article>
      </section>
      <section className="measure-nest" data-testid="measure-parent">
        <div className="measure-child" data-testid="measure-child">
          <h2>Measure inside a container</h2>
          <p>Anchor this panel, then hover the surrounding space. There’s 40 px on every side.</p>
        </div>
      </section>
      <footer className="meta">Escape clears the anchor. Escape again exits Measure. Text, comments, and the Deck are still in the palette.</footer>
    </main>
  );
};

const container = document.getElementById("root");
if (container) createRoot(container).render(<MeasureDemo />);
