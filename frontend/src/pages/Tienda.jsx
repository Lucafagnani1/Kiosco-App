import {
  Box, Container, Typography, Card, CardContent,
  CardMedia, CardActions, Button, AppBar, Toolbar,
  Chip, Stack, CircularProgress, useMediaQuery, useTheme
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useState, useEffect } from 'react'
import Carrito from '../components/Carrito'

const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'
const categorias = ['Todos', '🍬 Golosinas', '🥤 Bebidas', '🍟 Snacks', '🎧 Accesorios', '🍔 Comida']

function Tienda() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

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

  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  const letras = [
    { l: 'M', c: '#FF6B35' }, { l: 'A', c: '#FFD93D' }, { l: 'X', c: '#6BCB77' },
    { l: 'I', c: '#4D96FF' }, { l: 'S', c: '#FF6B35' }, { l: 'H', c: '#FFD93D' },
    { l: 'O', c: '#6BCB77' }, { l: 'P', c: '#FF6BAA' }
  ]

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>

      {/* HEADER */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1a1a2e', boxShadow: 'none', overflowX: 'hidden' }}>
        <Toolbar sx={{ justifyContent: 'flex-end', px: { xs: 2, md: 3 } }}>
          <Button
            onClick={() => setCarritoAbierto(true)}
            sx={{
              backgroundColor: '#FF6B35',
              color: 'white',
              borderRadius: 2,
              px: { xs: 1.5, md: 2 },
              fontWeight: 500,
              fontSize: { xs: 11, md: 13 },
              '&:hover': { backgroundColor: '#e55a25' }
            }}
            startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: 16, md: 20 } }} />}
          >
            {isMobile ? 'Carrito' : 'Mi carrito'}
            {carrito.length > 0 && (
              <Box sx={{ ml: 1, background: 'white', color: '#FF6B35', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                {carrito.length}
              </Box>
            )}
          </Button>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box sx={{ backgroundColor: '#1a1a2e', py: { xs: 4, md: 5 }, textAlign: 'center', px: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, overflow: 'hidden' }}>
          {letras.map(({ l, c }) => (
            <Typography key={l} sx={{ color: c, fontSize: { xs: '10vw', sm: 56, md: 72 }, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>
              {l}
            </Typography>
          ))}
        </Box>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
          <Button variant="contained" size={isMobile ? 'small' : 'medium'}
            sx={{ backgroundColor: '#FF6B35', color: 'white', borderRadius: 2, '&:hover': { backgroundColor: '#e55a25' } }}>
            Ver productos
          </Button>
          <Button variant="outlined" size={isMobile ? 'small' : 'medium'}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 2, '&:hover': { borderColor: 'white' } }}>
            Conocer más
          </Button>
        </Stack>
      </Box>

      {/* PROMO BAR */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, width: '100%' }}>
        {[['🚚', 'Envío rápido', '#FF6B35'], ['💳', 'Mercado Pago', '#FFD93D'], ['⭐', 'Calidad garantizada', '#6BCB77'], ['🕐', 'Todos los días', '#4D96FF']].map(([icon, text, bg]) => (
          <Box key={text} sx={{ backgroundColor: bg, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, overflow: 'hidden' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <Typography sx={{ fontSize: { xs: 10, md: 12 }, fontWeight: 500, color: bg === '#FFD93D' ? '#333' : 'white', whiteSpace: 'nowrap' }}>
              {isMobile ? text.split(' ')[0] : text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* STATS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: 'white', borderBottom: '1px solid #eee', width: '100%' }}>
        {[['+ 500', 'Productos', '#FF6B35'], ['+1.2k', 'Clientes', '#FFD93D'], ['4.9 ★', 'Calificación', '#6BCB77'], ['24hs', 'Atención', '#4D96FF']].map(([num, label, color]) => (
          <Box key={label} sx={{ p: { xs: 1, md: 2 }, textAlign: 'center', borderRight: '1px solid #eee', overflow: 'hidden' }}>
            <Typography sx={{ fontSize: { xs: 12, md: 20 }, fontWeight: 700, color }}>{num}</Typography>
            <Typography sx={{ fontSize: { xs: 8, md: 11 }, color: '#888' }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      <Container sx={{ py: 3, px: { xs: 2, md: 3 }, overflowX: 'hidden' }}>

        {/* TITULO */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Typography fontWeight="700" sx={{ color: '#1a1a2e', fontSize: { xs: 15, md: 18 } }}>Productos destacados</Typography>
          <Typography sx={{ fontSize: 13, color: '#aaa' }}>— Los más vendidos</Typography>
        </Box>

        {/* CATEGORIAS — scroll horizontal en mobile */}
        <Stack
          direction="row"
          spacing={1}
          mb={5}
          sx={{
            overflowX: 'auto',
            flexWrap: 'nowrap',
            pb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categorias.map(cat => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategoriaActiva(cat)}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                flexShrink: 0,
                cursor: 'pointer',
                fontSize: { xs: 11, md: 13 },
                backgroundColor: categoriaActiva === cat ? '#1a1a2e' : 'white',
                color: categoriaActiva === cat ? 'white' : '#555',
                border: `1.5px solid ${categoriaActiva === cat ? '#1a1a2e' : '#ddd'}`,
                '&:hover': { borderColor: '#FF6B35' },
              }}
            />
          ))}
        </Stack>

        {/* PRODUCTOS */}
        {cargando ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress sx={{ color: '#FF6B35' }} />
            <Typography mt={2} sx={{ color: '#888' }}>Cargando productos...</Typography>
          </Box>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '14px', width: '100%' }}>
            {productosFiltrados.map((producto, index) => {
              const fondos = ['#FFEBEB', '#EBF3FF', '#FFFBEB', '#EBFFEF', '#F3EBFF', '#FFEBF6']
              const fondo = fondos[index % fondos.length]
              return (
                <Card key={producto.id} sx={{ borderRadius: 3, border: '1px solid #eee', boxShadow: 'none', position: 'relative', transition: 'transform 0.2s, border-color 0.2s', '&:hover': { transform: 'translateY(-3px)', borderColor: '#FF6B35' }, overflow: 'hidden' }}>

                  {index % 3 === 0 && (
                    <Box sx={{ position: 'absolute', top: 8, left: 8, background: '#FF6B35', color: 'white', fontSize: 10, px: 1, py: 0.3, borderRadius: 5, zIndex: 1, fontWeight: 600 }}>
                      -20%
                    </Box>
                  )}
                  {index % 3 === 2 && (
                    <Box sx={{ position: 'absolute', top: 8, left: 8, background: '#6BCB77', color: 'white', fontSize: 10, px: 1, py: 0.3, borderRadius: 5, zIndex: 1, fontWeight: 600 }}>
                      Nuevo
                    </Box>
                  )}
                  {index % 3 === 1 && (
                    <Box sx={{ position: 'absolute', top: 8, left: 8, background: '#4D96FF', color: 'white', fontSize: 10, px: 1, py: 0.3, borderRadius: 5, zIndex: 1, fontWeight: 600 }}>
                      Top
                    </Box>
                  )}

                  <Box sx={{ position: 'absolute', top: 8, right: 8, background: 'white', border: '1px solid #eee', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, cursor: 'pointer' }}>
                    <FavoriteBorderIcon sx={{ fontSize: 14, color: '#aaa' }} />
                  </Box>

                  <CardMedia
                    component="img"
                    height={isMobile ? '110' : '130'}
                    image={producto.imagen || `https://placehold.co/300x130/${fondo.replace('#', '')}/1a1a2e?text=${encodeURIComponent(producto.nombre)}`}
                    alt={producto.nombre}
                    sx={{ backgroundColor: fondo, objectFit: 'contain', p: 1 }}
                  />

                  <CardContent sx={{ pb: 0, px: { xs: 1.5, md: 2 } }}>
                    <Typography sx={{ fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                      {producto.categoria}
                    </Typography>
                    <Typography fontWeight="600" sx={{ fontSize: { xs: 12, md: 13 }, color: '#1a1a2e', mb: 1 }}>
                      {producto.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 700, color: '#FF6B35' }}>
                        ${Number(producto.precio).toLocaleString()}
                      </Typography>
                      <Button
                        onClick={() => agregarAlCarrito(producto)}
                        sx={{ minWidth: 30, width: 30, height: 30, background: '#1a1a2e', color: 'white', borderRadius: 2, fontSize: 18, p: 0, '&:hover': { background: '#FF6B35' } }}
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>
                  <CardActions />
                </Card>
              )
            })}
          </div>
        )}

        {/* BANNERS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 4 }}>
          <Box sx={{ backgroundColor: '#FF6B35', borderRadius: 3, p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: 14, md: 16 }, mb: 0.5 }}>Oferta del día 🔥</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: 11, md: 12 }, mb: 1.5 }}>Combo gaseosa + snack + golosina</Typography>
              <Button sx={{ background: 'white', color: '#FF6B35', borderRadius: 2, fontWeight: 600, fontSize: 12, '&:hover': { background: '#fff3f0' } }}>
                Ver oferta
              </Button>
            </Box>
            <Box sx={{ fontSize: { xs: 36, md: 50 }, flexShrink: 0 }}>🎁</Box>
          </Box>

          <Box sx={{ backgroundColor: '#1a1a2e', borderRadius: 3, p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: 14, md: 16 }, mb: 0.5 }}>Pagá con Mercado Pago</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: { xs: 11, md: 12 }, mb: 1.5 }}>Rápido, seguro y sin complicaciones</Typography>
              <Button sx={{ background: 'white', color: '#1a1a2e', borderRadius: 2, fontWeight: 600, fontSize: 12, '&:hover': { background: '#f0f0f0' } }}>
                Pagar ahora
              </Button>
            </Box>
            <Box sx={{ fontSize: { xs: 36, md: 50 }, flexShrink: 0 }}>💳</Box>
          </Box>
        </Box>

      </Container>

      {/* FOOTER */}
     <Box sx={{ backgroundColor: '#1a1a2e', py: 2.5, px: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 4, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexShrink: 0 }}>
          {letras.map(({ l, c }) => (
            <Typography key={l} sx={{ color: c, fontSize: { xs: 16, md: 20 }, fontWeight: 700 }}>{l}</Typography>
          ))}
        </Box>
        <Stack direction="row" spacing={{ xs: 1.5, md: 3 }} sx={{ flexShrink: 0 }}>
          {['Inicio', 'Productos', 'Contacto'].map(link => (
            <Typography key={link} sx={{ color: 'rgba(255,255,255,0.4)', fontSize: { xs: 11, md: 12 }, cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: '#FF6B35' } }}>{link}</Typography>
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