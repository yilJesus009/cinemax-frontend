import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Cartelera from './pages/public/Cartelera.jsx';
import DetallePelicula from './pages/public/DetallePelicula.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Reserva from './pages/cliente/Reserva.jsx';
import MisReservas from './pages/cliente/MisReservas.jsx';
import AdminPeliculas from './pages/admin/AdminPeliculas.jsx';
import AdminSalas from './pages/admin/AdminSalas.jsx';
import AdminFunciones from './pages/admin/AdminFunciones.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Cartelera />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute role="cliente" />}>
          <Route path="/reserva/:funcionId" element={<Reserva />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/peliculas" element={<AdminPeliculas />} />
          <Route path="/admin/salas" element={<AdminSalas />} />
          <Route path="/admin/funciones" element={<AdminFunciones />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
