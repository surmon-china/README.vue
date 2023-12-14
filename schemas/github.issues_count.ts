import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#issueconnection
export type IGitHubIssuesCount = number

export default defineGitHubQueryField<IGitHubIssuesCount>({
  field: { issues: ['totalCount'] },
  transformer: (data) => data.issues.totalCount
})
