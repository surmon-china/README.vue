import { resolveTemplateByID, resolveTemplateByUrl, resolveTemplateByString } from './step-template'
import { renderVueComponent } from './step-vue-render'
import { renderSVG } from './step-svg'

export interface TemplateRendererParams {
  template_id?: string
  template_url?: string
  template_string?: string
  [key: string]: any
}

export interface TemplateRendererResult {
  svg: string
  cacheAge?: number
}

export const renderTemplate = async (
  params: TemplateRendererParams = {}
): Promise<TemplateRendererResult> => {
  const { template_id, template_url, template_string, ...restParams } = params
  if (!template_id && !template_url && !template_string) {
    throw 'Invalid template params'
  }

  const template = template_id
    ? await resolveTemplateByID(template_id)
    : template_url
    ? await resolveTemplateByUrl(template_url)
    : template_string
    ? resolveTemplateByString(template_string)
    : null

  if (!template) {
    throw 'Invalid template params'
  }

  const componentPropPrefix = `props.`
  const componentProps = {}
  Object.keys(restParams).forEach((paramKey) => {
    if (paramKey.startsWith(componentPropPrefix)) {
      componentProps[paramKey.replace(componentPropPrefix, '')] = restParams[paramKey]
    }
  })

  const svgParamPrefix = `svg.`
  const svgParams = {}
  Object.keys(restParams).forEach((paramKey) => {
    if (paramKey.startsWith(svgParamPrefix)) {
      svgParams[paramKey.replace(svgParamPrefix, '')] = restParams[paramKey]
    }
  })

  const { html, css, cacheAge } = await renderVueComponent(template, componentProps)
  const svg = renderSVG(html, css, svgParams)
  return {
    svg,
    cacheAge
  }
}
