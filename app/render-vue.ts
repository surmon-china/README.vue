import type { ComponentOptions } from 'vue'
import type { GeneralParams } from './resolve-params'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { HttpError } from './error'

export const renderVueComponent = async (component: ComponentOptions, comParams: GeneralParams): Promise<string> => {
  const componentProps: Record<string, any> = {}
  const paramsKeys = Object.keys(comParams)
  const propsKeys = Object.keys(component.props ?? {})

  // validate prop required
  propsKeys.forEach((key) => {
    if (component.props[key].required && !comParams[key]) {
      throw new HttpError(`Missing required component prop: '${key}'`)
    }
  })

  // Convert and validating input params against component props
  // https://vuejs.org/guide/components/props.html#prop-validation
  // https://github.com/vuejs/vue/issues/9467
  paramsKeys.forEach((key) => {
    const paramValue = comParams[key]
    const propConfig = component.props?.[key]
    const converter = propConfig?.converter
    const validator = propConfig?.validator
    // convert prop type
    componentProps[key] = converter ? converter(paramValue) : paramValue
    // validate prop type
    if (validator && !validator(componentProps[key])) {
      const typeName = component.props?.[key].type?.name
      throw new HttpError(`Invalid component prop: { ${key}: ${typeName ?? 'any'} }`)
    }
  })

  // Rendering Vue apps as SSR
  const readmeApp = createSSRApp({
    name: 'ReadmeApp',
    render: () => h(component, componentProps)
  })

  // If there is an error in the rendering process, it should be returned to the user
  let renderError: any = null
  readmeApp.config.errorHandler = (error) => {
    renderError = error
  }

  const result = await renderToString(readmeApp)

  if (renderError) {
    throw renderError
  } else {
    return result
  }
}
