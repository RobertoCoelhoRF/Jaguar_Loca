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

// Routes
const authRoutes = require('./src/routes/auth.routes')
app.use('/auth', authRoutes)

// admin routes
const adminRoutes = require('./src/routes/admin.routes')
app.use('/admin', adminRoutes)

// serve uploaded files
const path = require('path')
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

// public veiculos route
const vehiclesRoutes = require('./src/routes/vehicles.routes')
app.use('/veiculos', vehiclesRoutes)

// Health
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})

// ensure uploads dir exists
const fs = require('fs')
const uploadsDir = path.resolve(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
