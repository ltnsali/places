import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/places/' : '/',
  plugins: [react()],
})
