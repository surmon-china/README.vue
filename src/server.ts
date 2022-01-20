import http from 'http'
import app from './app'

const PORT = 8000
const server = http.createServer(app)

server.listen(PORT, () => {
  const infos = [
    `at ${new Date().toLocaleString()}`,
    `listening on ${JSON.stringify(server.address())}`
  ]
  console.info('[README.md]', `Run! ${infos.join(', ')}.`)
})
