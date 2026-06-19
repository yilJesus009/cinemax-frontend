import { useEffect, useState } from 'react';
import { getPeliculas } from '../../api/peliculas.js';
import { getSalas } from '../../api/salas.js';
import { createFuncion, deleteFuncion, getFunciones, updateFuncion } from '../../api/funciones.js';

const initialForm = { peliculaId: '', salaId: '', fechaHora: '', precio: '' };

export default function AdminFunciones() {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      setMessage('');
      const payload = {
        peliculaId: Number(form.peliculaId),
        salaId: Number(form.salaId),
        fechaHora: new Date(form.fechaHora).toISOString(),
        precio: Number(form.precio)
      };

      if (editId) {
        await updateFuncion(editId, payload);
        setMessage('Función actualizada.');
      } else {
        await createFuncion(payload);
        setMessage('Función creada.');
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (funcion) => {
    setEditId(funcion.id);
    setForm({
      peliculaId: funcion.peliculaId || funcion.pelicula?.id || '',
      salaId: funcion.salaId || funcion.sala?.id || '',
      fechaHora: toDatetimeLocal(funcion.fechaHora),
      precio: funcion.precio || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta función?')) return;
    try {
      await deleteFuncion(id);
      setMessage('Función eliminada.');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm(initialForm);
  };

  return (
    <main className="page-shell">
      <div>
        <p className="eyebrow">Panel administrativo</p>
        <h1 className="page-title">Gestión de funciones</h1>
        <p className="mt-3 text-slate-600">El backend impide superponer funciones en una misma sala.</p>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="field">
          Película
          <select value={form.peliculaId} onChange={(event) => setForm({ ...form, peliculaId: event.target.value })} required>
            <option value="">Seleccionar película</option>
            {peliculas.map((pelicula) => (
              <option key={pelicula.id} value={pelicula.id}>{pelicula.titulo}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Sala
          <select value={form.salaId} onChange={(event) => setForm({ ...form, salaId: event.target.value })} required>
            <option value="">Seleccionar sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>{sala.nombre}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Fecha y hora
          <input type="datetime-local" value={form.fechaHora} onChange={(event) => setForm({ ...form, fechaHora: event.target.value })} required />
        </label>
        <label className="field">
          Precio
          <input type="number" min="0" step="0.01" value={form.precio} onChange={(event) => setForm({ ...form, precio: event.target.value })} required />
        </label>
        <div className="flex flex-wrap items-end gap-2 md:col-span-2">
          <button className="btn-primary">{editId ? 'Actualizar función' : 'Crear función'}</button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {funciones.map((funcion) => (
          <article key={funcion.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{funcion.pelicula?.titulo || `Película ${funcion.peliculaId}`}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {formatDate(funcion.fechaHora)} · {funcion.sala?.nombre || `Sala ${funcion.salaId}`} · ${formatMoney(funcion.precio)}
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
