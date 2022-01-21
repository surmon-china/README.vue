import type { VercelRequest, VercelResponse } from '@vercel/node'
import { renderTemplate } from '../app/render'

export default function (request: VercelRequest, response: VercelResponse) {
  renderTemplate(request.query)
    .then((svg) => {
      response.setHeader('Content-Type', 'image/svg+xml').end(svg)
    })
    .catch((error) => {
      response.status(500).send({
        error: error?.message || String(error)
      })
    })
}
