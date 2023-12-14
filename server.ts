import * as http from 'node:http'
import { render } from './app/index'
import { HttpStatus, isHttpError } from './app/error'

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url!, `http://${request.headers.host}`)

  try {
    const now = new Date()
    const rendered = await render(url.searchParams)
    const renderTime = ((Date.now() - now.getTime()) / 1000).toFixed(2)
    console.info('🔹 [render:done]', `${renderTime}s`, '|', now.toLocaleString(), '|', url.search)
    response.statusCode = 200
    rendered.headers.forEach((value, key) => response.setHeader(key, value))
    response.end(rendered.result)
  } catch (error) {
    console.warn('🔸 [render:error]', `"${url.search || '-'}"`, '|', error)
    const message = error instanceof Error ? error.message : String(error) || 'Unknown error'
    const stack = error instanceof Error ? error.stack?.split('\n') : String(error)
    response.statusCode = isHttpError(error) ? error.statusCode : HttpStatus.INTERNAL_SERVER_ERROR
    response.end(JSON.stringify({ message, stack }))
  }
})

server.listen(3000, () => {
  console.info(`[README.vue] Running at http://localhost:3000 | ${new Date().toLocaleString()}`)
})
