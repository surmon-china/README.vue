import { defineGitHubQueryField } from './helper'
import { githubRepositoriesVariables } from './github.repositories'

// https://docs.github.com/en/graphql/reference/objects#language
export interface IGitHubRepositoryLanguage {
  repository: string
  languages: Array<{
    size: number
    color: string
    name: string
  }>
}

export default defineGitHubQueryField<Array<IGitHubRepositoryLanguage>>({
  field: {
    operation: 'repositories',
    variables: githubRepositoriesVariables,
    fields: [
      {
        nodes: [
          'name',
          {
            operation: 'languages',
            variables: {
              languageFirst: {
                name: 'first',
                value: 10
              },
              languageOrderBy: {
                name: 'orderBy',
                type: 'LanguageOrder',
                value: { field: 'SIZE', direction: 'DESC' }
              }
            },
            fields: [
              {
                edges: ['size', { node: ['color', 'name'] }]
              }
            ]
          }
        ]
      }
    ]
  },
  transformer: (data) => {
    return data.repositories.nodes.map((repo) => ({
      repository: repo.name,
      languages: repo.languages.edges.map((lang) => ({
        size: lang.size,
        ...lang.node
      }))
    }))
  }
})
