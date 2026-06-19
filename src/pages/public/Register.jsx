import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', role: 'cliente' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const usuario = await register(form);
      navigate(usuario.role === 'admin' ? '/admin/peliculas' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Nueva cuenta</p>
          <h1 className="text-3xl font-black text-night">Registro</h1>
        </div>

        {error && <p className="alert-error">{error}</p>}

        <label className="field">
          Nombre
          <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
        </label>
        <label className="field">
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="field">
          Contraseña
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <label className="field">
          Rol
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tenés cuenta? <Link className="font-black text-cinema" to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
