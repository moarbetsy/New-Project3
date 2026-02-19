## New-Project3 – Simple Fingerprint Scanner

This repo contains a Vite + React app in the `simple-fingerprint` directory.  
It provides device fingerprinting and network intelligence features.

## Install dependencies

From the project root:

```bash
cd simple-fingerprint
npm install
```

## Run the dev server

```bash
cd simple-fingerprint
npm run dev
```

Then open the URL Vite prints in your terminal (by default `http://localhost:3000/`).

## Build for production

```bash
cd simple-fingerprint
npm run build
```

The production build will be output to `simple-fingerprint/dist`.

## GitHub Pages deployment

- The `dist/` folder inside `simple-fingerprint` is what gets deployed to GitHub Pages.
- A GitHub Actions workflow builds the app and publishes `simple-fingerprint/dist` automatically on pushes to `main`.
- Local dev uses `http://localhost:3000/`, while the live site is served from the GitHub Pages URL shown under **Settings → Pages** in this repo.
