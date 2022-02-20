import path from 'path'
import fs from 'fs-extra'

export const GITHUB_TOKEN = process.env.GH_DEV_TOKEN as string
export const MONGODB_API_KEY = process.env.MONGODB_API_KEY as string

// https://vercel.com/docs/runtimes#advanced-usage/technical-details/including-additional-files
// MARK: keep static path
export const TEMPLATES_PATH = path.resolve(__dirname, '..', 'templates')
export const TEMPLATES_NAME = fs.readdirSync(TEMPLATES_PATH)

export const COMPONENTS_PATH = path.resolve(__dirname, 'components')
export const COMPONENTS_NAME = fs.readdirSync(COMPONENTS_PATH)

export const PACKAGE_JSON = fs.readJsonSync(path.resolve(__dirname, '..', 'package.json'))
export const MARKETPLACE_JSON = fs.readJsonSync(path.resolve(__dirname, '..', 'marketplace.json'))
