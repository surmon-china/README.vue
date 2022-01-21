import vm from 'vm'
import { createSSRApp, h } from 'vue'
import * as compiler from '@vue/compiler-sfc'
import { renderToString } from '@vue/server-renderer'
import { build } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import type { RollupOutput, OutputChunk, OutputAsset } from 'rollup'

console.log('------tryRequire("vue/compiler-sfc")', require('vue/compiler-sfc'))

export const renderVueComponent = async (templateString: string, componentProps: any = {}) => {
  const parsed = compiler.parse(templateString)
  if (parsed.errors.length) {
    throw `Template parse error ${parsed.errors.join(';')}`
  }

  // console.log('renderVueComponent-entry', templateString)
  const virtualID = 'template.vue'
  const output = await build({
    plugins: [
      vuePlugin({ isProduction: true, compiler }),
      {
        name: 'virtual-plugin',
        resolveId: (id) => (id.endsWith(virtualID) ? virtualID : null),
        load: (id) => (id === virtualID ? templateString : null)
      }
    ],
    build: {
      write: false,
      ssr: true,
      cssCodeSplit: false,
      rollupOptions: {
        input: virtualID,
        external: ['vue', /^@vue\/(.*)/]
      }
    }
  })

  const outputs = (output as RollupOutput).output || []
  const scriptChunk = outputs.filter((i) => i.type === 'chunk' && i.isEntry)[0] as OutputChunk
  const styleChunk = outputs.filter(
    (i) => i.type === 'asset' && i.name?.endsWith('.css')
  )[0] as OutputAsset
  const sandbox = vm.createContext({ exports: {}, require })
  const componentObject = vm.runInContext(scriptChunk.code, sandbox)
  const result = await renderToString(
    createSSRApp({
      name: 'Template',
      render: () => h(componentObject, componentProps)
    })
  )

  // console.log('renderVueComponent', 'componentObject', componentObject)
  // console.log('renderVueComponent', 'vueComponent', result)
  // console.log('renderVueComponent', 'style', styleChunk.source)

  return {
    html: result,
    css: styleChunk.source.toString()
  }
}
