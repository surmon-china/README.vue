import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MARKETPLACE_JSON, TEMPLATE_IDS } from '../app/constants'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  return response.json({
    template_count: TEMPLATE_IDS.length,
    marketplace_count: MARKETPLACE_JSON.length,
    rendering_success_count_total: 0,
    rendering_failure_count_total: 0
  })
}
