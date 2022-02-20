import type { VercelRequest, VercelResponse } from '@vercel/node'
import { TEMPLATES_NAME, MARKETPLACE_JSON } from '../app/constant'

export default function (request: VercelRequest, response: VercelResponse) {
  response.send({
    templates: TEMPLATES_NAME,
    marketplace: MARKETPLACE_JSON
  })
}
