import { useEffect, useMemo, useState } from 'react';
import PeliculaCard from '../../components/PeliculaCard.jsx';
import { getPeliculas } from '../../api/peliculas.js';

export default function Cartelera() {
  const [peliculas, setPeliculas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPeliculas = async () => {
      try {
        setLoading(true);
        setPeliculas(await getPeliculas());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPeliculas();
  }, []);

  const generos = useMemo(
    () => Array.from(new Set(peliculas.map((pelicula) => pelicula.genero).filter(Boolean))).sort(),
    [peliculas]
  );

  const peliculasFiltradas = useMemo(() => {
    return peliculas.filter((pelicula) => {
      const coincideTitulo = pelicula.titulo.toLowerCase().includes(titulo.toLowerCase());
      const coincideGenero = !genero || pelicula.genero === genero;
      return coincideTitulo && coincideGenero;
    });
  }, [peliculas, titulo, genero]);

  return (
    <main className="page-shell">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Acceso público</p>
          <h1 className="page-title">Cartelera</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Buscá películas, revisá sus funciones disponibles y reservá tus asientos.
          </p>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr]">
        <label className="field">
          Buscar por nombre
          <input value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Ej: Matrix" />
        </label>
        <label className="field">
          Filtrar por género
          <select value={genero} onChange={(event) => setGenero(event.target.value)}>
            <option value="">Todos los géneros</option>
            {generos.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      {error && <p className="alert-error">{error}</p>}
      {loading && <p className="empty-state">Cargando cartelera...</p>}

      {!loading && !peliculasFiltradas.length && (
        <p className="empty-state">No hay películas para mostrar.</p>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {peliculasFiltradas.map((pelicula) => (
          <PeliculaCard key={pelicula.id} pelicula={pelicula} />
        ))}
      </section>
    </main>
  );
}
