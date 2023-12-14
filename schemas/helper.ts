import { IGitHubQueryField } from '../app/stores/github'

export const defineGitHubQueryField = <T = any>(v: IGitHubQueryField<T>): IGitHubQueryField<T> => v

export type Interface<T extends Record<string, () => any>> = {
  [K in keyof T]: ReturnType<T[K]>
}
