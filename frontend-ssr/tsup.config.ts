import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/core.tsx',
    client: 'src/client.ts',
    providers: 'src/providers.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist-package',
  // Keep the Client Component boundary intact in the server bundle.
  external: ['next', 'react', 'react-dom', './providers'],
  sourcemap: true,
  splitting: false,
  treeshake: false,
  tsconfig: 'tsconfig.package.json',
})
