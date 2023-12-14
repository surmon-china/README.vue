import { defineGitHubQueryField } from './helper'

// https://docs.github.com/en/graphql/reference/objects#organization
export type IGitHubOrganizationsCount = number

export default defineGitHubQueryField<IGitHubOrganizationsCount>({
  field: { organizations: ['totalCount'] },
  transformer: (data) => data.organizations.totalCount
})
