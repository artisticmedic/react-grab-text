import { useState } from "react";
import { HotkeyTripwire } from "./hotkey-tripwire.js";
import { TickCounter } from "./tick-counter.js";

const RELEASE_NOTES = `Recording now keeps a local backup.
Transcripts finish about twice as fast.
Chapter markers survive a re-upload.`;

export const App = () => {
  const [daysUntilRenewal] = useState(12);

  return (
    <main className="page">
      <header className="stack">
        <h1 data-testid="headline">Ship better copy without a handoff</h1>
        <p data-testid="tagline">Edit the words where they live.</p>
      </header>

      <p className="meta" data-testid="usage-hint">
        Pick Text in the React Grab toolbar, click any sentence, then press Enter to copy the edit.
      </p>

      <section className="stack">
        <p data-testid="intro">
          Every string on this page is <b data-testid="intro-strong">editable in place</b>, so you
          can fix the wording where you first read it and hand the exact change to whoever writes
          the code. Nothing here is a mock: the paragraph you are reading is the paragraph the
          plugin rewrites.
        </p>
        <p data-testid="intro-secondary">
          The second paragraph exists so an edit has a neighbour to leave alone. Rewriting one block
          must not disturb the one under it.
        </p>
        <button type="button" data-testid="cta">
          Start free trial
        </button>
      </section>

      <section className="stack">
        <h2 data-testid="notes-heading">What changed this week</h2>
        <div className="release-notes" data-testid="release-notes">
          {RELEASE_NOTES}
        </div>
      </section>

      <section className="stack">
        <h2 data-testid="features-heading">What you get</h2>
        <ul data-testid="feature-list">
          <li data-testid="feature-recording">Studio-quality recording in the browser</li>
          <li data-testid="feature-transcripts">Transcripts you can search and quote</li>
          <li data-testid="feature-clips">Clips sized for every social channel</li>
        </ul>
      </section>

      <section className="stack">
        {/* Rendered uppercase by CSS: innerText reads back shouted, while the
            source string is sentence case. */}
        <p className="shout" data-testid="shout">
          Limited time offer
        </p>
        <p data-testid="renewal">Plan renews in {daysUntilRenewal} days</p>
        <TickCounter />
        <HotkeyTripwire />
      </section>

      <div className="decorative" data-testid="decorative" />

      <section className="stack signup" data-testid="signup">
        <h2 data-testid="signup-heading">Get the changelog</h2>
        <label className="field" data-testid="signup-field">
          Work email
          <input type="email" data-testid="email-input" placeholder="you@studio.fm" />
        </label>
      </section>

      <div className="outside-area" data-testid="outside-area" />
    </main>
  );
};
