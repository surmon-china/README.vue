<template>
  <div class="main">
    {{ data }}
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubProfile',
    props: {
      username: {
        type: String,
        required: true
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

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
