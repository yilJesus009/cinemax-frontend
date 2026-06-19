import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const usuario = await login(form);
      const fallback = usuario.role === 'admin' ? '/admin/peliculas' : '/';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
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
          <p className="eyebrow">Bienvenido</p>
          <h1 className="text-3xl font-black text-night">Iniciar sesión</h1>
        </div>

        {error && <p className="alert-error">{error}</p>}

        <label className="field">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label className="field">
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿No tenés cuenta? <Link className="font-black text-cinema" to="/register">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
