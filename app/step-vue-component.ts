import vm from 'vm'
import { rollup } from 'rollup'
import rollupVirtual from '@rollup/plugin-virtual'
import { parse, compileScript, compileStyle, compileTemplate } from 'vue/compiler-sfc'

export interface ResolvedComponent {
  name?: string
  defaultCacheAge?: number
  props: any
  setup: () => any
  template: string
  style: string
}

export const resolveVueComponent = async (
  template: string,
  context: any = {}
): Promise<ResolvedComponent> => {
  const { descriptor, errors } = parse(template)
  if (errors.length) {
    throw `Template parse error ${errors.join(';')}`
  }

  // vue template | vue script
  if (!descriptor.template?.content || !descriptor.script?.content) {
    throw `Invalid template (vue SFC component)`
  }

  // https://github.com/vuejs/core/tree/main/packages/compiler-sfc#high-level-workflow
  const compileID = 'template'
  const compiledScript = compileScript(descriptor, { isProd: true, id: compileID }).content
  const compiledRenderFn = compileTemplate({
    source: descriptor.template.content,
    id: compileID,
    filename: `${compileID}.vue`
  })
  const compiledStyle = descriptor.styles
    .filter((style) => style.type === 'style')
    .map((style) => {
      const s = compileStyle({
        source: style.content,
        id: compileID,
        filename: `${compileID}.vue`
      })
      return s.code
    })
    .join('\n')

  const bundle = await rollup({
    input: 'script',
    external: ['vue'],
    plugins: [rollupVirtual({ script: compiledScript })]
  })
  const { output } = await bundle.generate({ format: 'commonjs', exports: 'auto' })
  const commonjsScript = output[0].code
  // console.log('resolveVueComponent', 'parsed', { compiledScript, commonjsScript })

  // http://nodejs.cn/api/vm.html#new-vmscriptcode-options
  const fakeModule = { exports: {} }
  const sandbox = vm.createContext({ module: fakeModule, $ctx: Object.freeze({ ...context }) })
  const vmScript = new vm.Script(commonjsScript)
  const componentObject = vmScript.runInContext(sandbox)
  // console.log('resolveVueComponent', { componentObject })

  componentObject.template = descriptor.template.content
  componentObject.style = compiledStyle
  return componentObject
}
