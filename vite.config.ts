import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { chatComplete } from './api/_chat-core'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Serves POST /api/chat during `npm run dev` (Vite has no serverless functions),
// mirroring the Vercel api/chat.ts handler so the chatbot works locally too.
function devApiPlugin(env) {
  return {
    name: 'dev-api-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const { messages } = JSON.parse(body || '{}')
            const result = await chatComplete({
              groqApiKey: env.GROQ_API_KEY,
              groqModel: env.GROQ_MODEL,
              supabaseUrl: env.VITE_SUPABASE_URL,
              supabaseKey: env.VITE_SUPABASE_KEY,
              messages: messages ?? [],
            })
            res.end(JSON.stringify(result))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(e?.message ?? e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' = load ALL env vars (including non-VITE_ secrets like GROQ_API_KEY) for the dev middleware.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      devApiPlugin(env),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
