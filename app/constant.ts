import path from 'path'
import fs from 'fs-extra'

export const PACKAGE_JSON = fs.readJsonSync(path.resolve(__dirname, '..', 'package.json'))
export const TEMPLATES_NAME = fs.readdirSync(path.resolve(__dirname, '..', 'templates'))
