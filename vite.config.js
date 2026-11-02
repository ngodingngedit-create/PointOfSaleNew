import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { processCheckout } from './api/checkout.js'
import { getCashiers } from './api/cashiers.js'
import { verifyCashierPin } from './api/login-pin.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'local-api-endpoints-middleware',
        configureServer(server) {
          // Endpoint: GET /api/cashiers
          server.middlewares.use('/api/cashiers', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method Not Allowed' }))
              return
            }
            try {
              const list = await getCashiers(env)
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(list))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })

          // Endpoint: POST /api/login-pin
          server.middlewares.use('/api/login-pin', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method Not Allowed' }))
              return
            }
            let rawBody = ''
            req.on('data', (chunk) => {
              rawBody += chunk
            })
            req.on('end', async () => {
              try {
                const body = rawBody ? JSON.parse(rawBody) : {}
                const result = await verifyCashierPin(body, env)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(result))
              } catch (err) {
                res.statusCode = err.statusCode || 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })

          // Endpoint: POST /api/checkout
          server.middlewares.use('/api/checkout', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method Not Allowed' }))
              return
            }

            let rawBody = ''
            req.on('data', (chunk) => {
              rawBody += chunk
            })
            req.on('end', async () => {
              try {
                const body = rawBody ? JSON.parse(rawBody) : {}
                const result = await processCheckout(body, env)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(result))
              } catch (err) {
                res.statusCode = err.statusCode || 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }))
              }
            })
          })
        },
      },
    ],
  }
})
