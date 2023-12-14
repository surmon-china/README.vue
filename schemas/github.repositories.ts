import * as lodash from 'lodash'
import { defineGitHubQueryField, Interface } from './helper'

// https://docs.github.com/en/graphql/reference/objects#repositoryconnection
export type IGitHubRepository = Interface<typeof GitHubRepository>
export const GitHubRepository = Object.freeze({
  url: String,
  name: String,
  description: String,
  homepageUrl: String,
  createdAt: String,
  isPrivate: Boolean,
  isArchived: Boolean,
  stargazerCount: Number,
  forkCount: Number
})

export const githubRepositoriesVariables = {
  reposFirst: {
    name: 'first',
    value: 100
  },
  reposFork: {
    name: 'isFork',
    value: false
  },
  reposOwnerAffiliations: {
    name: 'ownerAffiliations',
    value: 'OWNER',
    type: '[RepositoryAffiliation]'
  },
  reposOrderBy: {
    name: 'orderBy',
    value: { field: 'CREATED_AT', direction: 'DESC' },
    type: 'RepositoryOrder'
  }
}

export default defineGitHubQueryField<Array<IGitHubRepository>>({
  field: {
    operation: 'repositories',
    variables: githubRepositoriesVariables,
    fields: [{ nodes: Object.keys(GitHubRepository) }]
  },
  transformer: (data) => {
    return data.repositories.nodes.map((repo) => {
      return lodash.pick<IGitHubRepository>(repo, Object.keys(GitHubRepository))
    })
  }
})
