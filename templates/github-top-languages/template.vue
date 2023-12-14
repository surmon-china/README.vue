<script setup lang="ts">
  import validator from 'validator'
  import { defineOptions } from 'vue'
  import { Devicon } from '@components'
  import { github } from '@stores'

  defineOptions({
    config: {
      // default 24 hours cache
      defaultCacheSeconds: 60 * 60 * 24
    }
  })

  const props = defineProps({
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
      default: 12,
      converter: (value) => Number(value),
      validator: (value) => validator.isInt(String(value))
    },
    columns: {
      type: Number,
      default: 4,
      converter: (value) => Number(value),
      validator: (value) => validator.isInt(String(value))
    },
    rowGap: {
      type: Number,
      default: 24,
      converter: (value) => Number(value),
      validator: (value) => validator.isInt(String(value))
    },
    columnGap: {
      type: Number,
      default: 28,
      converter: (value) => Number(value),
      validator: (value) => validator.isInt(String(value))
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value: string) => validator.isIn(value, ['light, dark'])
    },
    background: {
      type: String,
      required: false,
      validator: (value: string) => {
        return (
          validator.isHexColor(value) ||
          validator.isRgbColor(value) ||
          validator.isHSL(value) ||
          value === 'transparent'
        )
      }
    },
    hideIcon: {
      type: Boolean,
      default: false,
      converter: (value) => JSON.parse(value),
      validator: (value) => validator.isBoolean(String(value))
    },
    legendSize: {
      type: Number,
      default: 4,
      converter: (value) => Number(value),
      validator: (value) => validator.isInt(String(value))
    }
  })

  if (!props.username) {
    throw `Invalid username!`
  }

  // @ts-expect-error
  const result = await github(props.username, ['repositories_languages'])
  const filteredRepositories = result.repositories_languages.filter(
    (item) => !props.excludeRepos.includes(item.repository) && item.languages.length > 0
  )

  interface LanguagesMap {
    [language: string]: {
      name: string
      color: string
      size: number
    }
  }

  const languagesMap: LanguagesMap = filteredRepositories
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

  const dataArray = Object.values(languagesMap).sort((a, b) => b.size - a.size)
  const totalSize = dataArray.reduce((acc, item) => acc + item.size, 0)
  const topLanguages = dataArray
    .map((item) => ({
      ...item,
      percentage: Number(((item.size / totalSize) * 100).toFixed(2))
    }))
    .slice(0, props.count)

  // https://devicon.dev/
  const plainIconLanguages = ['Less']

  const devIconNameMap = new Map([
    ['Vue', 'vuejs'],
    ['HTML', 'html5'],
    ['CSS', 'css3'],
    ['SASS', 'sass'],
    ['SCSS', 'sass'],
    ['Shell', 'bash'],
    ['Less', 'less-wordmark'],
    ['Objective-C', 'xcode']
  ])

  const getLangIconName = (langName) => {
    return devIconNameMap.get(langName) || langName.toLocaleLowerCase()
  }
</script>

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
    <div
      class="languages"
      :style="{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridRowGap: `${rowGap}px`,
        gridColumnGap: `${columnGap}px`
      }"
    >
      <div class="item" v-for="lang in topLanguages" :key="lang.name">
        <span
          class="legend"
          :style="{
            width: `${legendSize}px`,
            backgroundColor: lang.color
          }"
        ></span>
        <Devicon
          v-if="!hideIcon"
          class="icon"
          :name="getLangIconName(lang.name)"
          :plain="plainIconLanguages.includes(lang.name)"
        />
        <span class="name">{{ lang.name }}</span>
        <span class="percentage">{{ lang.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .main {
    --gap: 24px;
    --progress-size: 13px;
    --language-row-gap: 24px;
    padding: var(--gap);
    border: 1px solid;
    font-size: 13px;
    font-family:
      ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;

    &.light {
      background-color: #fff;
      border-color: #d0d7de;
      color: #27292a;
    }
    &.dark {
      background-color: #22272ecc;
      border-color: #444c56;
      color: #dbdbdb;
    }
  }

  .progress {
    display: flex;
    margin-bottom: var(--gap);
    width: 100%;
    height: var(--progress-size);
    border-radius: 2px;
    overflow: hidden;

    .item {
      height: 100%;
    }
  }

  .languages {
    display: grid;

    .item {
      display: flex;
      align-items: center;

      .icon {
        width: 1em;
        height: 1em;
        margin-right: 0.5em;
        border-radius: 2px;
      }
      .name {
        margin-right: 0.3em;
        white-space: nowrap;
      }
      .percentage {
        font-size: 90%;
        color: #767f89;
      }
    }

    .legend {
      width: 4px;
      height: 1em;
      margin-right: 0.5em;
      border-radius: 1px;
    }
  }
</style>
