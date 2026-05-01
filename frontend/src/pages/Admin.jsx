import {
  Box, Container, Typography, AppBar, Toolbar, Button,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useState, useEffect } from 'react'

const categorias = ['Golosinas', 'Bebidas', 'Snacks', 'Accesorios', 'Comida']
const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'

const productoVacio = { nombre: '', precio: '', categoria: '', imagen: '' }

function Admin() {
  const [productos, setProductos] = useState([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [productoActual, setProductoActual] = useState(productoVacio)
  const [editando, setEditando] = useState(false)

  const cargarProductos = () => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
  }

  useEffect(() => { cargarProductos() }, [])

  const abrirAgregar = () => {
    setProductoActual(productoVacio)
    setEditando(false)
    setDialogAbierto(true)
  }

  const abrirEditar = (producto) => {
    setProductoActual(producto)
    setEditando(true)
    setDialogAbierto(true)
  }

  const guardar = () => {
    const url = editando
      ? `${API_URL}/api/productos/${productoActual.id}`
      : `${API_URL}/api/productos`
    const method = editando ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoActual)
    })
      .then(() => {
        cargarProductos()
        setDialogAbierto(false)
      })
  }

  const eliminar = (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return
    fetch(`${API_URL}/api/productos/${id}`, { method: 'DELETE' })
      .then(() => cargarProductos())
  }

  return (
    <Box>
      <AppBar position="sticky" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            🔧 Panel de Administración
          </Typography>
          <Button color="inherit" href="/">Ver Tienda</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Productos</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirAgregar}
            sx={{ backgroundColor: '#1a1a2e' }}
          >
            Agregar Producto
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map(p => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${Number(p.precio).toLocaleString()}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => abrirEditar(p)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => eliminar(p.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editando ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre"
            value={productoActual.nombre}
            onChange={e => setProductoActual({ ...productoActual, nombre: e.target.value })}
            fullWidth
          />
          <TextField
            label="Precio"
            type="number"
            value={productoActual.precio}
            onChange={e => setProductoActual({ ...productoActual, precio: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={productoActual.categoria}
              label="Categoría"
              onChange={e => setProductoActual({ ...productoActual, categoria: e.target.value })}
            >
              {categorias.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="URL de imagen (opcional)"
            value={productoActual.imagen}
            onChange={e => setProductoActual({ ...productoActual, imagen: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardar}
            sx={{ backgroundColor: '#1a1a2e' }}
          >
            {editando ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Admin