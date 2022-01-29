<template>
  <div class="main" :style="{ '--gap': `${gap}px`, '--size': `${size}px` }">
    <div class="calendar" :class="{ animation }">
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
    defaultCacheAge: 60 * 60 * 6, // default 6 hours cache
    props: {
      username: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 10
      },
      gap: {
        type: Number,
        default: 3
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

  @keyframes day-color {
    0% {
      background-color: #c008089c;
    }
    40% {
      background-color: rgba(0, 0, 255, 0.192);
    }
    50% {
      background-color: transparent;
    }
  }

  .calendar.animation .day {
    animation: day-color 0.7s infinite forwards;
  }
  .calendar.animation .day:nth-of-type(1) {
    animation-delay: 0.1s;
  }
  .calendar.animation .day:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  .calendar.animation .day:nth-of-type(3) {
    animation-delay: 0.3s;
  }
  .calendar.animation .day:nth-of-type(4) {
    animation-delay: 0.4s;
  }
  .calendar.animation .day:nth-of-type(5) {
    animation-delay: 0.5s;
  }
  .calendar.animation .day:nth-of-type(6) {
    animation-delay: 0.6s;
  }
  .calendar.animation .day:nth-of-type(7) {
    animation-delay: 0.7s;
  }

  .week {
    margin-right: var(--gap);
  }

  .day {
    display: block;
    width: var(--size);
    height: var(--size);
    margin-bottom: var(--gap);
    transition: background-color 0.2s;
  }
</style>
