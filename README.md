# react-grab-text

Text, Deck, and Measure tools for [React Grab](https://github.com/aidenybai/react-grab). Click text in your running app, edit it in place, and copy a payload with source context for your coding agent. Collect grabs in a deck and copy them as one numbered block with separators. Use the ruler to read sizes, padding, margins, and gaps between elements.

React Grab's palette selects elements and copies context *about* them. This plugin lets you change the words and see your edits on the page. You can then give a coding agent the before/after with the component name and file location.

## How it works

1. Activate React Grab and run the **Text** action on an element. Use the context menu, press the `t` key while hovering, or set Text as the toolbar's default action.
2. Type your new copy in the element.
3. `Enter` saves, `Shift+Enter` inserts a line break, and `Esc` cancels and restores the original. Clicking elsewhere also saves.
4. Saving copies a payload to the clipboard in React Grab's native grammar:

```
Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.

[<h1 class="hero-title">Welcome back</h1> in HeroHeading (at src/components/Hero.tsx:8)]
BEFORE: "Welcome back"
AFTER: "Welcome home"
```

The edit stays on the page until you refresh, so you can read it in context. Paste the payload into your agent to make the change permanent.

## Deck

React Grab replaces the clipboard with each grab. If you're reviewing several changes, that means a separate paste for each request. In **batch mode**, the deck also queues every successful grab, including text edits, so you can copy them all as one structured block.

**Batch mode is on by default**, so the deck collects grabs from the start of a review. In **Single mode**, each grab goes only to the clipboard. The deck stays hidden while it's empty. Switch with the ◫ button in the toolbar.

1. Grab elements as usual and add comments where needed. Each grab still reaches the clipboard on its own, and the toolbar shows a count when the deck has items.
2. Click the count to copy all queued items as a numbered, `--`-separated block and empty the deck. If the clipboard write fails, the queue stays intact.
3. Click ▾ to open the deck panel. Edit items in place, remove one with ×, or clear all.
4. The panel footer has the batch-mode switch. When items are queued, the toolbar button copies them all, so use the panel to switch modes without emptying the deck. Single mode keeps the queue and stops new grabs from joining it.

````
1.
this label is misleading
```
[<button class="cta">Start</button> in Hero (at src/components/Hero.tsx:14)]
```
--
2.
```
[<h1 data-testid="headline">Welcome</h1> in Header (at src/components/Header.tsx:8)]
```
````

Single grabs are fenced too, with the payload in a code fence and the comment above it, so you can tell individual pastes apart in a longer prompt. The deck uses `sessionStorage` to survive reloads and navigation within the tab. It holds the most recent 50 grabs and starts empty in a new tab. Text edits queue alongside copy grabs in batch mode.

The plugin dispatches a `DeckCopyResult` (`{ itemCount, output, didCopy }`) as a `react-grab-deck:copy` CustomEvent on `window`. `react-grab-deck:change` fires on every queue change.

## Measure

Click the ruler in the React Grab toolbar to toggle Measure mode. Controls follow the palette on all four edges. The Measure hint and Deck panel open toward the page when the palette is docked on either side.

- Hover to see rendered dimensions, padding (green), margins (amber), and edge guides.
- Click to anchor an element, then hover another to see distances in CSS pixels. Overlapping boxes show corresponding edge offsets; containers show the insets on each side.
- Press Escape to clear the anchor; press it again to exit. Clicking the ruler again, switching to another Grab action, or tabbing also exits.

Measurements update as you scroll and resize. Measure intercepts page clicks and adds nothing to the clipboard or Deck. This implementation is independent of the VisBug extension and its source.

Run `npm run demo` and open `/measure.html` for a page with known 32 px and 40 px gaps. The script-tag build registers Measure automatically; module consumers call `registerMeasurePlugin()`.

Dimensions and distances come from viewport-aligned bounding rectangles. Rotated elements and multi-line inline elements use their enclosing rectangle. Padding and margin labels show computed CSS values in top/right/bottom/left order. Negative margins appear inside the border box with a hatched fill because they take space rather than reserve it. Collapsed margins still aren't a direct measure of the visible gap. The tool doesn't inspect closed shadow roots or iframe contents. Native top-layer dialogs may cover the overlay.

## Install

Add the script tag next to React Grab's own (dev only):

```html
<script src="https://unpkg.com/react-grab@0.2.0/dist/index.global.js"></script>
<script src="https://unpkg.com/react-grab-text@0.3.0/dist/global.global.js"></script>
```

Or use it as a module after React Grab has loaded:

```bash
npm install react-grab react-grab-text
```

```ts
import "react-grab";
import { registerDeckPlugin, registerMeasurePlugin, registerTextPlugin } from "react-grab-text";

registerTextPlugin();
registerDeckPlugin();
registerMeasurePlugin();
```

Register the plugins before or after React Grab initializes. They wait for its `react-grab:init` event if needed. The script-tag build registers all three tools; module consumers register each one separately.

## Compatibility

Tested against `react-grab@0.1.49` (the last release with the Style panel, run live in a Next.js app) and `react-grab@0.2.0` (e2e suite). On 0.1.49, the Text row appears in the element context menu alongside Copy / Style / Comment / Open. On 0.2.0, it also appears in the toolbar's action menu and can be set as the toolbar's default action. Next.js app-router file paths are decoded (`(routes)`, `[slug]`) so payload paths match the paths on disk.

The e2e suite also runs against [a fork of React Grab](vendor/README.md) with a toolbar button for each plugin action, including Text. The plugins work without the fork.

On 0.1.49, a persisted toolbar `defaultAction` isn't normalized. If `"text"` was stored by a 0.2.0 session on the same origin and the plugin is later absent, the stale id remains. Clear the `react-grab-toolbar-state` localStorage key if the toolbar misbehaves. 0.2.0 handles this automatically.

## Notes

- The action is available only on elements with visible text; form controls and media are excluded.
- The page stays live while you edit because React Grab's freeze is released. A component that re-renders its own text mid-edit can repaint it; the committed payload still uses what you typed.
- Editing replaces the element's text nodes, so React stops updating that element's text afterwards. Its fiber still points at the old nodes. This is fine for static strings; refresh to reattach live text like counters.
- For tooling, the plugin also dispatches an `EditResult` (`{ before, after, payload, didCopy }`) as a `react-grab-text:edit` CustomEvent on `window`.

## Develop

```
npm install
npm run build      # dist: ESM + CJS + IIFE global
npm run demo       # vite playground
npm test           # playwright e2e against npm's react-grab
REACT_GRAB_BUILD=fork npm test   # ...against the fork build in vendor/
```
