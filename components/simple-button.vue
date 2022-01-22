<template>
  <span class="button">button</span>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'SimpleButton',
    props: {
      size: {
        type: Number,
        default: 18
      }
    },
    setup(props) {}
  })
</script>
