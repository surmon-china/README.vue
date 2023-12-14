import { defineComponent, h } from 'vue'
import { icons as deviconIcons } from '@iconify-json/devicon'
import { icons as deviconPlainIcons } from '@iconify-json/devicon-plain'
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils'

// https://devicon.dev
// https://www.npmjs.com/package/@iconify-json/devicon
// https://iconify.design/docs/libraries/utils/get-icon-data.html#example
export default defineComponent({
  name: 'Devicon',
  props: {
    name: {
      type: String,
      required: true
    },
    plain: {
      type: Boolean,
      default: false
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
    const iconsSet = props.plain ? deviconPlainIcons : deviconIcons
    const iconData = getIconData(iconsSet, props.name)
    if (!iconData) {
      console.warn(`<devicon name="${props.name}"> is missing`)
      return () => h('span', { class: 'divicon' })
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
        class: 'divicon',
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
