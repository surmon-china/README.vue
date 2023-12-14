import * as lodash from 'lodash'
import { defineGitHubQueryField, Interface } from './helper'

// https://docs.github.com/en/graphql/reference/objects#user
export type IUserinfo = Interface<typeof Userinfo>
export const Userinfo = Object.freeze({
  login: String,
  url: String,
  name: String,
  bio: String,
  company: String,
  location: String,
  avatarUrl: String,
  websiteUrl: String,
  isDeveloperProgramMember: Boolean,
  twitterUsername: String
})

export default defineGitHubQueryField<IUserinfo>({
  fields: Object.keys(Userinfo),
  transformer: (data) => lodash.pick(data, Object.keys(Userinfo)) as IUserinfo
})
