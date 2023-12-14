import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#followingconnection
export type IGitHubFollowingCount = number

export default defineGitHubQueryField<IGitHubFollowingCount>({
  field: { following: ['totalCount'] },
  transformer: (data) => data.following.totalCount
})
