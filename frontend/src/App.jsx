import { Routes, Route } from 'react-router-dom'
import Tienda from './pages/Tienda'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Tienda />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App