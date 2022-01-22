import fs from 'fs-extra'
import path from 'path'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { resolveVueComponent } from './step-vue-component'
import { COMPONENTS_PATH, COMPONENTS_NAME } from './constant'
import githubStore from './store/github'
import npmStore from './store/npm'

const injectTemplateContext = {
  $store: { github: githubStore, npm: npmStore }
}

export const renderVueComponent = async (templateString: string, componentProps: any = {}) => {
  const component = await resolveVueComponent(templateString, injectTemplateContext)
  const components = await Promise.all(
    COMPONENTS_NAME.map(async (name) => {
      const componentBuf = await fs.readFile(path.resolve(COMPONENTS_PATH, name))
      const component = await resolveVueComponent(componentBuf.toString())
      return component
    })
  )
  // console.log('renderVueComponent', { component, components })
  const vueApp = createSSRApp({
    name: 'ReadmeApp',
    render: () => h(component, componentProps)
  })
  components.forEach((c) => vueApp.component(c.name!, c))
  const result = await renderToString(vueApp)
  // console.log('renderVueComponent', 'component', component)
  // console.log('renderVueComponent', 'result', result)

  return {
    html: result,
    css: [component.style, ...components.map((c) => c.style || '')].join('\n')
  }
}
