import axios from '../services/axios'

// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
export const fetchNpmPackages = async (maintainer: string) => {
  const response = await axios.get(`https://registry.npmjs.com/-/v1/search?text=maintainer:${maintainer}`)
  return response.data.objects
}

// https://github.com/npm/registry/blob/master/docs/download-counts.md
export const fetchNpmPackageDownloads = async (packageName: string) => {
  const now = new Date()
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const response = await axios.get(`https://api.npmjs.org/downloads/point/2015-01-10:${today}/${packageName}`)
  return response.data
}

// TODO: ...
