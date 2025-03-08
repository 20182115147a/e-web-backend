import express  from 'express'
const app = express()
const port = 3000
import routes from './app/routes/index.js'
import mongoose from 'mongoose'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path, {dirname } from 'path'
const corsOptions = {
  origin: 'http://localhost:5173'
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
mongoose.connect('mongodb://localhost:27017/shopee_clone_dev')
app.use(cors(corsOptions))
app.use(express.json());
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')))
routes(app)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})