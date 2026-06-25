import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backendAssetUrl } from "../../api/client.js";
import { getPelicula } from "../../api/peliculas.js";

export default function DetallePelicula() {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPelicula = async () => {
      try {
        setLoading(true);
        setPelicula(await getPelicula(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPelicula();
  }, [id]);

  if (loading)
    return (
      <main className="page-shell">
        <p className="empty-state">Cargando película...</p>
      </main>
    );
  if (error)
    return (
      <main className="page-shell">
        <p className="alert-error">{error}</p>
      </main>
    );
  if (!pelicula) return null;

  const poster = backendAssetUrl(pelicula.imagenPoster);

  return (
    <main className="page-shell">
      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {poster ? (
          <img
            className="rounded-lg object-cover shadow-soft"
            src={poster}
            alt={`Poster de ${pelicula.titulo}`}
          />
        ) : (
          <div className="grid aspect-[3/4] place-items-center rounded-lg bg-night text-7xl font-black text-white">
            {pelicula.titulo.charAt(0)}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <p className="eyebrow">Detalle de película</p>
            <h1 className="page-title">{pelicula.titulo}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill">{pelicula.genero}</span>
              <span className="pill">{pelicula.clasificacion}</span>
              <span className="pill">{pelicula.duracion} min</span>
            </div>
          </div>

          <p className="max-w-3xl text-lg leading-8 text-slate-700">
            {pelicula.sinopsis}
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-night">
              Funciones disponibles
            </h2>
            {!pelicula.funciones?.length && (
              <p className="empty-state">
                Todavía no hay funciones para esta película.
              </p>
            )}
            {pelicula.funciones?.map((funcion) => {
              const isExpirada = new Date(funcion.fechaHora) < new Date();

              return (
                <article
                  key={funcion.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-black text-night">
                      {formatDate(funcion.fechaHora)}
                    </p>
                    <p className="text-sm font-semibold text-slate-600">
                      {funcion.sala?.nombre} · ${formatMoney(funcion.precio)}
                    </p>
                  </div>

                  {isExpirada ? (
                    <span className="btn-secondary cursor-not-allowed text-center opacity-60">
                      Expirada
                    </span>
                  ) : (
                    <Link
                      className="btn-primary text-center"
                      to={`/reserva/${funcion.id}`}
                    >
                      Reservar
                    </Link>
                  )}
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
  });
}
