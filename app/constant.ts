import path from 'path'
import fs from 'fs-extra'

export const GITHUB_TOKEN = process.env.GH_DEV_TOKEN as string
export const MONGODB_URI = process.env.MONGODB_URI as string

export const ROOT_PATH = path.resolve(__dirname, '..')

export const TEMPLATES_PATH = path.resolve(ROOT_PATH, 'templates')
export const TEMPLATES_NAME = fs.readdirSync(TEMPLATES_PATH)

export const COMPONENTS_PATH = path.resolve(ROOT_PATH, 'components')
export const COMPONENTS_NAME = fs.readdirSync(COMPONENTS_PATH)

export const PACKAGE_JSON = fs.readJsonSync(path.resolve(ROOT_PATH, 'package.json'))
