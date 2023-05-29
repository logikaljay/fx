import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  splitting: false,
  format: ['cjs'],
  dts: true,
  target: 'node18',
  external: ['esbuild', 'tsup'],
  clean: true
})