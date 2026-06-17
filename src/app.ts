import express, { type Express } from 'express'
import cors from 'cors'
import { aiRouter } from './routes/ai.js'

export const createApp = (): Express => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'taskforge-ai-service' })
  })

  app.use('/', aiRouter)

  return app
}
