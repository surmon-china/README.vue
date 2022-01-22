import lodash from 'lodash'
import { query as gqlQuery } from 'gql-query-builder'
import { GITHUB_TOKEN } from '../constant'
import { graphql } from '../axios'
import {
  GitHubStoreFields,
  Userinfo,
  IUserinfo,
  Sponsor,
  ISponsor,
  Repository,
  IRepository,
  IRepositoryLanguage
} from '../../schemas/github'

const sponsorsVariables = {
  sponsorsFirst: {
    name: 'first',
    value: 100
  }
}
const repositoriesVariables = {
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

const handlers: Array<{
  key: GitHubStoreFields
  fielder: () => any[]
  dataer: (data: any) => any
}> = [
  {
    key: GitHubStoreFields.Userinfo,
    fielder: () => Object.keys(Userinfo),
    dataer: (data) => lodash.pick(data, Object.keys(Userinfo)) as IUserinfo
  },
  {
    key: GitHubStoreFields.FollowingCount,
    fielder: () => [{ following: ['totalCount'] }],
    dataer: (data) => data.following.totalCount as number
  },
  {
    key: GitHubStoreFields.FollowersCount,
    fielder: () => [{ followers: ['totalCount'] }],
    dataer: (data) => data.followers.totalCount as number
  },
  {
    key: GitHubStoreFields.RepositoriesContributedToCount,
    fielder: () => [{ repositoriesContributedTo: ['totalCount'] }],
    dataer: (data) => data.repositoriesContributedTo.totalCount as number
  },
  {
    key: GitHubStoreFields.PullRequestsCount,
    fielder: () => [{ pullRequests: ['totalCount'] }],
    dataer: (data) => data.pullRequests.totalCount as number
  },
  {
    key: GitHubStoreFields.IssuesCount,
    fielder: () => [{ issues: ['totalCount'] }],
    dataer: (data) => data.issues.totalCount as number
  },
  {
    key: GitHubStoreFields.GistsCount,
    fielder: () => [{ gists: ['totalCount'] }],
    dataer: (data) => data.gists.totalCount as number
  },
  {
    key: GitHubStoreFields.OrganizationsCount,
    fielder: () => [{ organizations: ['totalCount'] }],
    dataer: (data) => data.organizations.totalCount as number
  },
  {
    key: GitHubStoreFields.SponsorsCount,
    dataer: (data) => data.sponsors.totalCount as number,
    fielder: () => [
      {
        operation: 'sponsors',
        variables: sponsorsVariables,
        fields: ['totalCount']
      }
    ]
  },
  {
    key: GitHubStoreFields.Sponsors,
    dataer: (data) => data.sponsors.edges.map((s) => s.node) as Array<ISponsor>,
    fielder: () => [
      {
        operation: 'sponsors',
        variables: sponsorsVariables,
        fields: [
          {
            edges: [
              {
                node: [
                  {
                    '... on User': Object.keys(Sponsor),
                    '... on Organization': Object.keys(Sponsor)
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: GitHubStoreFields.RepositoriesCount,
    dataer: (data) => data.repositories.totalCount as number,
    fielder: () => [
      {
        operation: 'repositories',
        variables: repositoriesVariables,
        fields: ['totalCount']
      }
    ]
  },
  {
    key: GitHubStoreFields.Repositories,
    dataer: (data) => {
      return data.repositories.nodes.map((repo) =>
        lodash.pick(repo, Object.keys(Repository))
      ) as Array<IRepository>
    },
    fielder: () => [
      {
        operation: 'repositories',
        variables: repositoriesVariables,
        fields: [
          {
            nodes: Object.keys(Repository)
          }
        ]
      }
    ]
  },
  {
    key: GitHubStoreFields.RepositoriesLanguages,
    dataer: (data) => {
      return data.repositories.nodes.map((repo) => ({
        repository: repo.name,
        languages: repo.languages.edges.map((lang) => ({
          size: lang.size,
          ...lang.node
        }))
      })) as Array<IRepositoryLanguage>
    },
    fielder: () => [
      {
        operation: 'repositories',
        variables: repositoriesVariables,
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
                    edges: [
                      'size',
                      {
                        node: ['color', 'name']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export default async (username: string, fields: GitHubStoreFields[]) => {
  const uniqueFields = lodash.uniq(fields)
  // https://github.com/atulmy/gql-query-builder
  const queryDocument = gqlQuery(
    {
      operation: 'user',
      variables: { login: { value: username, required: true } },
      fields: uniqueFields.reduce((arr, field) => {
        const fields = handlers.find((h) => h.key === field)?.fielder() || []
        return [...arr, ...fields]
      }, [])
    },
    null,
    {
      operationName: 'userInfo'
    }
  )

  // console.log('queryDocument', queryDocument)
  // https://docs.github.com/en/graphql/overview/explorer
  // https://docs.github.com/en/graphql/reference/objects#user
  const originalData = await graphql('https://api.github.com/graphql', queryDocument, GITHUB_TOKEN)
  const resultData = {}
  uniqueFields.forEach((field) => {
    const targetHandler = handlers.find((h) => h.key === field)
    if (targetHandler) {
      resultData[targetHandler.key] = targetHandler.dataer(originalData.user)
    }
  })

  // console.log('github store data', { originalData, resultData })
  return resultData
}
