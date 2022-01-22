<template>
  <div class="main">
    {{ data }}
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'GitHubTopLanguages',
    props: {
      username: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        default: 15
      },
      columns: {
        type: Number,
        default: 5
      }
    },
    async setup(props) {
      const data = await $store.github(props.username, ['userinfo'])

      return { data }
    }
  })
</script>

<style>
  .main {
    color: red;
  }
</style>
