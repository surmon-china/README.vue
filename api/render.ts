import type { VercelRequest, VercelResponse } from '@vercel/node'
import { renderTemplate } from '../app/render'

export default function (request: VercelRequest, response: VercelResponse) {
  renderTemplate(request.query)
    .then((svg) => {
      response.setHeader('Content-Type', 'image/svg+xml')
      response.send(svg)
    })
    .catch((error) => {
      const message = error?.message || String(error)
      response.status(500)
      response.send({
        error: message
      })
    })
}
