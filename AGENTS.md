<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SalonBook Client

SalonBook is a salon appointment booking platform where customers can explore salon services, view service information, and request appointments online.

Next.js App Router client (single package). Use npm (`package-lock.json` present).

## Commands

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - ESLint (`eslint`, flat config via `eslint.config.mjs`)

No `test` or `typecheck` script is defined. For verification, use `npm run lint` and `npm run build`.

## Structure & Conventions

- App Router source lives in `src/app/`; `@/*` maps to `src/*` (`tsconfig.json`).
- Global styles: `src/app/globals.css` uses Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`).
- Static assets live in `public/`.

## Repo-Specific Notes

- `next.config.ts` enables `experimental.agentFeedback`, `cacheComponents`, `partialPrefetching`, and a Turbopack CSS rule loading `@tailwindcss/turbopack`. Preserve these unless the task requires changing them.
- `LayoutProps<"/">` is used in `src/app/layout.tsx`; follow existing Next 16.4 typing patterns when editing App Router files.
- `.env*` files are gitignored; do not commit secrets.
