#!/usr/bin/env node
// Capacitor 8's `cap sync ios` on Windows writes backslashes into
// ios/App/CapApp-SPM/Package.swift, which SPM on macOS cannot parse.
// This rewrites those relative paths to forward slashes. Idempotent and
// safe to run on macOS / Linux too (no-op there).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve('ios/App/CapApp-SPM/Package.swift');
if (!existsSync(file)) {
  process.exit(0);
}
const src = readFileSync(file, 'utf8');
const fixed = src.replace(/path:\s*"([^"]+)"/g, (_, p) => `path: "${p.replace(/\\/g, '/')}"`);
if (fixed !== src) {
  writeFileSync(file, fixed, 'utf8');
  console.log('[fix-spm-paths] normalized Windows backslashes in', file);
} else {
  console.log('[fix-spm-paths] no changes needed');
}
