import vm from 'vm'
import { rollup } from 'rollup'
import rollupVirtual from '@rollup/plugin-virtual'
import { createSSRApp, h } from 'vue'
import {
  parse,
  compileScript,
  compileStyle,
  rewriteDefault,
  compileTemplate
} from 'vue/compiler-sfc'
import { renderToString } from 'vue/server-renderer'

export const renderVueComponent = async (templateString: string, componentProps: any = {}) => {
  const { descriptor, errors } = parse(templateString)
  if (errors.length) {
    throw `Template parse error ${errors.join(';')}`
  }

  // vue template | vue script
  if (!descriptor.template?.content || !descriptor.script?.content) {
    throw `Invalid template`
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
        filename: `${compileID}.css`
      })
      return s.code
    })
    .join('\n')

  const esmScript = `
    ${rewriteDefault(compiledScript, 'component')}
    ;// ...
  `

  const bundle = await rollup({
    input: 'script',
    external: ['vue'],
    plugins: [rollupVirtual({ script: esmScript })]
  })
  const { output } = await bundle.generate({ format: 'commonjs' })
  const commonjsScript = output[0].code
  // console.log('renderVueComponent', 'parsed', { esmScript, commonjsScript })
  // http://nodejs.cn/api/vm.html#new-vmscriptcode-options
  const sandbox = vm.createContext({ require })
  const vmScript = new vm.Script(commonjsScript)
  const componentObject = vmScript.runInContext(sandbox)
  componentObject.template = descriptor.template.content
  // console.log('renderVueComponent', { componentObject })
  const result = await renderToString(
    createSSRApp({
      name: 'Template',
      render: () => h(componentObject, componentProps)
    })
  )
  // console.log('renderVueComponent', 'componentObject', componentObject)
  // console.log('renderVueComponent', 'vueComponent', result)

  return {
    html: result,
    css: compiledStyle
  }
}
