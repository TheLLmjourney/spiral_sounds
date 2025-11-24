import express from 'express'
import session from 'express-session'
import { productRouter } from './routes/products.js'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'

const app = express()
const PORT = 8000
const secret = process.env.SPIRAL_SESSION_SECRET || 'default-secret-key'

// app.use(cors())
app.use(express.json())

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}))


app.use(express.static('public'))

app.use('/api/products', productRouter)

app.use('/api/auth/me', meRouter)

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
}) 