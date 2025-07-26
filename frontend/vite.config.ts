import alias from '@rollup/plugin-alias'
import url from '@rollup/plugin-url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
      limit: 0,
      fileName: 'assets/[name][extname]',
    }),
    react(),
    tailwindcss(),
    dts({ entryRoot: 'src', outDir: 'dist' }),
  ],
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
