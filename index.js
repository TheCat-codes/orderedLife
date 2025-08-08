import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { router } from './routes/Routes.js';

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
dotenv.config()

app.use('/', router)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('http://localhost:' + PORT)
})