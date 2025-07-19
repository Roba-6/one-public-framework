import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ entryRoot: 'src', outDir: 'dist' })],
  server: { host: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envDir: '../',
  envPrefix: ['UI_'],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'OnePublicUI',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => /^react/.test(id),
    },
  },
})
