<template>
  <span class="devicon" :style="{ '--color': iconColor }" v-html="iconSVG"></span>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'Devicon',
    props: {
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'original'
      },
      color: {
        type: String,
        required: false
      }
    },
    setup(props) {
      const icon = $ctx.devicon(props.name)
      const iconColor = props.color || (icon ? icon.color : null)
      const fallbackTextSVG = `
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          fill="var(--color, initial)"
        >
          <text
            x="50%"
            y="50%"
            dominant-baseline="central"
            text-anchor="middle"
            font-weight="bold"
            font-size="28"
          >${props.name[0].toUpperCase()}</text>
        </svg>
      `

      const iconSVG = icon?.svgs?.original || icon?.svgs?.[icon.versions.svg[0]] || fallbackTextSVG

      return {
        iconSVG,
        iconColor,
        fallbackTextSVG
      }
    }
  })
</script>

<style>
  .devicon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .devicon > svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
