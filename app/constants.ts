import * as path from 'node:path'
import _PACKAGE_JSON from '../package.json'
import _MARKETPLACE_JSON from '../marketplace.json'

// envs
export const GITHUB_TOKEN = process.env.GH_DEV_TOKEN as string

// paths
// https://github.com/vercel/next.js/discussions/14807
// https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
// https://vercel.com/docs/runtimes#advanced-usage/technical-details/including-additional-files
// https://vercel.com/docs/projects/project-configuration#object-definition
export const APP_PATH = __dirname
export const ROOT_PATH = path.resolve(APP_PATH, '..')

// JSON
export const PACKAGE_JSON = _PACKAGE_JSON
export const MARKETPLACE_JSON = _MARKETPLACE_JSON

// templates
export const TEMPLATE_IDS = [
  'hello-world',
  'github-profile',
  'github-sponsors',
  'github-sponsor-button',
  'github-contributions-calendar',
  'github-top-languages'
]

// params
export const PARAM_FIELD_PREFIX = {
  data: 'data.',
  cache: 'cache.',
  svg: 'svg.',
  template: 'template.',
  component: 'prop.'
}
