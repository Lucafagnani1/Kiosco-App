const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

const productosRouter = require('./routes/productos')
const authRouter = require('./routes/auth')
const pedidosRouter = require('./routes/pedidos')

app.use('/api/productos', productosRouter)
app.use('/api/auth', authRouter)
app.use('/api/pedidos', pedidosRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
})