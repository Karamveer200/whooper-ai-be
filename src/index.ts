import 'dotenv/config'
import { createApp } from './app.js'

const app = createApp()
const PORT = Number(process.env.PORT) || 4001

app.listen(PORT, () => {
  console.log(`Whopper AI Service running on http://localhost:${PORT}`)
})
