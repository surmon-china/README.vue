import { defineGitHubQueryField } from './helper'
import { githubSponsorsVariables } from './github.sponsors'

// https://docs.github.com/en/graphql/reference/objects#sponsorconnection
export type IGitHubSponsorsCount = number

export default defineGitHubQueryField<IGitHubSponsorsCount>({
  field: {
    operation: 'sponsors',
    variables: githubSponsorsVariables,
    fields: ['totalCount']
  },
  transformer: (data) => {
    return data.sponsors.totalCount
  }
})
