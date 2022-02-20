<template>
  <div
    class="sponsor"
    :class="[lineStyle ? 'line' : 'fill', { animation }]"
    :style="{ borderRadius: `${radius}px` }"
  >
    <div class="spans" v-if="animation">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <simple-icons class="icon" slug="githubsponsors" :color="lineStyle ? '#ea4aaa' : 'white'" />
    <span class="text" :class="{ uppercase }">{{ text }}</span>
    <span class="dot">·</span>
    <span class="count">{{ sponsors_count }}</span>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubSponsorButton',
    defaultCacheAge: 60 * 60 * 2, // default 2 hours cache
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
      uppercase: {
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
    --icon-szie: 18px;
    --color: #ea4aaa;
    --animation-color: #ffffff;
  }
  .sponsor.line {
    --animation-color: #ea4aaa;
  }

  .sponsor {
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
    font-family: 'Segoe UI', Ubuntu, Sans-Serif;
    font-weight: bold;
    font-size: 16px;
  }

  .sponsor.fill {
    color: white;
    background-color: var(--color);
  }
  .sponsor.line {
    color: var(--color);
    border: 1px solid;
  }

  .sponsor .icon {
    width: var(--icon-szie);
    height: var(--icon-szie);
  }

  .sponsor .text {
    margin-right: 0.6em;
    margin-left: 0.8em;
    letter-spacing: 1px;
  }
  .sponsor .dot {
    margin-right: 0.6em;
  }

  .sponsor .text.uppercase {
    text-transform: uppercase;
  }

  .sponsor.animation {
    text-decoration: none;
  }
  .sponsor.animation.line {
    border: none;
    background-color: rgb(234 74 170 / 10%);
  }

  .sponsor.animation .spans span {
    position: absolute;
  }

  .sponsor.animation .spans span:nth-child(1) {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 2px;
    background: linear-gradient(to left, rgba(8, 20, 43, 0), var(--animation-color));
    animation: 2s animateTop linear infinite;
  }

  @keyframes animateTop {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .sponsor.animation .spans span:nth-child(2) {
    top: 0px;
    right: 0px;
    height: 100%;
    width: 2px;
    background: linear-gradient(to top, rgba(8, 20, 43, 0), var(--animation-color));
    animation: 2s animateRight linear -1s infinite;
  }

  @-webkit-keyframes animateRight {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(-100%);
    }
  }

  @keyframes animateRight {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(-100%);
    }
  }

  .sponsor.animation .spans span:nth-child(3) {
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, rgba(8, 20, 43, 0), var(--animation-color));
    animation: 2s animateBottom linear infinite;
  }

  @-webkit-keyframes animateBottom {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes animateBottom {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .sponsor.animation .spans span:nth-child(4) {
    top: 0px;
    left: 0px;
    height: 100%;
    width: 2px;
    background: linear-gradient(to bottom, rgba(8, 20, 43, 0), var(--animation-color));
    animation: 2s animateLeft linear -1s infinite;
  }

  @keyframes animateLeft {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
</style>
