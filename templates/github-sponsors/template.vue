<template>
  <div class="main" :style="{ '--gap': `${gap}px`, '--size': `${size}px` }">
    <div class="sponsors">
      <div class="item" v-for="(sponsor, index) in sponsors.slice(0, count)" :key="index">
        <div class="avatar" :style="{ backgroundImage: `url(${sponsor.avatarUrl})` }"></div>
        <p class="name" v-if="!hideName">{{ sponsor.name }}</p>
      </div>
      <div class="item" key="sponsors">
        <div class="sponsor">
          <span v-if="sponsors_count - count > 0" class="count">
            + {{ sponsors_count - count }}
          </span>
          <simple-icons v-else slug="githubsponsors" class="icon" />
        </div>
        <p class="name" v-if="!hideName">Be Sponsor</p>
      </div>
    </div>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubSponsors',
    defaultCacheAge: 60 * 60 * 2, // default 2 hours cache
    props: {
      username: {
        type: String,
        required: true
      },
      hideName: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 15
      },
      size: {
        type: Number,
        default: 48
      },
      gap: {
        type: Number,
        default: 24
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

      const { sponsors_count, sponsors } = await $ctx.store.github(props.username, [
        'sponsors_count',
        'sponsors'
      ])

      return { sponsors_count, sponsors }
    }
  })
</script>

<style>
  .main {
    padding: var(--gap);
    font: 14px 'Segoe UI', Ubuntu, Sans-Serif;
  }

  .sponsors {
    display: flex;
  }

  .sponsors .item {
    width: var(--size);
    margin-right: var(--gap);
  }

  .sponsors .avatar,
  .sponsors .sponsor {
    width: var(--size);
    height: var(--size);
    border-radius: 1px;
    overflow: hidden;
    background-size: contain;
  }

  .sponsors .sponsor {
    color: #ea4aaa;
    border: 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sponsors .sponsor .count {
    font-weight: bold;
    font-size: 16px;
  }
</style>
