import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#followerconnection
export type IGitHubFollowersCount = number

export default defineGitHubQueryField<IGitHubFollowersCount>({
  field: { followers: ['totalCount'] },
  transformer: (data) => data.followers.totalCount
})
