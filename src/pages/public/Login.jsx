import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext.jsx';

const loginSchema = yup.object({
  email: yup.string().trim().email('Ingresa un email valido.').required('El email es requerido.'),
  password: yup.string().required('La contrasena es requerida.')
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    try {
      setError('');
      const usuario = await login(values);
      const fallback = usuario.role === 'admin' ? '/admin/peliculas' : '/';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <p className="eyebrow">Bienvenido</p>
          <h1 className="text-3xl font-black text-night">Iniciar sesion</h1>
        </div>

        {error && <p className="alert-error">{error}</p>}

        <label className="field">
          Email
          <input type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>

        <label className="field">
          Contrasena
          <input type="password" autoComplete="current-password" {...register('password')} />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>

        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-slate-600">
          No tenes cuenta? <Link className="font-black text-cinema" to="/register">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
