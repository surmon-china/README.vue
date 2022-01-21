// ❌ https://vercel.com/guides/using-express-with-vercel
// ✅ https://vercel.com/docs/runtimes#official-runtimes/node-js/using-type-script-with-the-node-js-runtime
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PACKAGE_JSON } from '../app/constant'

export default function (request: VercelRequest, response: VercelResponse) {
  response.send(PACKAGE_JSON)
}
