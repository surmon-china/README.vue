import { defineConfig } from '@surmon-china/libundler'
import builtinModules from 'builtin-modules'
import packageJSON from './package.json'

export default defineConfig({
  libName: 'Readme',
  entry: 'app/server.ts',
  outDir: 'dist',
  outFileName: 'index',
  targets: ['cjs'],
  parser: false,
  sourcemap: true,
  terser: false,
  banner: false,
  external: [
    /^vue\/(.*)/,
    ...builtinModules,
    ...Object.keys(packageJSON.dependencies),
    ...Object.keys(packageJSON.devDependencies)
  ]
})
