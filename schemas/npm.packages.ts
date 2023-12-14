export type NpmPackages = Array<NpmPackage>

export interface NpmPackage {
  package: {
    name: string
    scope: string
    version: string
    description: string
    keywords: string[]
    date: string
    publisher: {
      username: string
      email: string
    }
    maintainers: Array<{
      username: string
      email: string
    }>
    links: {
      [key: string]: string
    }
    author: {
      [key: string]: any
    }
  }
  flags: {
    insecure: number
  }
  score: {
    final: number
    detail: {
      quality: number
      popularity: number
      maintenance: number
    }
  }
  searchScore: number
}
