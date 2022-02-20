import fs from 'fs-extra'
import path from 'path'
import simpleIcons from 'simple-icons'
import * as lodash from 'lodash'
import * as vue from 'vue'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { resolveVueComponent } from './step-vue-component'
import { COMPONENTS_PATH, COMPONENTS_NAME } from './constant'
import counterStore from './store/counter'
import githubStore from './store/github'
import npmStore from './store/npm'

// devicon
const deviconJSON = fs.readJsonSync(path.resolve(__dirname, 'devicon', 'devicon.json'))
const getDevicon = (name) => deviconJSON.find((icon) => icon.name === name) || null

const injectTemplateContext = {
  vue: Object.freeze(vue),
  lodash: Object.freeze(lodash),
  simpleIcons: Object.freeze(simpleIcons),
  devicon: getDevicon,
  store: Object.freeze({
    github: githubStore,
    counter: counterStore,
    npm: npmStore
  })
}

export const renderVueComponent = async (templateString: string, componentProps: any = {}) => {
  const component = await resolveVueComponent(templateString, injectTemplateContext)
  const components = await Promise.all(
    COMPONENTS_NAME.map(async (name) => {
      const componentBuf = await fs.readFile(path.resolve(COMPONENTS_PATH, name))
      const component = await resolveVueComponent(componentBuf.toString(), injectTemplateContext)
      return component
    })
  )
  // console.log('renderVueComponent', { component, components })
  // format props type
  Object.keys(componentProps).forEach((key) => {
    const propType = component.props[key]?.type
    if (propType) {
      if (propType?.name === 'Number') {
        componentProps[key] = Number(componentProps[key])
      }
      if (propType?.name === 'Boolean') {
        const value = componentProps[key]
        if (value === 'false') {
          componentProps[key] = false
        } else if (value === 'true') {
          componentProps[key] = true
        } else {
          componentProps[key] = Boolean(value)
        }
      }
    }
  })
  const vueApp = createSSRApp({
    name: 'ReadmeApp',
    render: () => h(component, componentProps)
  })
  components.forEach((c) => vueApp.component(c.name!, c))
  let renderError: any = null
  vueApp.config.errorHandler = (error) => {
    renderError = error
  }
  const result = await renderToString(vueApp)
  if (renderError) {
    throw renderError
  }
  // console.log('renderVueComponent', 'component', component)
  // console.log('renderVueComponent', 'result', result)

  return {
    html: result,
    css: [component.style, ...components.map((c) => c.style || '')].join('\n'),
    cacheAge: component.defaultCacheAge
  }
}
