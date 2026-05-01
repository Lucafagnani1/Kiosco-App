import {
  Drawer, Box, Typography, IconButton, Button,
  List, ListItem, ListItemText, Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

function Carrito({ abierto, onCerrar, productos, onEliminar }) {
  const total = productos.reduce((acc, p) => acc + Number(p.precio), 0)

  return (
    <Drawer anchor="right" open={abierto} onClose={onCerrar}>
      <Box sx={{ width: 320, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* HEADER DEL CARRITO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">🛒 Tu Carrito</Typography>
          <IconButton onClick={onCerrar}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* LISTA DE PRODUCTOS */}
        {productos.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography color="text.secondary">Tu carrito está vacío</Typography>
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

        {/* TOTAL Y BOTÓN */}
        <Box sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF6B35' }}>
              ${total.toLocaleString('es-AR')}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={productos.length === 0}
            sx={{ backgroundColor: '#009ee3', '&:hover': { backgroundColor: '#007bbf' } }}
          >
            Pagar con Mercado Pago
          </Button>
        </Box>

      </Box>
    </Drawer>
  )
}

export default Carrito