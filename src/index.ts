import path from 'path'
import fs from 'fs-extra'
import express from 'express'
import compression from 'compression'

const app = express()
app.use(express.json())
app.use(compression())
const templateNames = fs.readdirSync(path.resolve(__dirname, '..', 'templates'))

app.get('/', (req, res) => {
  res.send(fs.readJsonSync(path.resolve(__dirname, '..', 'package.json')))
})

app.get('/templates', (req, res) => {
  res.send(templateNames)
})

// app.get('/api', (req, res) => {
//   res.setHeader('Content-Type', 'text/html')
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
//   res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
// })

// app.get('/api/item/:slug', (req, res) => {
//   const { slug } = req.params
//   res.end(`Item: ${slug}`)
// })

// https://vercel.com/guides/using-express-with-vercel
export = app
