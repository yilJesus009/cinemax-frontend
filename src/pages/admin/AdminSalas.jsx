import { useEffect, useState } from 'react';
import { createSala, deleteSala, getSalas, updateSala } from '../../api/salas.js';

const initialForm = { nombre: '', filas: '', columnas: '' };

export default function AdminSalas() {
  const [salas, setSalas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadSalas = async () => setSalas(await getSalas());

  useEffect(() => {
    loadSalas().catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      setMessage('');
      const payload = {
        nombre: form.nombre,
        filas: Number(form.filas),
        columnas: Number(form.columnas)
      };

      if (editId) {
        await updateSala(editId, payload);
        setMessage('Sala actualizada.');
      } else {
        await createSala(payload);
        setMessage('Sala creada.');
      }

      resetForm();
      await loadSalas();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (sala) => {
    setEditId(sala.id);
    setForm({
      nombre: sala.nombre || '',
      filas: sala.filas || '',
      columnas: sala.columnas || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta sala?')) return;
    try {
      await deleteSala(id);
      setMessage('Sala eliminada.');
      await loadSalas();
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
        <h1 className="page-title">Gestión de salas</h1>
        <p className="mt-3 text-slate-600">Definí filas, columnas y revisá la capacidad total.</p>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="field">
          Nombre
          <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
        </label>
        <label className="field">
          Filas
          <input type="number" min="1" value={form.filas} onChange={(event) => setForm({ ...form, filas: event.target.value })} required />
        </label>
        <label className="field">
          Columnas
          <input type="number" min="1" value={form.columnas} onChange={(event) => setForm({ ...form, columnas: event.target.value })} required />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button className="btn-primary">{editId ? 'Actualizar sala' : 'Crear sala'}</button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {salas.map((sala) => (
          <article key={sala.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{sala.nombre}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {sala.filas} filas x {sala.columnas} columnas · Capacidad {sala.capacidad || sala.filas * sala.columnas}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => startEdit(sala)}>Editar</button>
              <button className="btn-danger" onClick={() => handleDelete(sala.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
