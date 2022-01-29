<template>
  <div class="main" :class="theme" :style="background ? { backgroundColor: background } : {}">
    <div class="progress">
      <span
        class="item"
        :class="lang.name"
        :style="{ backgroundColor: lang.color, width: `${lang.percentage}%` }"
        v-for="lang in topLanguages"
        :key="lang.name"
      ></span>
    </div>
    <div class="languages" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div class="item" v-for="lang in topLanguages" :key="lang.name">
        <span
          class="legend"
          :style="{
            width: `${legendSize}px`,
            backgroundColor: lang.color
          }"
        ></span>
        <simple-icons v-if="!hideIcon" class="icon" :slug="getIconSlug(lang.name)" />
        <span class="name">{{ lang.name }}</span>
        <span class="percentage">{{ lang.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  // https://github.com/simple-icons/simple-icons/blob/develop/slugs.md
  const simpleIconSlugMap = new Map([
    ['Vue', 'vuedotjs'],
    ['HTML', 'html5'],
    ['CSS', 'css3'],
    ['SASS', 'sass'],
    ['SCSS', 'sass'],
    ['Shell', 'powershell'],
    ['Objective-C', 'apple']
  ])

  export default defineComponent({
    name: 'GitHubTopLanguages',
    defaultCacheAge: 60 * 60 * 24, // default 24 hours cache
    props: {
      username: {
        type: String,
        required: true
      },
      excludeRepos: {
        type: Array,
        default: () => []
      },
      count: {
        type: Number,
        default: 15
      },
      columns: {
        type: Number,
        default: 5
      },
      theme: {
        type: String,
        default: 'light'
      },
      background: {
        type: String,
        required: false
      },
      hideIcon: {
        type: Boolean,
        default: false
      },
      legendSize: {
        type: Number,
        default: 4
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

      const data = await $ctx.store.github(props.username, ['repositories_languages'])
      const nodes = data.repositories_languages
        .filter((item) => {
          return !props.excludeRepos.includes(item.repository) && item.languages.length > 0
        })
        .sort((a, b) => b.size - a.size)

      const dataObject = nodes
        .reduce((acc, curr) => curr.languages.concat(acc), [])
        .reduce((acc, prev) => {
          let langSize = prev.size
          if (acc[prev.name] && prev.name === acc[prev.name].name) {
            langSize = prev.size + acc[prev.name].size
          }

          return {
            ...acc,
            [prev.name]: {
              name: prev.name,
              color: prev.color,
              size: langSize
            }
          }
        }, {})

      const dataArray = Object.values(dataObject).sort((a, b) => b.size - a.size)
      const totalSize = dataArray.reduce((acc, item) => acc + item.size, 0)
      const topLanguages = dataArray
        .map((item) => ({
          ...item,
          percentage: Number(((item.size / totalSize) * 100).toFixed(2))
        }))
        .slice(0, props.count)

      const getIconSlug = (langName) => {
        return simpleIconSlugMap.get(langName) || langName.toLocaleLowerCase()
      }

      return { topLanguages, getIconSlug }
    }
  })
</script>

<style>
  .main {
    --gap: 24px;
    --progress-size: 13px;
    --language-row-gap: 24px;
    padding: var(--gap);
    border: 1px solid;
    font: 14px 'Segoe UI', Ubuntu, Sans-Serif;
  }

  .main.light {
    background-color: #fff;
    border-color: #d0d7de;
    color: #27292a;
  }
  .main.dark {
    background-color: #22272ecc;
    border-color: #444c56;
    color: #dbdbdb;
  }

  .progress {
    display: flex;
    margin-bottom: var(--gap);
    width: 100%;
    height: var(--progress-size);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress .item {
    height: 100%;
  }

  .languages {
    display: grid;
    grid-row-gap: var(--language-row-gap);
  }

  .languages .item {
    display: flex;
    align-items: center;
  }

  .languages .legend {
    width: 4px;
    height: 1em;
    margin-right: 0.5em;
    border-radius: 1px;
  }
  .languages .item .icon {
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
    border-radius: 2px;
  }
  .languages .item .name {
    margin-right: 0.3em;
  }
  .languages .item .percentage {
    font-size: 90%;
    color: #767f89;
  }
</style>
