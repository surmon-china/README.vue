import * as vue from 'vue'
import * as vueCompilerSfc from 'vue/compiler-sfc'
import * as vueServerRenderer from 'vue/server-renderer'
import * as vueJsxRuntime from 'vue/jsx-runtime'
import * as IconifyUtils from '@iconify/utils'
import * as IconifyJsonDevicon from '@iconify-json/devicon'
import * as IconifyJsonDeviconPlain from '@iconify-json/devicon-plain'
import * as IconifyJsonSimpleIcons from '@iconify-json/simple-icons'
import validator from 'validator'
import * as lodash from 'lodash'
import * as jsBase64 from 'js-base64'
import * as ghLangColors from 'gh-lang-colors'

// Used to restrict which modules a component can import
export const globalModuleContext = {
  // utils
  lodash: Object.freeze(lodash),
  validator: Object.freeze(validator),
  'js-base64': Object.freeze(jsBase64),
  'gh-lang-colors': Object.freeze(ghLangColors),
  // iconify icons
  '@iconify/utils': Object.freeze(IconifyUtils),
  '@iconify-json/devicon': Object.freeze(IconifyJsonDevicon),
  '@iconify-json/devicon-plain': Object.freeze(IconifyJsonDeviconPlain),
  '@iconify-json/simple-icons': Object.freeze(IconifyJsonSimpleIcons),
  // about vue
  vue: Object.freeze(vue),
  'vue/jsx-runtime': Object.freeze(vueJsxRuntime),
  'vue/compiler-sfc': Object.freeze(vueCompilerSfc),
  'vue/server-renderer': Object.freeze(vueServerRenderer)
}

import stores from './stores'
import components from './components'

// Add Built-in components to the module context
export const innerModuleContext = {
  '@components': Object.freeze(components),
  '@stores': Object.freeze(stores)
}

export const renderModuleContext = {
  ...globalModuleContext,
  ...innerModuleContext
}
