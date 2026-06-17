import 'dotenv/config'
import express, { type Express } from 'express'
import cors from 'cors'
import { aiRouter } from './routes/ai.js'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'taskforge-ai-service' })
})

app.use('/', aiRouter)

// Local dev only — Vercel runs the default export as a serverless function
if (process.env.VERCEL !== '1') {
  const PORT = Number(process.env.PORT) || 4001
  app.listen(PORT, () => {
    console.log(`Whopper AI Service running on http://localhost:${PORT}`)
  })
}

export default app
