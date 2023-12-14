import * as lodash from 'lodash'
import graphql from '../services/graphql'
import { query as gqlQuery } from 'gql-query-builder'
import { GITHUB_TOKEN } from '../constants'
import { GitHubSchemas } from '../../schemas'

export interface IGitHubQueryField<T = any> {
  field?: (object | string) | (() => object | string)
  fields?: Array<object | string> | (() => Array<object | string>)
  transformer(data: any): T
}

type IGitHubSchema = typeof GitHubSchemas
type IGitHubSchemasKeys = keyof IGitHubSchema

export default async <T extends IGitHubSchemasKeys[]>(
  username: string,
  keys: T
): Promise<{ [K in T[number]]: ReturnType<IGitHubSchema[K]['transformer']> }> => {
  const uniqueKeys = lodash.uniq(keys)
  // https://github.com/atulmy/gql-query-builder
  const queryDocument = gqlQuery(
    {
      operation: 'user',
      variables: { login: { value: username, required: true } },
      fields: uniqueKeys.reduce((arr, key) => {
        const found = GitHubSchemas[key]
        const field = typeof found?.field === 'function' ? found.field() : found?.field
        const fields = typeof found?.fields === 'function' ? found.fields() : found?.fields ?? []
        return field ? [...arr, field] : [...arr, ...fields]
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
  const resultData = {} as any
  uniqueKeys.forEach((key) => {
    if (GitHubSchemas[key]) {
      resultData[key] = GitHubSchemas[key].transformer(originalData.user)
    }
  })

  // console.log('github store data', { originalData, resultData })
  return resultData
}
