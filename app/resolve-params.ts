import { PARAM_FIELD_PREFIX } from './constants'

export type GeneralParams = Record<string, string | void>
export interface DataParams extends GeneralParams {}

export interface CacheParams extends GeneralParams {
  seconds?: string
}

export interface SvgParams extends GeneralParams {
  width?: string
  height?: string
}

export interface TemplateParams extends GeneralParams {
  id?: string
  url?: string
}

export interface Params {
  data: DataParams
  cache: CacheParams
  svg: SvgParams
  template: TemplateParams
  component: GeneralParams
}

export const getParamsObject = (searchParams: URLSearchParams): Params => {
  const params: Params = {
    data: {},
    cache: {},
    svg: {},
    template: {},
    component: {}
  }

  searchParams.forEach((value, key) => {
    if (key.startsWith(PARAM_FIELD_PREFIX.data)) {
      params.data[key.replace(PARAM_FIELD_PREFIX.data, '')] = value
    } else if (key.startsWith(PARAM_FIELD_PREFIX.cache)) {
      params.cache[key.replace(PARAM_FIELD_PREFIX.cache, '')] = value
    } else if (key.startsWith(PARAM_FIELD_PREFIX.svg)) {
      params.svg[key.replace(PARAM_FIELD_PREFIX.svg, '')] = value
    } else if (key.startsWith(PARAM_FIELD_PREFIX.template)) {
      params.template[key.replace(PARAM_FIELD_PREFIX.template, '')] = value
    } else if (key.startsWith(PARAM_FIELD_PREFIX.component)) {
      params.component[key.replace(PARAM_FIELD_PREFIX.component, '')] = value
    }
  })

  return params
}
