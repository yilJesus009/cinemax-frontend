import { useEffect, useState } from 'react';
import { createPelicula, deletePelicula, getPeliculas, updatePelicula } from '../../api/peliculas.js';

const initialForm = {
  titulo: '',
  sinopsis: '',
  genero: '',
  duracion: '',
  clasificacion: 'Todo público',
  imagenPoster: null
};

export default function AdminPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadPeliculas = async () => {
    setPeliculas(await getPeliculas());
  };

  useEffect(() => {
    loadPeliculas().catch((err) => setError(err.message));
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      setMessage('');
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('sinopsis', form.sinopsis);
      formData.append('genero', form.genero);
      formData.append('duracion', form.duracion);
      formData.append('clasificacion', form.clasificacion);
      if (form.imagenPoster) formData.append('imagenPoster', form.imagenPoster);

      if (editId) {
        await updatePelicula(editId, formData);
        setMessage('Película actualizada.');
      } else {
        await createPelicula(formData);
        setMessage('Película creada.');
      }

      resetForm();
      await loadPeliculas();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (pelicula) => {
    setEditId(pelicula.id);
    setForm({
      titulo: pelicula.titulo || '',
      sinopsis: pelicula.sinopsis || '',
      genero: pelicula.genero || '',
      duracion: pelicula.duracion || '',
      clasificacion: pelicula.clasificacion || 'Todo público',
      imagenPoster: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta película?')) return;
    try {
      await deletePelicula(id);
      setMessage('Película eliminada.');
      await loadPeliculas();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm(initialForm);
    document.querySelector('#imagenPoster')?.value && (document.querySelector('#imagenPoster').value = '');
  };

  return (
    <main className="page-shell">
      <Header title="Gestión de películas" subtitle="Crear, editar, eliminar y listar películas." />

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="field">
          Título
          <input name="titulo" value={form.titulo} onChange={handleChange} required />
        </label>
        <label className="field">
          Género
          <input name="genero" value={form.genero} onChange={handleChange} required />
        </label>
        <label className="field">
          Duración
          <input name="duracion" type="number" min="1" value={form.duracion} onChange={handleChange} required />
        </label>
        <label className="field">
          Clasificación
          <select name="clasificacion" value={form.clasificacion} onChange={handleChange}>
            <option>Todo público</option>
            <option>+14</option>
            <option>R</option>
          </select>
        </label>
        <label className="field md:col-span-2">
          Sinopsis
          <textarea name="sinopsis" rows="4" value={form.sinopsis} onChange={handleChange} required />
        </label>
        <label className="field md:col-span-2">
          Imagen del poster
          <input id="imagenPoster" name="imagenPoster" type="file" accept="image/*" onChange={handleChange} />
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button className="btn-primary">{editId ? 'Actualizar película' : 'Crear película'}</button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar edición</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {peliculas.map((pelicula) => (
          <article key={pelicula.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{pelicula.titulo}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {pelicula.genero} · {pelicula.duracion} min · {pelicula.clasificacion}
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
