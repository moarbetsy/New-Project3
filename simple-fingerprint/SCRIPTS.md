# Available Scripts

## Development

### `pnpm dev`
Starts the development server with Hot Module Replacement (HMR).
- Server runs on: http://localhost:3000
- Changes auto-reload in browser
- TypeScript type checking in watch mode

### `pnpm build`
Creates an optimized production build.
- Output directory: `dist/`
- Minified and tree-shaken
- Source maps included
- Vendor chunks separated

### `pnpm preview`
Preview the production build locally.
- Serves the `dist/` directory
- Tests production build before deployment

## Code Quality

### `pnpm lint`
Run ESLint to check for code issues.
- Checks all TypeScript and React files
- Reports errors and warnings

### `pnpm format`
Format code with Prettier (if configured).
- Consistent code style
- Auto-fixes formatting issues

## Type Checking

### `pnpm tsc`
Run TypeScript compiler for type checking.
- No output files (noEmit: true)
- Catches type errors before runtime

## Deployment

### Build and Deploy
```bash
pnpm build
# Upload dist/ to your hosting provider
```

### Supported Platforms
- Vercel: `vercel deploy`
- Netlify: `netlify deploy --prod`
- Cloudflare Pages: `wrangler pages deploy dist`
