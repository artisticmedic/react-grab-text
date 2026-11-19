# vendor/react-grab.global.js

A build of [`artisticmedic/react-grab`](https://github.com/artisticmedic/react-grab),
a fork of [`aidenybai/react-grab`](https://github.com/aidenybai/react-grab).

| | |
|---|---|
| Branch | `flightcast/toolbar-plugin-actions` |
| Commit | `8d25f7b3` |
| Base | `react-grab@0.1.49` |
| Built with | `pnpm --filter react-grab build` → `packages/react-grab/dist/index.global.js` |

## What the fork changes

This is the React Grab the plugins are designed for, and the demo and e2e
suite use it by default. Text, Deck, and Measure also run on npm's
`react-grab@0.2.0` (`REACT_GRAB_BUILD=stock`). The fork changes the palette
toolbar:

- **A button per registered plugin action**, so Text gets its own toolbar
  button. On npm's react-grab, Text is reachable from the context menu, the
  `t` key, or the toolbar's default action.
- **Comment as the primary toolbar action** in place of Copy.
- **The Style pill**, dropped from the palette in 0.2.0, with arrow keys that
  step a value along the design-token scale.

## Why it is committed

CI runs the suite against this build and again against npm's
(`REACT_GRAB_BUILD=stock npm test`) so the toolbar attachment keeps working on
both palettes. Rebuild by checking out the commit above and copying
`packages/react-grab/dist/index.global.js` over this file.

Upstream is MIT; so is this.
