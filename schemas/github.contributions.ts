import { defineGitHubQueryField } from './helper'

// https://stackoverflow.com/questions/18262288/finding-total-contributions-of-a-user-from-github-api
// https://docs.github.com/en/graphql/reference/objects#contributioncalendar
export interface IGitHubContributions {
  totalContributions: number
  colors: Array<string>
  weeks: Array<{
    firstDay: string
    contributionDays: Array<{
      color: string
      weekday: string
      date: string
      contributionCount: number
    }>
  }>
}

export default defineGitHubQueryField<IGitHubContributions>({
  transformer: (data) => data.contributionsCollection.contributionCalendar,
  field: {
    contributionsCollection: [
      {
        contributionCalendar: [
          'colors',
          'totalContributions',
          {
            weeks: [
              'firstDay',
              {
                contributionDays: ['color', 'contributionCount', 'date', 'weekday']
              }
            ]
          }
        ]
      }
    ]
  }
})
