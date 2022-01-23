<template>
  <div
    class="counter"
    :style="{
      backgroundColor: background,
      borderWidth: `${border}px`,
      fontSize: `${fontSize}px`,
      color
    }"
  >
    <span class="views" v-if="Boolean(prefix?.trim())">{{ prefix }}</span>
    <span class="count">{{ counter.value }}</span>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubReadmeViews',
    defaultCacheAge: 0,
    props: {
      username: {
        type: String,
        required: true
      },
      default: {
        type: Number,
        default: 0
      },
      prefix: {
        type: String,
        default: 'views'
      },
      fontSize: {
        type: Number,
        default: 14
      },
      color: {
        type: String,
        default: 'initial'
      },
      background: {
        type: String,
        default: 'transparent'
      },
      border: {
        type: Number,
        default: 1
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

      const counter = await $ctx.store.counter(`github-readme-${props.username}`, props.default)
      return { counter }
    }
  })
</script>

<style>
  .counter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    overflow: hidden;
    border-color: initial;
    border-style: solid;
    font-family: 'Segoe UI', Ubuntu, Sans-Serif;
  }

  .views {
    margin-right: 0.4em;
    opacity: 0.7;
  }

  .count {
    font-weight: bold;
  }
</style>
