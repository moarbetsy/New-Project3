# Simple Fingerprint Scanner

A device fingerprinting and network intelligence scanner built with Vite + React.

## 🌐 Access the Scanner

The scanner is available on GitHub Pages. Visit the live site at:

**https://moarbetsy.github.io/New-Project3/**

The app automatically deploys to GitHub Pages on every push to the `main` branch.

## 📦 GitHub Pages Deployment

The `dist/` folder inside `simple-fingerprint` is what gets deployed to GitHub Pages.

A GitHub Actions workflow builds the app and publishes `simple-fingerprint/dist` automatically on pushes to `main`.

- **Local dev**: Uses `http://localhost:3000/`
- **Live site**: Served from the GitHub Pages URL shown under Settings → Pages in this repo

## 🛠️ GSD + Cursor WSL Setup

To set up the get-shit-done framework and index it with Cursor inside WSL Ubuntu, run the helper script from an elevated Windows PowerShell:

```powershell
cd C:\path\to\New-Project3
.\setup-gsd-wsl.ps1
```

The script will:

1. Clone or update `https://github.com/gsd-build/get-shit-done.git` into your WSL home
2. Run `npm install` in the cloned repo
3. Ensure the GSD config section exists
4. Generate a `.cursor` configuration file for the repo
5. Ask the Cursor CLI (inside WSL) to index and validate the project

By default it expects the Cursor CLI binary at `/usr/local/bin/cursor` inside WSL; update `$CursorBinaryPath` at the top of `setup-gsd-wsl.ps1` if yours lives elsewhere.
