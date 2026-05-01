const express = require('express')
const router = express.Router()
const db = require('../db')

// Crear pedido
router.post('/', (req, res) => {
  const { productos, total, metodo_pago } = req.body
  db.query(
    'INSERT INTO pedidos (productos, total, metodo_pago) VALUES (?, ?, ?)',
    [JSON.stringify(productos), total, metodo_pago],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: result.insertId, mensaje: 'Pedido creado' })
    }
  )
})

// Obtener todos los pedidos
router.get('/', (req, res) => {
  db.query('SELECT * FROM pedidos ORDER BY fecha DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Cambiar estado del pedido
router.put('/:id', (req, res) => {
  const { estado } = req.body
  db.query(
    'UPDATE pedidos SET estado=? WHERE id=?',
    [estado, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ mensaje: 'Estado actualizado' })
    }
  )
})

module.exports = router