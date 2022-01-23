export type Interface<T extends Record<string, () => any>> = {
  [K in keyof T]: ReturnType<T[K]>
}

export enum GitHubStoreFields {
  // https://docs.github.com/en/graphql/reference/objects#user
  Userinfo = 'userinfo', // IUserinfo
  // https://docs.github.com/en/graphql/reference/objects#followingconnection
  FollowingCount = 'following_count', // number
  // https://docs.github.com/en/graphql/reference/objects#followerconnection
  FollowersCount = 'followers_count', // number
  // https://docs.github.com/en/graphql/reference/objects#repositoryconnection
  RepositoriesContributedToCount = 'repositories_contributed_to_count', // number
  // https://docs.github.com/en/graphql/reference/objects#pullrequestconnection
  PullRequestsCount = 'pull_requests_count', // number
  // https://docs.github.com/en/graphql/reference/objects#issueconnection
  IssuesCount = 'issues_count', // number
  // https://docs.github.com/en/graphql/reference/objects#gistconnection
  GistsCount = 'gists_count', // number
  // https://docs.github.com/en/graphql/reference/objects#organizationconnection
  OrganizationsCount = 'organizations_count', // number
  // https://docs.github.com/en/graphql/reference/objects#sponsorconnection
  Sponsors = 'sponsors', // number // Array<ISponsor>
  SponsorsCount = 'sponsors_count', // number
  // https://docs.github.com/en/graphql/reference/objects#repositoryconnection
  Repositories = 'repositories', // Array<IRepository>
  RepositoriesCount = 'repositories_count', // number
  // https://docs.github.com/en/graphql/reference/objects#language
  RepositoriesLanguages = 'repositories_languages', //  Array<IRepositoryLanguage>
  // https://docs.github.com/en/graphql/reference/objects#contributioncalendar
  Contributions = 'contributions'
}

export type IUserinfo = Interface<typeof Userinfo>
export const Userinfo = Object.freeze({
  login: String,
  url: String,
  name: String,
  bio: String,
  company: String,
  location: String,
  twitterUsername: String,
  avatarUrl: String,
  websiteUrl: String,
  isDeveloperProgramMember: Boolean
})

export type ISponsor = Interface<typeof Sponsor>
export const Sponsor = Object.freeze({
  login: String,
  name: String,
  url: String,
  avatarUrl: String,
  websiteUrl: String
})

export type IRepository = Interface<typeof Repository>
export const Repository = Object.freeze({
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

export type IRepositoryLanguage = {
  repository: string
  languages: Array<{
    size: number
    color: string
    name: string
  }>
}

export type IContributions = {
  totalContributions: number
  colors: Array<string>
  weeks: Array<{
    firstDay: string
    contributionDays: Array<{
      color: string
      weekday: string
      date: string
      contributionCount: number
    }>
  }>
}
