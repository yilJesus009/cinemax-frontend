import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createPelicula, deletePelicula, getPeliculas, updatePelicula } from '../../api/peliculas.js';

const defaultValues = {
  titulo: '',
  sinopsis: '',
  genero: '',
  duracion: '',
  clasificacion: 'Todo publico',
  imagenPoster: null
};

const numberFromInput = (value, originalValue) => (originalValue === '' ? undefined : value);

const peliculaSchema = yup.object({
  titulo: yup.string().trim().required('El titulo es requerido.'),
  sinopsis: yup.string().trim().required('La sinopsis es requerida.'),
  genero: yup.string().trim().required('El genero es requerido.'),
  duracion: yup
    .number()
    .transform(numberFromInput)
    .typeError('La duracion debe ser un numero.')
    .positive('La duracion debe ser mayor a 0.')
    .required('La duracion es requerida.'),
  clasificacion: yup.string().required('La clasificacion es requerida.'),
  imagenPoster: yup.mixed().nullable()
});

export default function AdminPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(peliculaSchema),
    defaultValues
  });

  const loadPeliculas = async () => {
    setPeliculas(await getPeliculas());
  };

  useEffect(() => {
    loadPeliculas().catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (values) => {
    try {
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('titulo', values.titulo);
      formData.append('sinopsis', values.sinopsis);
      formData.append('genero', values.genero);
      formData.append('duracion', values.duracion);
      formData.append('clasificacion', values.clasificacion);

      const poster = values.imagenPoster?.[0];
      if (poster) formData.append('imagenPoster', poster);

      if (editId) {
        await updatePelicula(editId, formData);
        setMessage('Pelicula actualizada.');
      } else {
        await createPelicula(formData);
        setMessage('Pelicula creada.');
      }

      resetForm();
      await loadPeliculas();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (pelicula) => {
    setEditId(pelicula.id);
    reset({
      titulo: pelicula.titulo || '',
      sinopsis: pelicula.sinopsis || '',
      genero: pelicula.genero || '',
      duracion: pelicula.duracion || '',
      clasificacion: pelicula.clasificacion || 'Todo publico',
      imagenPoster: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar esta pelicula?')) return;
    try {
      await deletePelicula(id);
      setMessage('Pelicula eliminada.');
      await loadPeliculas();
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
      <Header title="Gestion de peliculas" subtitle="Crear, editar, eliminar y listar peliculas." />

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="field">
          Titulo
          <input {...register('titulo')} />
          {errors.titulo && <span className="field-error">{errors.titulo.message}</span>}
        </label>

        <label className="field">
          Genero
          <input {...register('genero')} />
          {errors.genero && <span className="field-error">{errors.genero.message}</span>}
        </label>

        <label className="field">
          Duracion
          <input type="number" min="1" {...register('duracion')} />
          {errors.duracion && <span className="field-error">{errors.duracion.message}</span>}
        </label>

        <label className="field">
          Clasificacion
          <select {...register('clasificacion')}>
            <option value="Todo publico">Todo publico</option>
            <option value="+14">+14</option>
            <option value="R">R</option>
          </select>
          {errors.clasificacion && <span className="field-error">{errors.clasificacion.message}</span>}
        </label>

        <label className="field md:col-span-2">
          Sinopsis
          <textarea rows="4" {...register('sinopsis')} />
          {errors.sinopsis && <span className="field-error">{errors.sinopsis.message}</span>}
        </label>

        <label className="field md:col-span-2">
          Imagen del poster
          <input type="file" accept="image/*" {...register('imagenPoster')} />
        </label>

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : editId ? 'Actualizar pelicula' : 'Crear pelicula'}
          </button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar edicion</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {peliculas.map((pelicula) => (
          <article key={pelicula.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{pelicula.titulo}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {pelicula.genero} - {pelicula.duracion} min - {pelicula.clasificacion}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => startEdit(pelicula)}>Editar</button>
              <button className="btn-danger" onClick={() => handleDelete(pelicula.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function Header({ title, subtitle }) {
  return (
    <div>
      <p className="eyebrow">Panel administrativo</p>
      <h1 className="page-title">{title}</h1>
      <p className="mt-3 text-slate-600">{subtitle}</p>
    </div>
  );
}
