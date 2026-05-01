import {
  Box, Container, Typography, AppBar, Toolbar, Button,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Tabs, Tab
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState, useEffect } from 'react'

const categorias = ['Golosinas', 'Bebidas', 'Snacks', 'Accesorios', 'Comida']
const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'
const productoVacio = { nombre: '', precio: '', categoria: '', imagen: '' }

const estadoColores = {
  pendiente: { bg: '#FFF3E0', color: '#E65100' },
  preparando: { bg: '#E3F2FD', color: '#1565C0' },
  listo: { bg: '#E8F5E9', color: '#2E7D32' },
}

function Admin() {
  const [tab, setTab] = useState(0)
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [productoActual, setProductoActual] = useState(productoVacio)
  const [editando, setEditando] = useState(false)

  const cargarProductos = () => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
  }

  const cargarPedidos = () => {
    fetch(`${API_URL}/api/pedidos`)
      .then(res => res.json())
      .then(data => setPedidos(data))
  }

  useEffect(() => {
    cargarProductos()
    cargarPedidos()
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

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
    }).then(() => { cargarProductos(); setDialogAbierto(false) })
  }

  const eliminar = (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return
    fetch(`${API_URL}/api/productos/${id}`, { method: 'DELETE' })
      .then(() => cargarProductos())
  }

  const cambiarEstado = (id, estado) => {
    fetch(`${API_URL}/api/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    }).then(() => cargarPedidos())
  }

  const siguienteEstado = (estadoActual) => {
    if (estadoActual === 'pendiente') return 'preparando'
    if (estadoActual === 'preparando') return 'listo'
    return 'pendiente'
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <Box>
      <AppBar position="sticky" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            🔧 Panel de Administración
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" href="/">Ver Tienda</Button>
            <Button
              color="inherit"
              onClick={cerrarSesion}
              startIcon={<LogoutIcon />}
              sx={{ color: '#FF6B35', '&:hover': { color: '#e55a25' } }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          sx={{ mb: 3, borderBottom: '1px solid #eee' }}
        >
          <Tab label="📦 Productos" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🛒 Pedidos
                {pedidos.filter(p => p.estado === 'pendiente').length > 0 && (
                  <Box sx={{ background: '#FF6B35', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {pedidos.filter(p => p.estado === 'pendiente').length}
                  </Box>
                )}
              </Box>
            }
          />
        </Tabs>

        {/* TAB PRODUCTOS */}
        {tab === 0 && (
          <>
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
          </>
        )}

        {/* TAB PEDIDOS */}
        {tab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Pedidos</Typography>
              <Button variant="outlined" onClick={cargarPedidos} sx={{ borderColor: '#1a1a2e', color: '#1a1a2e' }}>
                🔄 Actualizar
              </Button>
            </Box>

            {pedidos.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography fontSize={40}>📭</Typography>
                <Typography color="text.secondary" mt={1}>No hay pedidos todavía</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Productos</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Pago</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidos.map(p => {
                      const prods = JSON.parse(p.productos)
                      const { bg, color } = estadoColores[p.estado] || estadoColores.pendiente
                      return (
                        <TableRow key={p.id} hover>
                          <TableCell>#{p.id}</TableCell>
                          <TableCell>
                            {prods.map((item, i) => (
                              <Typography key={i} fontSize={12}>{item.nombre}</Typography>
                            ))}
                          </TableCell>
                          <TableCell>${Number(p.total).toLocaleString()}</TableCell>
                          <TableCell>
                            {p.metodo_pago === 'efectivo' ? '💵 Efectivo' : '💳 Mercado Pago'}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{formatearFecha(p.fecha)}</TableCell>
                          <TableCell>
                            <Chip
                              label={p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                              onClick={() => cambiarEstado(p.id, siguienteEstado(p.estado))}
                              sx={{ backgroundColor: bg, color, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

      </Container>

      {/* DIALOG PRODUCTOS */}
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
          <Button variant="contained" onClick={guardar} sx={{ backgroundColor: '#1a1a2e' }}>
            {editando ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Admin