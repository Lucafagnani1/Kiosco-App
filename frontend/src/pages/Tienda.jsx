import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardMedia, CardActions, Button, AppBar, Toolbar,
  IconButton, Badge, Chip, Stack, CircularProgress
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useState, useEffect } from 'react'
import Carrito from '../components/Carrito'

const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'

const categorias = ['Todos', '🍬 Golosinas', '🥤 Bebidas', '🍟 Snacks', '🎧 Accesorios', '🍔 Comida']

const colores = {
  dark: '#2C2416',
  beige: '#F9F6F1',
  beigeLight: '#F5EDD8',
  beigeMid: '#EDE0C8',
  gold: '#C9A96E',
  muted: '#6B5A3E',
  border: '#E2D5BE',
}

function Tienda() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => { setProductos(data); setCargando(false) })
      .catch(() => setCargando(false))
  }, [])

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => categoriaActiva.includes(p.categoria))

  const agregarAlCarrito = (producto) => setCarrito(prev => [...prev, producto])
  const eliminarDelCarrito = (index) => setCarrito(prev => prev.filter((_, i) => i !== index))

  return (
    <Box sx={{ backgroundColor: colores.beige, minHeight: '100vh' }}>

      {/* HEADER */}
      <AppBar position="sticky" sx={{ backgroundColor: colores.dark, boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="h6" fontWeight="500" sx={{ color: colores.beigeLight, letterSpacing: 1 }}>
            MAXISHOP2
          </Typography>
          <Button
            onClick={() => setCarritoAbierto(true)}
            sx={{ backgroundColor: colores.gold, color: colores.dark, borderRadius: 2, px: 2, fontWeight: 500, '&:hover': { backgroundColor: '#B8914F' } }}
            startIcon={<ShoppingCartIcon />}
          >
            Mi carrito
            {carrito.length > 0 && (
              <Box sx={{ ml: 1, background: '#E24B4A', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                {carrito.length}
              </Box>
            )}
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box sx={{ backgroundColor: colores.beigeMid, display: 'flex', minHeight: 200 }}>
        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'inline-block', backgroundColor: colores.gold, color: colores.dark, fontSize: 11, fontWeight: 500, px: 2, py: 0.5, borderRadius: 5, mb: 1.5, width: 'fit-content' }}>
            Envío a domicilio disponible
          </Box>
          <Typography variant="h4" fontWeight="500" sx={{ color: colores.dark, lineHeight: 1.3, mb: 1 }}>
            Todo lo que necesitás,<br />desde casa
          </Typography>
          <Typography sx={{ color: colores.muted, fontSize: 13, mb: 2 }}>
            Golosinas, bebidas, snacks y accesorios con el mejor precio del barrio
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" sx={{ backgroundColor: colores.dark, color: colores.beigeLight, borderRadius: 2, '&:hover': { backgroundColor: '#3D3020' } }}>
              Ver productos
            </Button>
            <Button variant="outlined" sx={{ borderColor: colores.dark, color: colores.dark, borderRadius: 2 }}>
              Conocer más
            </Button>
          </Stack>
        </Box>
        <Box sx={{ width: 200, backgroundColor: '#D4C4A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
          🛍️
        </Box>
      </Box>

      {/* PROMO BAR */}
      <Box sx={{ backgroundColor: colores.dark, py: 1.5, display: 'flex', justifyContent: 'center', gap: 4 }}>
        {[['🚚', 'Envío rápido'], ['💳', 'Mercado Pago'], ['⭐', 'Calidad garantizada'], ['🕐', 'Abierto todos los días']].map(([icon, text]) => (
          <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colores.beigeLight, fontSize: 12 }}>
            <span style={{ fontSize: 16 }}>{icon}</span> {text}
          </Box>
        ))}
      </Box>

      {/* STATS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: 'white', borderBottom: `1px solid ${colores.border}` }}>
        {[['+ 500', 'Productos'], ['+1.2k', 'Clientes felices'], ['4.9 ★', 'Calificación'], ['24hs', 'Atención']].map(([num, label]) => (
          <Box key={label} sx={{ p: 2, textAlign: 'center', borderRight: `0.5px solid ${colores.border}` }}>
            <Typography sx={{ fontSize: 20, fontWeight: 500, color: colores.gold }}>{num}</Typography>
            <Typography sx={{ fontSize: 11, color: '#9B8560' }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      <Container sx={{ py: 3 }}>

        {/* TITULO */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="500" sx={{ color: colores.dark }}>Productos destacados</Typography>
          <Typography sx={{ fontSize: 13, color: '#9B8560' }}>— Los más vendidos</Typography>
        </Box>

        {/* CATEGORIAS */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
          {categorias.map(cat => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategoriaActiva(cat)}
              sx={{
                mb: 1,
                cursor: 'pointer',
                backgroundColor: categoriaActiva === cat ? colores.dark : 'white',
                color: categoriaActiva === cat ? colores.beigeLight : colores.muted,
                border: `1px solid ${categoriaActiva === cat ? colores.dark : colores.border}`,
                '&:hover': { borderColor: colores.gold },
              }}
            />
          ))}
        </Stack>

        {/* PRODUCTOS */}
        {cargando ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress sx={{ color: colores.gold }} />
            <Typography mt={2} sx={{ color: colores.muted }}>Cargando productos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {productosFiltrados.map((producto, index) => (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <Card sx={{ borderRadius: 3, border: `0.5px solid ${colores.border}`, boxShadow: 'none', position: 'relative', transition: 'transform 0.2s, border-color 0.2s', '&:hover': { transform: 'translateY(-3px)', borderColor: colores.gold } }}>
                  
                  {index % 3 === 0 && (
                    <Box sx={{ position: 'absolute', top: 10, left: 10, background: '#E24B4A', color: 'white', fontSize: 10, px: 1, py: 0.3, borderRadius: 5, zIndex: 1, fontWeight: 500 }}>
                      -20%
                    </Box>
                  )}
                  {index % 3 === 2 && (
                    <Box sx={{ position: 'absolute', top: 10, left: 10, background: colores.gold, color: colores.dark, fontSize: 10, px: 1, py: 0.3, borderRadius: 5, zIndex: 1, fontWeight: 500 }}>
                      Nuevo
                    </Box>
                  )}

                  <Box sx={{ position: 'absolute', top: 10, right: 10, background: 'white', border: `0.5px solid ${colores.border}`, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, cursor: 'pointer' }}>
                    <FavoriteBorderIcon sx={{ fontSize: 14, color: colores.muted }} />
                  </Box>

                  <CardMedia
                    component="img"
                    height="130"
                    image={producto.imagen || `https://via.placeholder.com/300x130/F5EDD8/2C2416?text=${producto.nombre}`}
                    alt={producto.nombre}
                    sx={{ backgroundColor: colores.beigeLight }}
                  />

                  <CardContent sx={{ pb: 0 }}>
                    <Typography sx={{ fontSize: 10, color: '#9B8560', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                      {producto.categoria}
                    </Typography>
                    <Typography fontWeight="500" sx={{ fontSize: 13, color: colores.dark, mb: 1 }}>
                      {producto.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: 16, fontWeight: 500, color: colores.gold }}>
                        ${Number(producto.precio).toLocaleString()}
                      </Typography>
                      <Button
                        onClick={() => agregarAlCarrito(producto)}
                        sx={{ minWidth: 30, width: 30, height: 30, background: colores.dark, color: colores.beigeLight, borderRadius: 2, fontSize: 18, p: 0, '&:hover': { background: colores.gold, color: colores.dark } }}
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>
                  <CardActions />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* OFERTA DEL DIA */}
        <Box sx={{ backgroundColor: colores.dark, borderRadius: 3, p: 3, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ color: colores.beigeLight, fontWeight: 500, fontSize: 16, mb: 0.5 }}>Oferta del día 🔥</Typography>
            <Typography sx={{ color: '#9B8560', fontSize: 12, mb: 1 }}>Combo gaseosa + snack + golosina</Typography>
            <Typography sx={{ color: colores.gold, fontSize: 22, fontWeight: 500 }}>$2.500</Typography>
          </Box>
          <Box sx={{ fontSize: 50 }}>🎁</Box>
        </Box>

        {/* MERCADO PAGO */}
        <Box sx={{ backgroundColor: '#009ee3', borderRadius: 3, p: 2.5, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 500, fontSize: 14, mb: 0.5 }}>Pagá con Mercado Pago</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Tarjeta, débito, crédito o saldo — rápido y seguro</Typography>
          </Box>
          <Button sx={{ background: 'white', color: '#009ee3', borderRadius: 2, fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap', '&:hover': { background: '#f0f0f0' } }}>
            Pagar ahora
          </Button>
        </Box>

      </Container>

      {/* FOOTER */}
      <Box sx={{ backgroundColor: colores.dark, py: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography sx={{ color: colores.beigeLight, fontWeight: 500 }}>🏪 Kiosco</Typography>
        <Stack direction="row" spacing={3}>
          {['Inicio', 'Productos', 'Contacto'].map(link => (
            <Typography key={link} sx={{ color: '#9B8560', fontSize: 12, cursor: 'pointer', '&:hover': { color: colores.gold } }}>{link}</Typography>
          ))}
        </Stack>
      </Box>

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