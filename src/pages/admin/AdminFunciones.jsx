import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createFuncion, deleteFuncion, getFunciones, updateFuncion } from '../../api/funciones.js';
import { getPeliculas } from '../../api/peliculas.js';
import { getSalas } from '../../api/salas.js';

const defaultValues = { peliculaId: '', salaId: '', fechaHora: '', precio: '' };
const numberFromInput = (value, originalValue) => (originalValue === '' ? undefined : value);

const funcionSchema = yup.object({
  peliculaId: yup.string().required('Selecciona una pelicula.'),
  salaId: yup.string().required('Selecciona una sala.'),
  fechaHora: yup.string().required('La fecha y hora es requerida.'),
  precio: yup
    .number()
    .transform(numberFromInput)
    .typeError('El precio debe ser un numero.')
    .positive('El precio debe ser mayor a 0.')
    .required('El precio es requerido.')
});

export default function AdminFunciones() {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(funcionSchema),
    defaultValues
  });

  const loadData = async () => {
    const [peliculasData, salasData, funcionesData] = await Promise.all([
      getPeliculas(),
      getSalas(),
      getFunciones()
    ]);
    setPeliculas(peliculasData);
    setSalas(salasData);
    setFunciones(funcionesData);
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (values) => {
    try {
      setError('');
      setMessage('');

      const payload = {
        peliculaId: Number(values.peliculaId),
        salaId: Number(values.salaId),
        fechaHora: new Date(values.fechaHora).toISOString(),
        precio: Number(values.precio)
      };

      if (editId) {
        await updateFuncion(editId, payload);
        setMessage('Funcion actualizada.');
      } else {
        await createFuncion(payload);
        setMessage('Funcion creada.');
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (funcion) => {
    setEditId(funcion.id);
    reset({
      peliculaId: String(funcion.peliculaId || funcion.pelicula?.id || ''),
      salaId: String(funcion.salaId || funcion.sala?.id || ''),
      fechaHora: toDatetimeLocal(funcion.fechaHora),
      precio: funcion.precio || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar esta funcion?')) return;
    try {
      await deleteFuncion(id);
      setMessage('Funcion eliminada.');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditId(null);
    reset(defaultValues);
  };

  return (
    <main className="page-shell">
      <div>
        <p className="eyebrow">Panel administrativo</p>
        <h1 className="page-title">Gestion de funciones</h1>
        <p className="mt-3 text-slate-600">El backend impide superponer funciones en una misma sala.</p>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="field">
          Pelicula
          <select {...register('peliculaId')}>
            <option value="">Seleccionar pelicula</option>
            {peliculas.map((pelicula) => (
              <option key={pelicula.id} value={pelicula.id}>{pelicula.titulo}</option>
            ))}
          </select>
          {errors.peliculaId && <span className="field-error">{errors.peliculaId.message}</span>}
        </label>

        <label className="field">
          Sala
          <select {...register('salaId')}>
            <option value="">Seleccionar sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>{sala.nombre}</option>
            ))}
          </select>
          {errors.salaId && <span className="field-error">{errors.salaId.message}</span>}
        </label>

        <label className="field">
          Fecha y hora
          <input type="datetime-local" {...register('fechaHora')} />
          {errors.fechaHora && <span className="field-error">{errors.fechaHora.message}</span>}
        </label>

        <label className="field">
          Precio
          <input type="number" min="0" step="0.01" {...register('precio')} />
          {errors.precio && <span className="field-error">{errors.precio.message}</span>}
        </label>

        <div className="flex flex-wrap items-end gap-2 md:col-span-2">
          <button className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : editId ? 'Actualizar funcion' : 'Crear funcion'}
          </button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {funciones.map((funcion) => (
          <article key={funcion.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{funcion.pelicula?.titulo || `Pelicula ${funcion.peliculaId}`}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {formatDate(funcion.fechaHora)} - {funcion.sala?.nombre || `Sala ${funcion.salaId}`} - ${formatMoney(funcion.precio)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => startEdit(funcion)}>Editar</button>
              <button className="btn-danger" onClick={() => handleDelete(funcion.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function toDatetimeLocal(value) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 });
}
