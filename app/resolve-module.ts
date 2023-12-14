import * as vm from 'vm'

export interface ResolveModuleOptions {
  sourceCode: string
  moduleIdentifier: string
  context?: Record<string, any>
  modules?: Record<string, any>
}

export const resolveModule = async <T = any>(options: ResolveModuleOptions): Promise<T> => {
  // https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/main.ts#L366
  const vmExposeIdentifier = 'expose'
  const esModuleCode = `
    ${options.sourceCode}
    ${vmExposeIdentifier} = ${options.moduleIdentifier};
  `

  // http://nodejs.cn/api/vm.html#new-vmscriptcode-options
  // https://nodejs.org/api/vm.html#vm_class_vm_sourcetextmodule
  // https://github.com/ionic-team/rollup-plugin-node-polyfills/blob/master/polyfills/vm.js
  const sandbox = vm.createContext({ ...options.context, [vmExposeIdentifier]: null })
  const moduleScript = new vm.SourceTextModule(esModuleCode, {
    context: sandbox
  })

  // https://stackoverflow.com/a/73282303/6222535
  // https://github.com/nodejs/node/issues/35848#issuecomment-1024964697
  // https://github.com/nodejs/node/issues/35848#issuecomment-717953126
  await moduleScript.link(async (specifier) => {
    return new Promise(async (resolve, reject) => {
      // Use the `options.modules` object to limit the scope of the component that can be imported.
      const module = options.modules?.[specifier]
      if (!module) {
        reject(new Error(`Cannot import module "${specifier}"`))
        return
      }

      const exportNames = Object.keys(module)
      const syntheticModule = new vm.SyntheticModule(
        exportNames,
        function () {
          exportNames.forEach((key) => this.setExport(key, module[key]))
        },
        { identifier: specifier, context: sandbox }
      )
      resolve(syntheticModule)
    })
  })

  await moduleScript.evaluate()
  return sandbox[vmExposeIdentifier]
}
