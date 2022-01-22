<template>
  <span class="button">button</span>
</template>

<script>
  import { defineComponent } from 'vue'
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
