import { resolveTemplateByID, resolveTemplateByUrl, resolveTemplateByString } from './step-template'
import { renderVueComponent } from './step-vue-render'
import { renderSVG } from './step-svg'

export interface TemplateRendererParams {
  template_id?: string
  template_url?: string
  template_string?: string
  [key: string]: any
}

export const renderTemplate = async (params: TemplateRendererParams = {}): Promise<string> => {
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

  const templateParamPrefix = `params.`
  const templateParams = {}
  Object.keys(restParams).forEach((paramKey) => {
    if (paramKey.startsWith(templateParamPrefix)) {
      templateParams[paramKey.replace(templateParamPrefix, '')] = restParams[paramKey]
    }
  })

  const { html, css } = await renderVueComponent(template, templateParams)
  return renderSVG(html, css)
}
