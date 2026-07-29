import { createServer as createHttpServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { createServer as createViteServer } from 'vite'
import applyHandler from '../api/apply.js'

function loadEnv() {
  const envText = readFileSync(new URL('../.env', import.meta.url), 'utf8')

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separator = trimmed.indexOf('=')

    if (separator === -1) {
      continue
    }

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnv()

const vite = await createViteServer({
  appType: 'spa',
  server: { middlewareMode: true },
})

const server = createHttpServer(async (req, res) => {
  if (req.url?.startsWith('/api/apply')) {
    await applyHandler(req, res)
    return
  }

  vite.middlewares(req, res)
})

const port = Number(process.env.PORT || 5173)

server.listen(port, () => {
  console.log(`Local app running at http://localhost:${port}`)
  console.log('Serverless API mounted at /api/apply')
})
