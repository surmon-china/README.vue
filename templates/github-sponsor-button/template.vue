<template>
  <div
    class="sponsor"
    :class="lineStyle ? 'line' : 'fill'"
    :style="{ borderRadius: `${radius}px` }"
  >
    <simple-icons class="icon" slug="githubsponsors" :color="lineStyle ? '#ea4aaa' : 'white'" />
    <span class="text">{{ text }}</span>
    <span class="count">{{ sponsors_count }}</span>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubSponsorButton',
    props: {
      username: {
        type: String,
        required: true
      },
      text: {
        type: String,
        default: 'Sponsor Me'
      },
      radius: {
        type: Number,
        default: 2
      },
      lineStyle: {
        type: Boolean,
        default: false
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

      const { sponsors_count } = await $ctx.store.github(props.username, ['sponsors_count'])
      return { sponsors_count }
    }
  })
</script>

<style>
  .sponsor {
    --color: #ea4aaa;
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
    font-family: 'Segoe UI', Ubuntu, Sans-Serif;
    font-weight: bold;
  }

  .sponsor.fill {
    color: white;
    background-color: var(--color);
  }

  .sponsor.line {
    color: var(--color);
    border: 1px solid;
  }

  .sponsor .icon,
  .sponsor .text,
  .sponsor .count {
    margin: 0 0.5em;
  }

  .sponsor .count {
    font-size: 16px;
  }
</style>
