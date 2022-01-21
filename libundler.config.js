const builtinModules = require('builtin-modules')
const packageJSON = require('./package.json')

/** @type {import('@surmon-china/libundler/lib/interface').LibundlerConfigObject} */
module.exports = {
  entry: 'app/server.ts',
  outDir: 'dist',
  outFileName: 'index',
  targets: ['cjs'],
  parser: false,
  sourcemap: true,
  minimize: false,
  banner: false,
  external: [
    ...builtinModules,
    ...Object.keys(packageJSON.dependencies),
    ...Object.keys(packageJSON.devDependencies)
  ]
}
