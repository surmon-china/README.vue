import path from 'path'
import fs from 'fs-extra'

export const GITHUB_TOKEN = process.env.GH_DEV_TOKEN as string

export const TEMPLATES_PATH = path.resolve(__dirname, '..', 'templates')
export const TEMPLATES_NAME = fs.readdirSync(TEMPLATES_PATH)

export const COMPONENTS_PATH = path.resolve(__dirname, '..', 'components')
export const COMPONENTS_NAME = fs.readdirSync(COMPONENTS_PATH)

export const PACKAGE_JSON = fs.readJsonSync(path.resolve(__dirname, '..', 'package.json'))

export const CACHE_SECONDS = {
  THIRTY_MINUTES: 1800,
  TWO_HOURS: 7200,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400
}
