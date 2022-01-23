import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_SECONDS } from '../app/constant'
import { renderTemplate } from '../app/render'

export default function (request: VercelRequest, response: VercelResponse) {
  const { cache_seconds, ...queryParams } = request.query
  renderTemplate(queryParams)
    .then((result) => {
      const userOrTemplateCache = Number.isNaN(parseInt(cache_seconds as string))
        ? result.cacheAge
        : parseInt(cache_seconds as string)
      if (userOrTemplateCache === 0) {
        // disable cache
        response.setHeader('Cache-Control', `no-cache, max-age=0`)
      } else {
        // user cache > template cache > default cache
        const cacheSeconds = userOrTemplateCache || CACHE_SECONDS.ONE_DAY
        response.setHeader('Cache-Control', `public, max-age=${cacheSeconds}`)
      }
      response.setHeader('Content-Type', 'image/svg+xml')
      response.end(result.svg)
    })
    .catch((error) => {
      console.warn('Render error:', error)
      response.status(500).send({
        error: error?.message || String(error)
      })
    })
}
