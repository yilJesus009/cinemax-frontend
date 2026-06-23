import { useEffect, useState } from "react";
import { getMisReservas } from "../../api/reservas.js";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservas = async () => {
      try {
        setReservas(await getMisReservas());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservas();
  }, []);

  return (
    <main className="page-shell">
      <div>
        <p className="eyebrow">Cliente</p>
        <h1 className="page-title">Mis reservas</h1>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {loading && <p className="empty-state">Cargando reservas...</p>}
      {!loading && !reservas.length && (
        <p className="empty-state">Todavía no tenés reservas.</p>
      )}

      <section className="grid gap-4">
        {reservas.map((reserva) => (
          <article
            key={reserva.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-black text-night">
              {reserva.funcion?.pelicula?.titulo}
            </h2>
            <p className="mt-1 font-semibold text-slate-600">
              {formatDate(reserva.funcion?.fechaHora)} ·{" "}
              {reserva.funcion?.sala?.nombre}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {reserva.asientos?.map((asiento) => (
                <span
                  key={asiento.id || `${asiento.fila}-${asiento.columna}`}
                  className="pill"
                >
                  F{asiento.fila}-C{asiento.columna}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "Fecha sin definir";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
