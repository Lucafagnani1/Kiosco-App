const express = require('express')
const router = express.Router()
const db = require('../db')

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Agregar producto
router.post('/', (req, res) => {
  const { nombre, precio, categoria, imagen } = req.body
  db.query(
    'INSERT INTO productos (nombre, precio, categoria, imagen) VALUES (?, ?, ?, ?)',
    [nombre, precio, categoria, imagen],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: result.insertId, nombre, precio, categoria, imagen })
    }
  )
})

// Editar producto
router.put('/:id', (req, res) => {
  const { nombre, precio, categoria, imagen } = req.body
  db.query(
    'UPDATE productos SET nombre=?, precio=?, categoria=?, imagen=? WHERE id=?',
    [nombre, precio, categoria, imagen, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ mensaje: 'Producto actualizado' })
    }
  )
})

// Eliminar producto
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Producto eliminado' })
  })
})

module.exports = router