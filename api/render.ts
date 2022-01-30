import type { VercelRequest, VercelResponse } from '@vercel/node'
import { renderTemplate } from '../app/render'

export default function (request: VercelRequest, response: VercelResponse) {
  const { cache_seconds, ...queryParams } = request.query
  const now = new Date()
  console.info('Render run:', [now.toLocaleString(), request.url].join(' | '))
  renderTemplate(queryParams)
    .then((result) => {
      // user cache > component default cache > global 1 day cache
      const queryCacheSeconds = parseInt(cache_seconds as string)
      const userOrTemplateCache = Number.isNaN(queryCacheSeconds)
        ? result.cacheAge
        : queryCacheSeconds
      const cacheSeconds = userOrTemplateCache ?? 60 * 60 * 24

      // set cache
      if (cacheSeconds === 0) {
        // disable cache
        response.setHeader('Cache-Control', `no-cache, max-age=0`)
      } else {
        // cache age
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
    .finally(() => {
      console.info(
        'Render done:',
        [((Date.now() - now.getTime()) / 1000).toFixed(2) + 's', request.url].join(' | ')
      )
    })
}
