import githubUserInfo from './github.userinfo'
import githubSponsors from './github.sponsors'
import githubSponsorsCount from './github.sponsors_count'
import githubFollowingCount from './github.following_count'
import githubFollowersCount from './github.followers_count'
import githubIssuesCount from './github.issues_count'
import githubGistsCount from './github.gists_count'
import githubPullRequestsCount from './github.pull_requests_count'
import githubOrganizationsCount from './github.organizations_count'
import githubContributions from './github.contributions'
import githubRepositoriesContributedToCount from './github.repositories_contributed_to_count'
import githubRepositoriesCount from './github.repositories_count'
import githubRepositoriesLanguages from './github.repositories_languages'
import githubRepositories from './github.repositories'

export const GitHubSchemas = {
  userinfo: githubUserInfo,
  sponsors: githubSponsors,
  sponsors_count: githubSponsorsCount,
  following_count: githubFollowingCount,
  followers_count: githubFollowersCount,
  issues_count: githubIssuesCount,
  gists_count: githubGistsCount,
  pull_requests_count: githubPullRequestsCount,
  organizations_count: githubOrganizationsCount,
  contributions: githubContributions,
  repositories_contributed_to_count: githubRepositoriesContributedToCount,
  repositories_count: githubRepositoriesCount,
  repositories_languages: githubRepositoriesLanguages,
  repositories: githubRepositories
} as const

// TODO: Add NPM schemas
export const NpmSchemas = {
  packages: 'packages',
  package_downloads: 'package_downloads'
} as const
