import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext.jsx';

const registerSchema = yup.object({
  nombre: yup.string().trim().required('El nombre es requerido.'),
  email: yup.string().trim().email('Ingresa un email valido.').required('El email es requerido.'),
  password: yup
    .string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres.')
    .required('La contrasena es requerida.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contrasenas no coinciden.')
    .required('Confirma la contrasena.')
});

export default function Register() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async ({ confirmPassword, ...values }) => {
    try {
      setError('');
      const usuario = await registerAccount(values);
      navigate(usuario.role === 'admin' ? '/admin/peliculas' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <p className="eyebrow">Nueva cuenta</p>
          <h1 className="text-3xl font-black text-night">Registro</h1>
        </div>

        {error && <p className="alert-error">{error}</p>}

        <label className="field">
          Nombre
          <input autoComplete="name" {...register('nombre')} />
          {errors.nombre && <span className="field-error">{errors.nombre.message}</span>}
        </label>

        <label className="field">
          Email
          <input type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>

        <label className="field">
          Contrasena
          <input type="password" autoComplete="new-password" {...register('password')} />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>

        <label className="field">
          Confirmar contrasena
          <input type="password" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
        </label>

        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-slate-600">
          Ya tenes cuenta? <Link className="font-black text-cinema" to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
