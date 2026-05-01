import {
  Drawer, Box, Typography, IconButton, Button,
  List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'

function Carrito({ abierto, onCerrar, productos, onEliminar, onVaciar }) {
  const total = productos.reduce((acc, p) => acc + Number(p.precio), 0)
  const [metodoPago, setMetodoPago] = useState(null)
  const [confirmado, setConfirmado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmar = async () => {
    if (!metodoPago) return
    setCargando(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: productos.map(p => ({ nombre: p.nombre, precio: p.precio })),
          total,
          metodo_pago: metodoPago
        })
      })
      if (!res.ok) throw new Error('Error al guardar el pedido')
      setConfirmado(true)
      onVaciar()
    } catch {
      setError('Hubo un error al confirmar el pedido. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const resetear = () => {
    setMetodoPago(null)
    setConfirmado(false)
    setError('')
  }

  return (
    <Drawer anchor="right" open={abierto} onClose={() => { onCerrar(); resetear() }}>
      <Box sx={{ width: 320, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">🛒 Tu Carrito</Typography>
          <IconButton onClick={() => { onCerrar(); resetear() }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* CONFIRMACION */}
        {confirmado ? (
          <Box sx={{ textAlign: 'center', mt: 5, px: 2 }}>
            <Typography fontSize={48}>✅</Typography>
            <Typography variant="h6" fontWeight="bold" mt={1}>¡Pedido confirmado!</Typography>
            <Typography color="text.secondary" fontSize={13} mt={1}>
              {metodoPago === 'efectivo' && 'Pagás en efectivo al momento de la entrega.'}
              {metodoPago === 'mercadopago' && 'Serás redirigido a Mercado Pago para completar el pago.'}
            </Typography>
            <Typography fontSize={12} color="text.secondary" mt={1}>
              Tu pedido fue registrado y pronto será atendido 🎉
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 3, borderColor: '#FF6B35', color: '#FF6B35' }}
              onClick={() => { resetear(); onCerrar() }}
            >
              Cerrar
            </Button>
          </Box>
        ) : (
          <>
            {/* LISTA DE PRODUCTOS */}
            {productos.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography fontSize={40}>🛍️</Typography>
                <Typography color="text.secondary" mt={1}>Tu carrito está vacío</Typography>
              </Box>
            ) : (
              <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {productos.map((p, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => onEliminar(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={p.nombre}
                      secondary={`$${Number(p.precio).toLocaleString('es-AR')}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Divider />

            {/* TOTAL */}
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF6B35' }}>
                  ${total.toLocaleString('es-AR')}
                </Typography>
              </Box>

              {/* METODO DE PAGO */}
              <Typography fontSize={13} fontWeight={600} color="text.secondary" mb={1}>
                Elegí cómo querés pagar:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {[
                  { id: 'mercadopago', label: '💳 Mercado Pago', color: '#009ee3' },
                  { id: 'efectivo', label: '💵 Efectivo', color: '#FF6B35' },
                ].map(({ id, label, color }) => (
                  <Button
                    key={id}
                    fullWidth
                    variant={metodoPago === id ? 'contained' : 'outlined'}
                    onClick={() => setMetodoPago(id)}
                    sx={{
                      borderColor: color,
                      color: metodoPago === id ? 'white' : color,
                      backgroundColor: metodoPago === id ? color : 'transparent',
                      '&:hover': { backgroundColor: color, color: 'white', borderColor: color },
                      justifyContent: 'flex-start',
                      px: 2,
                      fontSize: 13,
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>

              {error && (
                <Typography fontSize={12} color="error" mb={1} textAlign="center">
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={productos.length === 0 || !metodoPago || cargando}
                onClick={handleConfirmar}
                sx={{
                  backgroundColor: '#1a1a2e',
                  '&:hover': { backgroundColor: '#FF6B35' },
                  '&:disabled': { backgroundColor: '#eee', color: '#aaa' }
                }}
              >
                {cargando ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Confirmar pedido'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}

export default Carrito