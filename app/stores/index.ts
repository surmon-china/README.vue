import githubStore from './github'
import * as npmStore from './npm'

export const github = githubStore
export const npm = Object.freeze({
  package: npmStore.fetchNpmPackages,
  packageDownloads: npmStore.fetchNpmPackageDownloads
})

export default { github, npm }
