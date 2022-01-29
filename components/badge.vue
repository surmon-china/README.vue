<template>
  <span class="badge">TODO</span>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'Badge',
    props: {
      size: {
        type: Number,
        default: 18
      }
    },
    setup(props) {}
  })
</script>
