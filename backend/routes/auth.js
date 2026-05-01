const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('maxishop2024', 10)

router.post('/login', (req, res) => {
  const { usuario, password } = req.body

  if (usuario !== ADMIN_USER) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  const passwordValida = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
  if (!passwordValida) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }

  const token = jwt.sign({ usuario }, 'maxishop_secret_key', { expiresIn: '8h' })
  res.json({ token })
})

module.exports = router