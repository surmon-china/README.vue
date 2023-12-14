import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MARKETPLACE_JSON } from '../app/constants'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  return response.json(MARKETPLACE_JSON)
}
