import type { VercelRequest, VercelResponse } from '@vercel/node'
import { HttpStatus, isHttpError } from '../app/error'
import { render } from '../app'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const now = new Date()
    const url = new URL(request.url!, `http://${request.headers.host}`)
    const rendered = await render(url.searchParams)
    const renderTime = ((Date.now() - now.getTime()) / 1000).toFixed(2)
    console.info('🔹 [render:done]', `${renderTime}s`, '|', now.toLocaleString(), '|', url.search)
    rendered.headers.forEach((value, key) => response.setHeader(key, value))
    return response.end(rendered.result)
  } catch (error) {
    console.warn('🔸 [render:error]', error)
    const message = error instanceof Error ? error.message : String(error) || 'Unknown error'
    const stack = error instanceof Error ? error.stack?.split('\n') : String(error)
    const statusCode = isHttpError(error) ? error.statusCode : HttpStatus.INTERNAL_SERVER_ERROR
    return response.status(statusCode).json({ message, stack })
  }
}
