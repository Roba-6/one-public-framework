import alias from '@rollup/plugin-alias'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    react(),
    tailwindcss(),
    dts({ entryRoot: 'src', outDir: 'dist' }),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'src/assets'),
          dest: '.',
        },
      ],
    }),
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
