import { defineGitHubQueryField, Interface } from './helper'

// https://docs.github.com/en/graphql/reference/objects#sponsorconnection
export type IGitHubSponsor = Interface<typeof GitHubSponsor>
export const GitHubSponsor = Object.freeze({
  login: String,
  name: String,
  url: String,
  avatarUrl: String,
  websiteUrl: String
})

export const githubSponsorsVariables = {
  sponsorsFirst: {
    name: 'first',
    value: 100
  }
}

export default defineGitHubQueryField<Array<IGitHubSponsor>>({
  transformer: (data) => data.sponsors.edges.map((s) => s.node),
  field: {
    operation: 'sponsors',
    variables: githubSponsorsVariables,
    fields: [
      {
        edges: [
          {
            node: [
              {
                '... on User': Object.keys(GitHubSponsor),
                '... on Organization': Object.keys(GitHubSponsor)
              }
            ]
          }
        ]
      }
    ]
  }
})
