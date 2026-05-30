#!/usr/bin/env node
// Rasterizes the SVG sources under resources/ into the PNGs that
// @capacitor/assets consumes. Run before `capacitor-assets generate`
// whenever you tweak resources/*.svg.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const TASKS = [
  ['resources/icon.svg', 'resources/icon.png', 1024],
  ['resources/icon-foreground.svg', 'resources/icon-foreground.png', 1024],
  ['resources/icon-background.svg', 'resources/icon-background.png', 1024],
  ['resources/splash.svg', 'resources/splash.png', 2732],
];

let failed = 0;
for (const [src, dst, size] of TASKS) {
  const srcAbs = resolve(src);
  if (!existsSync(srcAbs)) {
    console.warn('[rasterize-assets] skip (missing):', src);
    continue;
  }
  try {
    await sharp(srcAbs, { density: 384 }).resize(size, size).png().toFile(resolve(dst));
    console.log('[rasterize-assets] wrote', dst);
  } catch (err) {
    console.error('[rasterize-assets] FAILED', src, '->', dst, err.message);
    failed += 1;
  }
}
process.exit(failed === 0 ? 0 : 1);
