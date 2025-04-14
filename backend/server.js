import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoute.js'
import sellerRouter from './routes/sellerRoute.js'
import connectCloudinary from './configs/cloudinary.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import addressRouter from './routes/addressRoute.js'
import orderRouter from './routes/orderRoute.js'

import bodyParser from 'body-parser'; // <-- Missing import
import { stripeWebHooks } from './controllers/orderController.js'; // <-- Missing import

const app = express()
const PORT = process.env.PORT || 4000

await connectDB()
await connectCloudinary()

const allowedOrigins = ['http://localhost:5173', 'https://green-cart-pi.vercel.app']

// Webhook route should be defined before other routes
app.post('/api/order/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebHooks);

app.use(cookieParser())
app.use(express.json())

// ✅ Apply CORS globally
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.get('/', (req, res) => {
  res.send("API working")
})

app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
