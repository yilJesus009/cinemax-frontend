import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-bold transition ${
    isActive ? 'bg-red-50 text-cinema' : 'text-slate-600 hover:bg-slate-100 hover:text-night'
  }`;

export default function Navbar() {
  const { usuario, isAuthenticated, isAdmin, isCliente, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-cinema text-xl font-black text-white">
            C
          </span>
          <span>
            <span className="block text-lg font-black text-night">Cinemax</span>
            <span className="block text-xs font-semibold text-slate-500">Cartelera y reservas</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={linkClass}>Cartelera</NavLink>
          {isCliente && <NavLink to="/mis-reservas" className={linkClass}>Mis reservas</NavLink>}
          {isAdmin && (
            <>
              <NavLink to="/admin/peliculas" className={linkClass}>Películas</NavLink>
              <NavLink to="/admin/salas" className={linkClass}>Salas</NavLink>
              <NavLink to="/admin/funciones" className={linkClass}>Funciones</NavLink>
            </>
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                {usuario?.nombre || usuario?.email} · {usuario?.role}
              </span>
              <button className="btn-secondary" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">Login</Link>
              <Link className="btn-primary" to="/register">Registro</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
