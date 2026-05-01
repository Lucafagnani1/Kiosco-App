import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardMedia, CardActions, Button, AppBar, Toolbar,
  IconButton, Badge, Chip, Stack, CircularProgress
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useState, useEffect } from 'react'
import Carrito from '../components/Carrito'

const categorias = ['Todos', 'Golosinas', 'Bebidas', 'Snacks', 'Accesorios', 'Comida']

function Tienda() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error cargando productos:', err)
        setCargando(false)
      })
  }, [])

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => [...prev, producto])
  }

  const eliminarDelCarrito = (index) => {
    setCarrito(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Box>
      {/* HEADER */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            🏪 Kiosco
          </Typography>
          <IconButton color="inherit" onClick={() => setCarritoAbierto(true)}>
            <Badge badgeContent={carrito.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* BANNER */}
      <Box sx={{ backgroundColor: '#1a1a2e', color: 'white', py: 5, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold">Bienvenido al Kiosco 🛒</Typography>
        <Typography variant="h6" sx={{ mt: 1, opacity: 0.8 }}>
          Comprá desde casa y pagá con Mercado Pago
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* CATEGORÍAS */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={4}>
          {categorias.map(cat => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategoriaActiva(cat)}
              color={categoriaActiva === cat ? 'primary' : 'default'}
              sx={{ cursor: 'pointer', mb: 1 }}
            />
          ))}
        </Stack>

        {/* LOADING */}
        {cargando ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography mt={2}>Cargando productos...</Typography>
          </Box>
        ) : (
          /* PRODUCTOS */
          <Grid container spacing={3}>
            {productosFiltrados.map(producto => (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={producto.imagen || 'https://via.placeholder.com/200x150?text=' + producto.nombre}
                    alt={producto.nombre}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{producto.nombre}</Typography>
                    <Typography variant="h6" color="primary">
                      ${Number(producto.precio).toLocaleString()}
                    </Typography>
                    <Chip label={producto.categoria} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => agregarAlCarrito(producto)}
                      sx={{ backgroundColor: '#1a1a2e' }}
                    >
                      Agregar al carrito
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CARRITO */}
      <Carrito
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        productos={carrito}
        onEliminar={eliminarDelCarrito}
      />
    </Box>
  )
}

export default Tienda