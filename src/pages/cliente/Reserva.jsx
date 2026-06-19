import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFuncion } from '../../api/funciones.js';
import { createReserva, getAsientosOcupados } from '../../api/reservas.js';
import SeatMap from '../../components/SeatMap.jsx';

export default function Reserva() {
  const { funcionId } = useParams();
  const navigate = useNavigate();
  const [funcion, setFuncion] = useState(null);
  const [ocupados, setOcupados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReserva = async () => {
      try {
        setLoading(true);
        const [funcionData, ocupadosData] = await Promise.all([
          getFuncion(funcionId),
          getAsientosOcupados(funcionId)
        ]);
        setFuncion(funcionData);
        setOcupados(ocupadosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReserva();
  }, [funcionId]);

  const total = useMemo(
    () => seleccionados.length * Number(funcion?.precio || 0),
    [seleccionados, funcion]
  );

  const toggleSeat = (asiento) => {
    setSeleccionados((current) => {
      const exists = current.some((item) => item.fila === asiento.fila && item.columna === asiento.columna);
      return exists
        ? current.filter((item) => item.fila !== asiento.fila || item.columna !== asiento.columna)
        : [...current, asiento];
    });
  };

  const confirmar = async () => {
    try {
      setError('');
      await createReserva({ funcionId: Number(funcionId), asientos: seleccionados });
      navigate('/mis-reservas', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <main className="page-shell"><p className="empty-state">Cargando asientos...</p></main>;
  if (error && !funcion) return <main className="page-shell"><p className="alert-error">{error}</p></main>;

  return (
    <main className="page-shell">
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div>
            <p className="eyebrow">Reserva</p>
            <h1 className="page-title">{funcion.pelicula?.titulo}</h1>
            <p className="mt-2 font-semibold text-slate-600">
              {formatDate(funcion.fechaHora)} · {funcion.sala?.nombre} · ${formatMoney(funcion.precio)}
            </p>
          </div>

          {error && <p className="alert-error">{error}</p>}

          <SeatMap
            filas={funcion.sala?.filas || 0}
            columnas={funcion.sala?.columnas || 0}
            ocupados={ocupados}
            seleccionados={seleccionados}
            onToggle={toggleSeat}
          />
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-night">Resumen</h2>
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Asientos: {seleccionados.length ? seleccionados.map((a) => `F${a.fila}-C${a.columna}`).join(', ') : 'Ninguno'}
          </p>
          <p className="mt-2 text-2xl font-black text-cinema">${formatMoney(total)}</p>
          <button className="btn-primary mt-5 w-full" disabled={!seleccionados.length} onClick={confirmar}>
            Confirmar reserva
          </button>
          <Link className="btn-secondary mt-3 block text-center" to={`/pelicula/${funcion.peliculaId}`}>
            Volver al detalle
          </Link>
        </aside>
      </section>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 });
}
