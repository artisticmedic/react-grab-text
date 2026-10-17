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

The plugins don't need it. Text, Deck, and Measure run on npm's
`react-grab@0.2.0`, and the demo and e2e suite use that by default. The fork
changes the palette toolbar:

- **A button per registered plugin action**, so Text gets its own toolbar
  button. On npm's react-grab, Text is reachable from the context menu, the
  `t` key, or the toolbar's default action.
- **Comment as the primary toolbar action** in place of Copy.
- **The Style pill**, dropped from the palette in 0.2.0, with arrow keys that
  step a value along the design-token scale.

## Why it is committed

CI runs the suite a second time against this build
(`REACT_GRAB_BUILD=fork npm test`) so the toolbar attachment keeps working on
both palettes. Rebuild by checking out the commit above and copying
`packages/react-grab/dist/index.global.js` over this file.

Upstream is MIT; so is this.
