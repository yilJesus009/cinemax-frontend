import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createSala, deleteSala, getSalas, updateSala } from '../../api/salas.js';

const defaultValues = { nombre: '', filas: '', columnas: '' };
const numberFromInput = (value, originalValue) => (originalValue === '' ? undefined : value);

const salaSchema = yup.object({
  nombre: yup.string().trim().required('El nombre es requerido.'),
  filas: yup
    .number()
    .transform(numberFromInput)
    .typeError('Las filas deben ser un numero.')
    .positive('Las filas deben ser mayores a 0.')
    .integer('Las filas deben ser un numero entero.')
    .required('Las filas son requeridas.'),
  columnas: yup
    .number()
    .transform(numberFromInput)
    .typeError('Las columnas deben ser un numero.')
    .positive('Las columnas deben ser mayores a 0.')
    .integer('Las columnas deben ser un numero entero.')
    .required('Las columnas son requeridas.')
});

export default function AdminSalas() {
  const [salas, setSalas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(salaSchema),
    defaultValues
  });

  const loadSalas = async () => setSalas(await getSalas());

  useEffect(() => {
    loadSalas().catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (values) => {
    try {
      setError('');
      setMessage('');

      const payload = {
        nombre: values.nombre,
        filas: Number(values.filas),
        columnas: Number(values.columnas)
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
    reset({
      nombre: sala.nombre || '',
      filas: sala.filas || '',
      columnas: sala.columnas || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar esta sala?')) return;
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
    reset(defaultValues);
  };

  return (
    <main className="page-shell">
      <div>
        <p className="eyebrow">Panel administrativo</p>
        <h1 className="page-title">Gestion de salas</h1>
        <p className="mt-3 text-slate-600">Defini filas, columnas y revisa la capacidad total.</p>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-ok">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="field">
          Nombre
          <input {...register('nombre')} />
          {errors.nombre && <span className="field-error">{errors.nombre.message}</span>}
        </label>

        <label className="field">
          Filas
          <input type="number" min="1" {...register('filas')} />
          {errors.filas && <span className="field-error">{errors.filas.message}</span>}
        </label>

        <label className="field">
          Columnas
          <input type="number" min="1" {...register('columnas')} />
          {errors.columnas && <span className="field-error">{errors.columnas.message}</span>}
        </label>

        <div className="flex flex-wrap items-end gap-2">
          <button className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : editId ? 'Actualizar sala' : 'Crear sala'}
          </button>
          {editId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <section className="grid gap-3">
        {salas.map((sala) => (
          <article key={sala.id} className="admin-row">
            <div>
              <h2 className="text-lg font-black text-night">{sala.nombre}</h2>
              <p className="text-sm font-semibold text-slate-600">
                {sala.filas} filas x {sala.columnas} columnas - Capacidad {sala.capacidad || sala.filas * sala.columnas}
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
