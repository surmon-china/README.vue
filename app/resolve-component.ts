import cssnano from 'cssnano'
import * as esbuild from 'esbuild'
import * as compiler from 'vue/compiler-sfc'
import { HttpError } from './error'

export interface ResolvedComponent {
  style: string | null
  template: string | null
  script: string | null
  renderFn: string | null
  scriptIdentifier: string | null
  renderFnIdentifier: string | null
  isInlineRender: boolean
}

const getCompilerErrorMessage = (error: string | compiler.CompilerError | SyntaxError) => {
  return typeof error === 'string' ? error : error.message
}

// https://github.com/vuejs/core/tree/main/packages/compiler-sfc
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/index.ts#L207
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/main.ts#L337
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/utils/descriptorCache.ts#L54
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/utils/descriptorCache.ts#L28
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/script.ts#L63
// https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/script.ts#L45C8-L45C44
// https://github.com/vuejs/core/tree/main/packages/sfc-playground
// https://github.com/vuejs/repl
export const resolveComponent = async (vueSFC: string): Promise<ResolvedComponent> => {
  const componentId = 'template'
  const componentScopeId = `data-v-${componentId}`
  const componentFileName = `${componentId}.vue`
  const componentScriptIdentifier = `${componentId}_sfc_main`

  const { descriptor, errors } = compiler.parse(vueSFC, { filename: componentFileName })
  if (errors.length) {
    const firstError = getCompilerErrorMessage(errors[0])
    throw new HttpError(`SFC parsing failed! "${firstError}"`)
  }

  if (descriptor.template?.src) {
    throw new HttpError('SFC "<template src>" is not supported!')
  }

  if (descriptor.styles.some((s) => s.src)) {
    throw new HttpError('SFC "<style src>" is not supported!')
  }

  if (descriptor.scriptSetup?.src || descriptor.script?.src) {
    throw new HttpError('SFC "<script src>" is not supported!')
  }

  // console.log('----descriptor', descriptor, { hasScoped })

  const hasScopedStyle = descriptor.styles.some((s) => s.scoped)
  // The practical effect of inlineTemplate is that it takes effect whenever the user uses <script setup>, regardless of script order
  const isInlineRender = !!descriptor.scriptSetup
  // The lang of all `<script>` must be the same in Vue SFC.
  const scriptLang = descriptor.scriptSetup?.lang || descriptor.script?.lang
  const isTsScript = scriptLang === 'ts' || scriptLang === 'tsx'

  let compiledTemplate: compiler.SFCTemplateCompileResults | null = null
  let compiledStyles: compiler.SFCStyleCompileResults[] | null = null
  let compiledScript: compiler.SFCScriptBlock | null = null

  // for template compiler and script compiler
  const resolveTemplateCompilerOptions = (sourceCode: string): compiler.SFCTemplateCompileOptions => ({
    source: sourceCode,
    id: componentId,
    // @ts-ignore
    ast: descriptor.template?.ast,
    filename: descriptor.filename,
    slotted: descriptor.slotted,
    ssrCssVars: descriptor.cssVars,
    scoped: hasScopedStyle,
    ssr: true,
    isProd: true,
    compilerOptions: {
      // If using TS, support TS syntax in template expressions
      expressionPlugins: isTsScript ? ['typescript'] : [],
      // Completion of attribute values is always required, as separate attribute tags are not legal in xml
      scopeId: hasScopedStyle ? `${componentScopeId}="true"` : undefined
    }
  })

  // compile template
  // https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/template.ts
  // If the component contains `<script setup>`
  // the template is compiled into the setup's render function
  // so don't need to generate ssrRender here.
  if (descriptor.template && !isInlineRender) {
    const options = resolveTemplateCompilerOptions(descriptor.template.content)
    compiledTemplate = compiler.compileTemplate(options)
    if (compiledTemplate.errors.length) {
      const firstError = getCompilerErrorMessage(compiledTemplate.errors[0])
      throw new HttpError(`SFC template parsing failed! "${firstError}"`)
    }
  }

  // compile styles
  // https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/style.ts#L19
  // https://github.com/vuejs/core/blob/main/packages/compiler-sfc/src/style/preprocessors.ts
  if (descriptor.styles.length) {
    compiledStyles = await Promise.all(
      descriptor.styles
        .filter((style) => style.type === 'style')
        .map((style) => {
          return compiler.compileStyleAsync({
            id: componentScopeId,
            filename: descriptor.filename,
            source: style.content,
            scoped: style.scoped,
            trim: true,
            isProd: true,
            preprocessLang: style.lang as compiler.SFCStyleCompileOptions['preprocessLang'],
            postcssPlugins: [cssnano({ preset: 'default' })],
            postcssOptions: { map: false }
          })
        })
    )

    const errors = compiledStyles.flatMap((i) => i.errors)
    if (errors.length) {
      const firstError = getCompilerErrorMessage(errors[0])
      throw new HttpError(`SFC style parsing failed! "${firstError}"`)
    }
  }

  // compile scripts
  // https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/src/script.ts
  if (descriptor.script || descriptor.scriptSetup) {
    compiledScript = compiler.compileScript(descriptor, {
      // This must be consistent with the `id` passed to `compileStyle`.
      id: componentScopeId,
      isProd: true,
      // Only works for `<script setup>`.
      inlineTemplate: isInlineRender,
      genDefaultAs: componentScriptIdentifier,
      templateOptions: descriptor.template?.content
        ? resolveTemplateCompilerOptions(descriptor.template.content)
        : undefined
    })
  }

  // compile typescript
  // `vue/compiler-sfc` will output the original TypeScript as-is, so it needs to be converted to JavaScript here.
  let scriptCode = compiledScript?.content ?? null
  if (scriptCode) {
    const jsCode = isTsScript ? esbuild.transformSync(scriptCode, { loader: 'ts' }).code : scriptCode
    scriptCode = `
      ${jsCode}
      export default ${componentScriptIdentifier};
    `
  }

  return {
    template: descriptor.template?.content ?? null,
    style: compiledStyles?.map((i) => i.code).join('\n') ?? null,
    script: scriptCode,
    scriptIdentifier: scriptCode ? componentScriptIdentifier : null,
    renderFn: compiledTemplate?.code ?? null,
    renderFnIdentifier: compiledTemplate?.code ? 'ssrRender' : null,
    isInlineRender: !!descriptor.scriptSetup
  }
}
