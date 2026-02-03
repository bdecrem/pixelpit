# Pixelpit - Standalone Deployment Repo

## What This Is

This repo is the **deployment target** for Pixelpit, a retro game arcade. It's automatically synced from the main `vibeceo` monorepo for fast Vercel deployments (~45s vs 12min on Railway).

**Live site:** https://pixelpit.vercel.app (or custom domain if configured)

## Production Setup

```
vibeceo (source of truth)
    │
    │ push to main (pixelpit paths)
    ▼
GitHub Action (.github/workflows/sync-pixelpit.yml)
    │
    │ copies files + fetches configs
    ▼
pixelpit repo (this repo)
    │
    │ auto-deploy on push
    ▼
Vercel (~45s deploys)
```

## What Lives Where

### In vibeceo (source of truth for game code)
- `web/app/pixelpit/**` → game pages and components
- `web/app/api/pixelpit/**` → API routes
- `web/lib/pixelpit/**` → shared utilities
- `web/public/pixelpit/**` → assets (images, static files)

### In this repo (deployment config)
- `package.json` — dependencies for standalone app
- `next.config.cjs` — Next.js configuration
- `tailwind.config.ts` — Tailwind configuration
- `tsconfig.json` — TypeScript configuration
- `postcss.config.cjs` — PostCSS configuration
- `vercel.json` — Vercel framework detection
- `app/layout.tsx` — root layout (wraps /pixelpit)
- `app/globals.css` — Tailwind imports + CSS variables
- `app/page.tsx` — root redirect to /pixelpit

## How to Make Changes

### Game code, components, assets
Edit in **vibeceo** repo under `web/app/pixelpit/`, `web/app/api/pixelpit/`, etc. Push to main and the GitHub Action will sync here automatically.

### Dependencies or config changes
Edit directly in **this repo** (package.json, next.config.cjs, etc.) and push. The GitHub Action fetches these configs, so changes here persist.

### Root layout or styles
Edit `app/layout.tsx` or `app/globals.css` in **this repo**.

## Environment Variables

Set these in Vercel project settings:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key

## Manual Sync

To trigger the sync manually without code changes:
1. Go to vibeceo repo → Actions → "Sync PixelPit"
2. Click "Run workflow"

## Do NOT Edit Directly

These folders get **overwritten** by the GitHub Action on every sync:
- `app/pixelpit/`
- `app/api/pixelpit/`
- `lib/pixelpit/`
- `public/pixelpit/`

Edit these in vibeceo instead.
