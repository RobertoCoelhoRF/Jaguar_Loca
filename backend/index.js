require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const express = require('express')
const cors = require('cors')

const app = express()

// Middlewares
// Allow requests from the frontend dev server (Vite)
// Aceita ambas as portas: 3000 (npm run dev:frontend) e 5173 (vite frontend direto)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS bloqueado'))
    }
  }
}))
app.use(express.json())
const path = require('path')
// Serve uploaded files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
const authRoutes = require('./src/routes/auth.routes')
app.use('/auth', authRoutes)

// admin routes
const adminRoutes = require('./src/routes/admin.routes')
app.use('/admin', adminRoutes)

// public vehicles listing
const veiculosRoutes = require('./src/routes/veiculos.routes')
app.use('/veiculos', veiculosRoutes)

// reservas routes
const reservaRoutes = require('./src/routes/reserva.routes')
app.use('/reservas', reservaRoutes)

// Health
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }))

const PORT = process.env.PORT || 4000
// Error handler (last middleware) - logs error and returns JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err)
  // multer errors have name 'MulterError'
  if (err && err.name === 'MulterError') return res.status(400).json({ error: err.message })
  if (err && err.message && err.message.startsWith('Tipo de arquivo inválido')) return res.status(400).json({ error: err.message })
  res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
