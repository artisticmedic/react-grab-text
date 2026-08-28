# vendor/react-grab.global.js

A build of [`artisticmedic/react-grab`](https://github.com/artisticmedic/react-grab),
a fork of [`aidenybai/react-grab`](https://github.com/aidenybai/react-grab).

| | |
|---|---|
| Branch | `flightcast/toolbar-plugin-actions` |
| Commit | `adb8c48` |
| Base | `react-grab@0.1.49` |
| Built with | `pnpm --filter react-grab build` → `packages/react-grab/dist/index.global.js` |

## Why it is committed rather than installed

The demo and the e2e suite need two things the published `react-grab@0.2.0`
does not have:

- **A toolbar button per registered plugin action.** The Deck attaches its
  controls next to the Text action by querying `[data-react-grab-toolbar-action]`
  inside react-grab's shadow root. Without the fork there is no anchor and the
  Deck never mounts.
- **The Style pill.** Dropped from the palette toolbar in 0.2.0.

Reading it from a gitignored directory made the repo unbuildable by anyone
else, so it lives here instead. Rebuild by checking out the commit above and
copying `packages/react-grab/dist/index.global.js` over this file.

Upstream is MIT; so is this.
