<template>
  <div class="main">
    <p v-for="item in count" :key="item">{{ item }}</p>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'GitHubTopLanguages',
    setup() {
      return {
        count: 10
      }
    }
  })
</script>

<style>
  .main {
    color: red;
  }
</style>
