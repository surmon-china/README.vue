<template>
  <div class="main" :style="{ '--gap': `${gap}px`, '--size': `${size}px` }">
    <div class="calendar">
      <div class="week" v-for="(week, index) in contributions.weeks" :key="index">
        <div
          class="day"
          v-for="(day, i) in week.contributionDays"
          :key="i"
          :style="{ backgroundColor: day.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'GitHubContributionsCalendar',
    props: {
      username: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 12
      },
      gap: {
        type: Number,
        default: 4
      }
    },
    async setup(props) {
      if (!props.username) {
        throw `Invalid username!`
      }

      const { contributions } = await $ctx.store.github(props.username, ['contributions'])
      return { contributions }
    }
  })
</script>

<style>
  .main {
  }

  .calendar {
    width: 100%;
    display: flex;
  }

  .week {
    margin-right: var(--gap);
  }

  .day {
    display: block;
    width: var(--size);
    height: var(--size);
    margin-bottom: var(--gap);
  }
</style>
