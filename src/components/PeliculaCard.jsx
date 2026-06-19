import { Link } from 'react-router-dom';
import { backendAssetUrl } from '../api/client.js';

export default function PeliculaCard({ pelicula }) {
  const poster = backendAssetUrl(pelicula.imagenPoster);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      {poster ? (
        <img
          className="aspect-[3/4] w-full object-cover"
          src={poster}
          alt={`Poster de ${pelicula.titulo}`}
        />
      ) : (
        <div className="grid aspect-[3/4] place-items-center bg-gradient-to-br from-night to-cinema text-6xl font-black text-white">
          {pelicula.titulo?.charAt(0) || 'C'}
        </div>
      )}

      <div className="space-y-4 p-4">
        <div>
          <h2 className="line-clamp-2 text-xl font-black text-night">{pelicula.titulo}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{pelicula.sinopsis}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="pill">{pelicula.genero}</span>
          <span className="pill">{pelicula.clasificacion}</span>
          <span className="pill">{pelicula.duracion} min</span>
        </div>

        <Link className="btn-primary w-full text-center" to={`/pelicula/${pelicula.id}`}>
          Ver funciones
        </Link>
      </div>
    </article>
  );
}
