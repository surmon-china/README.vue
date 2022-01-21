import path from 'path'
import axios from 'axios'
import fs from 'fs-extra'
import { TEMPLATES_PATH, TEMPLATES_NAME } from './constant'

export const resolveTemplateByID = async (templateID: string) => {
  if (!TEMPLATES_NAME.includes(templateID)) {
    throw `Template ${templateID} not found`
  }
  return fs.readFileSync(path.resolve(TEMPLATES_PATH, templateID, 'template.vue')).toString()
}

export const resolveTemplateByUrl = async (templateUrl: string) => {
  try {
    const url = new URL(templateUrl)
    const response = await axios.get(url.href)
    return response.data
  } catch (error) {
    throw error
  }
}

export const resolveTemplateByString = (templateString: string) => {
  return decodeURIComponent(templateString)
}
