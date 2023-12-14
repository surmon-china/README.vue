import { defineGitHubQueryField } from './helper'
import { githubRepositoriesVariables } from './github.repositories'

// https://docs.github.com/en/graphql/reference/objects#repositoryconnection
export type IGitHubRepositoriesCount = number

export default defineGitHubQueryField<IGitHubRepositoriesCount>({
  field: {
    operation: 'repositories',
    variables: githubRepositoriesVariables,
    fields: ['totalCount']
  },
  transformer: (data) => {
    return data.repositories.totalCount
  }
})
