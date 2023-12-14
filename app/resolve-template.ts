import * as fs from 'fs'
import * as path from 'path'
import { ROOT_PATH, MARKETPLACE_JSON, TEMPLATE_IDS } from './constants'
import { HttpStatus, HttpError } from './error'
import { Params } from './resolve-params'

export const resolveTemplateByUrl = async (templateUrl: string): Promise<string> => {
  try {
    const url = new URL(templateUrl)
    const response = await fetch(url.href)
    return response.text()
  } catch (error) {
    throw new HttpError(`Fetch remote template failed! "${error}"`, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const resolveTemplateByID = async (templateID: string): Promise<string> => {
  const foundInMarketplace = MARKETPLACE_JSON.find((item) => item.id === templateID)
  if (!foundInMarketplace) {
    throw new HttpError(`Template "${templateID}" not found!`)
  }

  if (TEMPLATE_IDS.includes(templateID)) {
    const filePath = path.resolve(ROOT_PATH, 'templates', templateID, 'template.vue')
    return fs.readFileSync(filePath, 'utf-8').toString()
  } else {
    return resolveTemplateByUrl(foundInMarketplace.template)
  }
}

export const resolveTemplate = async (templateParams: Params['template']) => {
  const { id, url } = templateParams
  if (id) {
    return resolveTemplateByID(id)
  } else if (url) {
    return resolveTemplateByUrl(url)
  } else {
    throw new HttpError('Invalid template params!')
  }
}
