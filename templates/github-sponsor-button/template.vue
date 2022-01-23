<template>
  <div
    class="sponsor"
    :class="lineStyle ? 'line' : 'fill'"
    :style="{ borderRadius: `${radius}px` }"
  >
    <simple-icons class="icon" slug="githubsponsors" :color="lineStyle ? '#ea4aaa' : 'white'" />
    <span class="text">{{ text }}</span>
    <span class="count">{{ sponsors_count }}</span>
    <div class="animation" v-if="animation"></div>
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
      },
      animation: {
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

  @keyframes scanLights {
    0% {
      opacity: 0;
      transform: translate(-60%, 50%) rotate(-60deg);
    }
    14% {
      opacity: 1;
      transform: translate(-40%, 50%) rotate(-60deg);
    }
    50% {
      opacity: 1;
      transform: translate(0%, 50%) rotate(-60deg);
    }
    100% {
      opacity: 0;
      transform: translate(20%, 50%) rotate(-60deg);
    }
  }

  .animation {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 30px;
    background-image: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );

    transition: all 0.2s;
    transform-origin: center center;
    transform: translate(-80%, 50%) rotate(-60deg);
    animation: scanLights 5s linear 1s infinite;
  }
</style>
