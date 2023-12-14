import { defineComponent, h } from 'vue'
import { icons as simpleIcons } from '@iconify-json/simple-icons'
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils'

// https://simpleicons.org/
// https://www.npmjs.com/package/@iconify-json/simple-icons
// https://iconify.design/docs/libraries/utils/get-icon-data.html#example
export default defineComponent({
  name: 'SimpleIcons',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: false
    },
    size: {
      type: [String, Number],
      required: false
    },
    width: {
      type: [String, Number],
      required: false
    },
    height: {
      type: [String, Number],
      required: false
    }
  },
  setup(props) {
    const iconData = getIconData(simpleIcons, props.name)
    if (!iconData) {
      console.warn(`<SimpleIcons name="${props.name}"> is missing`)
      return () => h('span', { class: 'simple-icons' })
    }

    const renderData = iconToSVG(iconData, {
      width: null,
      height: null
    })

    // Disable rendering of the default svg size attribute to keep the svg adaptive to the parent element
    const { width: _, height: __, ...restAttrs } = renderData.attributes
    const svg = iconToHTML(replaceIDs(renderData.body), {
      ...restAttrs,
      color: props.color ?? ''
    })

    return () => {
      return h('span', {
        class: 'simple-icons',
        style: {
          display: 'inline-block',
          width: props.width ?? props.size ?? void 0,
          height: props.height ?? props.size ?? void 0
        },
        innerHTML: svg
      })
    }
  }
})
