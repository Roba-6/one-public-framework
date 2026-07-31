import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist-package',
  external: ['next', 'react', 'react-dom'],
  sourcemap: true,
  splitting: false,
  treeshake: false,
  tsconfig: 'tsconfig.package.json',
  banner: {
    js: '"use client";',
  },
})
