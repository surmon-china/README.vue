import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#repositoryconnection
export type IGitHubRepositoriesContributedToCount = number

export default defineGitHubQueryField<IGitHubRepositoriesContributedToCount>({
  field: { repositoriesContributedTo: ['totalCount'] },
  transformer: (data) => data.repositoriesContributedTo.totalCount
})
