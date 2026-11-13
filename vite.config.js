import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import cashierDirectory from './api/cashiers.js'
import cashierPinLogin from './api/login-pin.js'
import checkout from './api/checkout.js'
import session from './api/session.js'
import logout from './api/logout.js'
import adminLogin from './api/admin/login.js'
import adminCashierPins from './api/admin/cashier-pins.js'

const API_HANDLERS = new Map([
  ['/api/cashiers', cashierDirectory],
  ['/api/login-pin', cashierPinLogin],
  ['/api/checkout', checkout],
  ['/api/session', session],
  ['/api/logout', logout],
  ['/api/admin/login', adminLogin],
  ['/api/admin/cashier-pins', adminCashierPins],
])

function apiMiddleware(env) {
  return async (req, res, next) => {
    let pathname
    try { pathname = new URL(req.url || '/', 'http://vite.local').pathname } catch { return next() }
    const handler = API_HANDLERS.get(pathname)
    if (!handler) return next()

    res.status = (statusCode) => { res.statusCode = statusCode; return res }
    res.json = (body) => {
      if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8')
      return res.end(JSON.stringify(body))
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      let rawBody = ''
      try {
        for await (const chunk of req) {
          rawBody += chunk
          if (Buffer.byteLength(rawBody, 'utf8') > 16 * 1024) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            return res.end(JSON.stringify({ error: 'Request body is too large' }))
          }
        }
        req.body = rawBody ? JSON.parse(rawBody) : {}
      } catch {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        return res.end(JSON.stringify({ error: 'Invalid JSON request body' }))
      }
    }

    try {
      await handler(req, res, env)
    } catch {
      if (!res.writableEnded) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify({ error: 'API is temporarily unavailable' }))
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'secure-local-api-endpoints',
        configureServer(server) {
          server.middlewares.use(apiMiddleware(env))
        },
      },
    ],
  }
})
