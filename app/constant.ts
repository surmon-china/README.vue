import path from 'path'
import fs from 'fs-extra'

export const GITHUB_TOKEN = process.env.GH_DEV_TOKEN

export const TEMPLATES_PATH = path.resolve(__dirname, '..', 'templates')
export const TEMPLATES_NAME = fs.readdirSync(path.resolve(__dirname, '..', 'templates'))

export const PACKAGE_JSON = fs.readJsonSync(path.resolve(__dirname, '..', 'package.json'))
