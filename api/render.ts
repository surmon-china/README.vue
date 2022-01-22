import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_SECONDS } from '../app/constant'
import { renderTemplate } from '../app/render'

export default function (request: VercelRequest, response: VercelResponse) {
  const { cache_seconds, ...queryParams } = request.query
  renderTemplate(queryParams)
    .then((svg) => {
      const cacheSeconds = Number.isNaN(parseInt(cache_seconds as string))
        ? CACHE_SECONDS.ONE_DAY
        : parseInt(cache_seconds as string)
      response.setHeader('Content-Type', 'image/svg+xml')
      response.setHeader('Cache-Control', `public, max-age=${cacheSeconds}`)
      response.end(svg)
    })
    .catch((error) => {
      console.warn('Render error:', error)
      response.status(500).send({
        error: error?.message || String(error)
      })
    })
}
