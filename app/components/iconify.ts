// @ts-nocheck

import fs from 'fs'
import { defineComponent } from 'vue'
import { locate } from '@iconify/json'
import { getIconData, iconToSVG } from '@iconify/utils'

// https://iconify.design/docs/usage/svg/utils/
// https://iconify.design/docs/libraries/utils/
// https://github.com/iconify/icon-sets
export default defineComponent({
  name: 'Iconify',
  props: {
    set: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const iconSetFileName = locate(props.set)
    const iconSet = JSON.parse(fs.readFileSync(iconSetFileName, 'utf8'))
    const iconData = getIconData(iconSet, props.icon)
    if (!iconData) {
      throw new Error(`<iconify name="${props.icon}"> is missing`)
    }

    const svg = iconToSVG(iconData, {
      // ...
    })

    return () => svg
  }
})
