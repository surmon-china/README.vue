import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#pullrequestconnection
export type IGitHubPullRequestsCount = number

export default defineGitHubQueryField<IGitHubPullRequestsCount>({
  field: { pullRequests: ['totalCount'] },
  transformer: (data) => data.pullRequests.totalCount
})
