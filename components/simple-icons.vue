<template>
  <span
    class="simple-icon"
    :class="icon ? 'icon' : 'text'"
    :style="{ '--color': iconColor }"
    v-html="icon?.svg || fallbackTextSVG"
  ></span>
</template>

<script>
  const { defineComponent, computed } = $ctx.vue
  export default defineComponent({
    name: 'SimpleIcons',
    props: {
      slug: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: false
      }
    },
    setup(props) {
      const icon = computed(() => $ctx.simpleIcons.Get(props.slug.toLowerCase()))
      const iconColor = computed(() => props.color || (icon.value ? `#${icon.value.hex}` : null))
      const fallbackTextSVG = `
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <text
            x="50%"
            y="50%"
            dominant-baseline="central"
            text-anchor="middle"
            font-weight="bold"
            font-size="28"
          >${props.slug[0].toUpperCase()}</text>
        </svg>
      `

      return {
        icon,
        iconColor,
        fallbackTextSVG
      }
    }
  })
</script>

<style>
  .simple-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .simple-icon.text {
  }

  .simple-icon > svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: var(--color, initial);
  }
</style>
