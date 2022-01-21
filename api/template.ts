import type { VercelRequest, VercelResponse } from '@vercel/node'
import { TEMPLATES_NAME } from '../app/constant'

export default function (request: VercelRequest, response: VercelResponse) {
  response.send(TEMPLATES_NAME)
}
