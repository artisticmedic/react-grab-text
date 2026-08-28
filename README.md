# react-grab-text

Text and Deck tools for [React Grab](https://github.com/aidenybai/react-grab). Click text on your running app, edit it inline, and copy the edit out as an agent-ready payload with source context. Grabs accumulate in a deck that copies out as one numbered, separated block.

React Grab's palette selects elements and copies context *about* them. This plugin adds the missing copyediting move: change the words in place, see the edit live on the page, and hand the before/after — with component name and file location — straight to a coding agent.

## How it works

1. Activate React Grab and run the **Text** action on an element (context menu, the `t` key while hovering, or set Text as the toolbar's default action).
2. The element itself becomes editable in place. Type the new copy.
3. `Enter` saves; `Shift+Enter` inserts a line break; `Esc` cancels and restores the original; clicking elsewhere saves.
4. On save, the clipboard gets a payload in React Grab's native grammar:

```
Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.

[<h1 class="hero-title">Welcome back</h1> in HeroHeading (at src/components/Hero.tsx:8)]
BEFORE: "Welcome back"
AFTER: "Welcome home"
```

The edit stays applied on the page so you can read it in context; a refresh resets it. Paste the payload into your agent to make it permanent.

## Deck

React Grab's native flow replaces the clipboard on every grab, so a review pass with several requests means one paste per request. The deck removes that constraint in **batch mode**: every successful grab (copy or text edit) also lands in a queue, and one action copies the whole queue as a single structured block.

**Single mode** (default) sends each grab to the clipboard only — the deck stays empty and invisible. Toggle **batch mode** with the ◫ button next to the Text action when you want to accumulate grabs for a review pass.

1. Turn batch mode on; grab elements as usual and add comments where wanted. Each grab still reaches the clipboard individually — a count appears in the toolbar (hidden in single mode and while the deck is empty).
2. Click the count to copy every queued item as a numbered, `--`-separated block and flush the deck. A failed clipboard write keeps the queue intact.
3. Click ▾ to open the deck panel, edit items in place, remove individual items with ×, or clear all.
4. The panel footer holds the batch-mode switch. The toolbar affordance becomes copy-all once anything is queued, so the panel is where you turn batch mode off without first emptying the deck. Switching to single mode keeps the queue — it only stops new grabs joining it.

```
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
```

Single grabs are fenced too (the payload wrapped in a code fence, the comment above it), so individual pastes stay distinguishable inside a longer prompt. The deck persists in `sessionStorage`: it survives reloads and navigation within the tab, holds the most recent 50 grabs, and starts empty in a new tab. Text edits queue in batch mode alongside copy grabs.

A `DeckCopyResult` (`{ itemCount, output, didCopy }`) is dispatched as a `react-grab-deck:copy` CustomEvent on `window`; `react-grab-deck:change` fires on every queue mutation.

## Install

Script tag, next to React Grab's own (dev only):

```html
<script src="https://unpkg.com/react-grab@0.2.0/dist/index.global.js"></script>
<script src="https://unpkg.com/react-grab-text/dist/global.global.js"></script>
```

Or as a module, after React Grab is loaded:

```ts
import "react-grab";
import { registerDeckPlugin, registerTextPlugin } from "react-grab-text";

registerTextPlugin();
registerDeckPlugin();
```

Registration is race-free in both directions: if React Grab isn't initialized yet, the plugins wait for its `react-grab:init` event. The script-tag build registers both tools; module consumers register each independently.

## Compatibility

Verified against `react-grab@0.1.49` (the last release with the Style panel; live-tested inside a Next.js app) and `react-grab@0.2.0` (e2e suite). On 0.1.49 the Text row appears in the element context menu alongside Copy / Style / Comment / Open; on 0.2.0 it also appears in the toolbar's action menu and can be set as the toolbar's default action. Next.js app-router file paths are decoded (`(routes)`, `[slug]`) so payload paths exist on disk as written.

One 0.1.49 caveat: it never normalizes a persisted toolbar `defaultAction`, so if `"text"` was stored (by a 0.2.0 session on the same origin) and the plugin is later absent, the stale id sticks — clear the `react-grab-toolbar-state` localStorage key if the toolbar misbehaves. 0.2.0 self-heals this.

## Notes

- The action only enables on elements with visible text; form controls and media are excluded.
- The page is live while you edit (React Grab's freeze is released), so a component that re-renders its own text mid-edit can repaint it; the committed payload is still built from what you typed.
- Editing replaces the element's text nodes, so React stops updating that element's text afterwards (its fiber points at the old nodes). Fine for copyediting static strings; refresh to reattach live text like counters.
- An `EditResult` (`{ before, after, payload, didCopy }`) is also dispatched as a `react-grab-text:edit` CustomEvent on `window` for tooling.

## Develop

```
npm install
npm run build      # dist: ESM + CJS + IIFE global
npm run demo       # vite playground
npm test           # playwright e2e
```
