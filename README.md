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

## GSD + Cursor WSL setup

To set up the `get-shit-done` framework and index it with Cursor inside WSL Ubuntu, run the helper script from an elevated Windows PowerShell:

```powershell
cd C:\path\to\New-Project3
.\setup-gsd-wsl.ps1
```

The script will:

- Clone or update `https://github.com/gsd-build/get-shit-done.git` into your WSL home.
- Run `npm install` in the cloned repo.
- Ensure the GSD config section exists.
- Generate a `.cursor` configuration file for the repo.
- Ask the Cursor CLI (inside WSL) to index and validate the project.

By default it expects the Cursor CLI binary at `/usr/local/bin/cursor` inside WSL; update `$CursorBinaryPath` at the top of `setup-gsd-wsl.ps1` if yours lives elsewhere.
