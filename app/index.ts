import { defineComponent, ComponentOptions } from 'vue'
import { renderModuleContext } from './context'
import { getParamsObject } from './resolve-params'
import { resolveTemplate } from './resolve-template'
import { resolveComponent } from './resolve-component'
import { resolveModule } from './resolve-module'
import { renderVueComponent } from './render-vue'
import { renderSVG } from './render-svg'

export interface ComponentConfig {
  defaultCacheSeconds?: number
}

export interface RenderResult {
  result: string
  headers: Headers
}

export const render = async (searchParams: URLSearchParams): Promise<RenderResult> => {
  // Categorize request parameters
  const params = getParamsObject(searchParams)
  // Getting the template string
  const template = await resolveTemplate(params.template)
  // Convert and process template string
  const resolvedComponent = await resolveComponent(template)

  // Parsing component scripts into JavaScript module
  const componentModule = !resolvedComponent.script
    ? defineComponent({})
    : await resolveModule<ComponentOptions>({
        sourceCode: resolvedComponent.script,
        moduleIdentifier: resolvedComponent.scriptIdentifier!,
        modules: renderModuleContext
      })
  // Attach the `ssrRender` to the component object (if it exists)
  if (resolvedComponent.renderFn) {
    // Parsing component render function into JavaScript module
    componentModule.ssrRender = await resolveModule({
      sourceCode: resolvedComponent.renderFn,
      moduleIdentifier: resolvedComponent.renderFnIdentifier!,
      modules: renderModuleContext
    })
  }

  // Render vue component
  const html = await renderVueComponent(componentModule, params.component)
  const css = resolvedComponent.style ?? void 0
  // Render svg xml
  const svg = await renderSVG({ html, css, params: params.svg })
  // return { params, template, resolvedComponent, componentModule, html, css, config, svg }

  // Cache headers
  const headers = new Headers({ 'content-type': 'image/svg+xml' })
  // user cache > component default cache > global 1 day cache
  const componentConfig: ComponentConfig = componentModule.config || {}
  const cacheSeconds = params.cache.seconds
    ? parseInt(params.cache.seconds, 10)
    : componentConfig.defaultCacheSeconds ?? 60 * 60 * 24
  // disable cache | set cache age
  cacheSeconds === 0
    ? headers.append('Cache-Control', `no-cache, max-age=0`)
    : headers.append('Cache-Control', `public, max-age=${cacheSeconds}`)

  return { headers, result: svg }
}
