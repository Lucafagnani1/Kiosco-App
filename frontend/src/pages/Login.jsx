import {
  Box, Typography, TextField, Button,
  Paper, Alert, CircularProgress
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://kiosco-app-production-5cff.up.railway.app'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!usuario || !password) {
      setError('Completá todos los campos')
      return
    }
    setCargando(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setCargando(false)
        return
      }
      localStorage.setItem('token', data.token)
      navigate('/admin')
    } catch {
      setError('Error de conexión')
      setCargando(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 380, boxShadow: 'none', border: '1px solid #eee' }}>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ backgroundColor: '#FF6B35', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <LockIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" sx={{ color: '#1a1a2e' }}>Panel de Administración</Typography>
          <Typography sx={{ fontSize: 13, color: '#aaa', mt: 0.5 }}>Ingresá tus credenciales</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          sx={{ mb: 2 }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={cargando}
          sx={{ backgroundColor: '#FF6B35', borderRadius: 2, fontWeight: 600, '&:hover': { backgroundColor: '#e55a25' } }}
        >
          {cargando ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Ingresar'}
        </Button>

      </Paper>
    </Box>
  )
}

export default Login