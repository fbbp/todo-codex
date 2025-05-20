# ToDo Codex

This project is an offline-first PWA for task management. It is built with **React 18** and **TypeScript**, using **Vite** as the build tool.

## Features

- Timeline view showing today’s tasks
- CRUD operations with subtasks and categories
- Offline persistence with **IndexedDB** via `dexie`
- Local notifications using **Service Worker** timers
- Repeating tasks parsed from RRULE strings
- Export/Import data as `export.json`
- Installable PWA powered by Workbox

## Architecture Overview

```
React (Zustand) ↑ IndexedDB (Dexie.js)
        Service Worker (Cache API / BG Timers)
                GitHub Pages (static hosting)
```

See the docs in `/docs` for detailed design notes.

## Development

1. Install dependencies using [pnpm](https://pnpm.io):

   ```bash
   pnpm install
   ```

2. Start the dev server:

   ```bash
   pnpm dev
   ```

3. Run tests and lint checks:

   ```bash
   pnpm test
   pnpm lint
   ```

4. Build for production:

   ```bash
   pnpm build
   ```

GitHub Actions runs these same steps on every push.
