import {defineConfig} from 'tsup'

const baseConfig = {
  splitting: true,
  minify: false,
  clean: true,
  shims: true
}

export default defineConfig([
  {
    ...baseConfig,
    entry: {index: 'src/index.ts'},
    outDir: 'dist/lib',
    format: ['cjs', 'esm'],
    sourcemap: true,
    dts: true
  },
  {
    ...baseConfig,
    entry: {'nyabby': 'src/cli/nyabby.ts'},
    outDir: 'dist/cli',
    format: ['esm'],
    sourcemap: false,
    dts: false,
  }
])
