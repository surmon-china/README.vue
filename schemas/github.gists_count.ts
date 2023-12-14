import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#gistconnection
export type IGitHubGistsCount = number

export default defineGitHubQueryField<IGitHubGistsCount>({
  field: { gists: ['totalCount'] },
  transformer: (data) => data.gists.totalCount
})
