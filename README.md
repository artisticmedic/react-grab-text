# react-grab-text

Text tool for [React Grab](https://github.com/aidenybai/react-grab). Click text on your running app, edit it inline, and copy the edit out as an agent-ready payload with source context.

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

## Install

Script tag, next to React Grab's own (dev only):

```html
<script src="https://unpkg.com/react-grab@0.2.0/dist/index.global.js"></script>
<script src="https://unpkg.com/react-grab-text/dist/global.global.js"></script>
```

Or as a module, after React Grab is loaded:

```ts
import "react-grab";
import { registerTextPlugin } from "react-grab-text";

registerTextPlugin();
```

Registration is race-free in both directions: if React Grab isn't initialized yet, the plugin waits for its `react-grab:init` event.

## Compatibility

Verified against `react-grab@0.1.49` (the last release with the Style panel; live-tested inside a Next.js app) and `react-grab@0.2.0` (e2e suite). On 0.1.49 the Text row appears in the element context menu alongside Copy / Style / Comment / Open; on 0.2.0 it also appears in the toolbar's action menu and can be set as the toolbar's default action. Next.js app-router file paths are decoded (`(routes)`, `[slug]`) so payload paths exist on disk as written.

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
