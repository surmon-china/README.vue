import http from 'http'
import express, { RequestHandler } from 'express'
import compression from 'compression'
import indexAPI from '../api/index'
import templateAPI from '../api/template'
import renderAPI from '../api/render'

const app = express()
app.use(express.json())
app.use(compression())

app.get('/', indexAPI as any as RequestHandler)
app.get('/template', templateAPI as any as RequestHandler)
app.get('/render', renderAPI as any as RequestHandler)

const PORT = 8000
const server = http.createServer(app)

server.listen(PORT, () => {
  const infos = [
    `at ${new Date().toLocaleString()}`,
    `listening on ${JSON.stringify(server.address())}`
  ]
  console.info('[README.md]', `Run! ${infos.join(', ')}.`)
})
