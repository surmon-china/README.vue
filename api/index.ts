// ❌ https://vercel.com/guides/using-express-with-vercel
// ✅ https://vercel.com/docs/runtimes#official-runtimes/node-js/using-type-script-with-the-node-js-runtime
import type { VercelRequest, VercelResponse } from '@vercel/node'
export default function (req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}
