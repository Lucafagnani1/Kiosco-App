import { Routes, Route, Navigate } from 'react-router-dom'
import Tienda from './pages/Tienda'
import Admin from './pages/Admin'
import Login from './pages/Login'

function RutaProtegida({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Tienda />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <RutaProtegida>
          <Admin />
        </RutaProtegida>
      } />
    </Routes>
  )
}

export default App