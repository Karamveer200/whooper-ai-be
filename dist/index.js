import 'dotenv/config';
import { createApp } from './app.js';
const app = createApp();
// Local dev only — Vercel runs the default export as a serverless function
if (process.env.VERCEL !== '1') {
    const PORT = Number(process.env.PORT) || 4001;
    app.listen(PORT, () => {
        console.log(`Whopper AI Service running on http://localhost:${PORT}`);
    });
}
export default app;
