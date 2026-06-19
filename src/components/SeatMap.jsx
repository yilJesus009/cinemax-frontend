const seatKey = (fila, columna) => `${fila}-${columna}`;

export default function SeatMap({ filas, columnas, ocupados = [], seleccionados = [], onToggle }) {
  const occupied = new Set(ocupados.map((asiento) => seatKey(asiento.fila, asiento.columna)));
  const selected = new Set(seleccionados.map((asiento) => seatKey(asiento.fila, asiento.columna)));

  return (
    <section className="space-y-5">
      <div className="mx-auto max-w-xl rounded-full bg-night px-4 py-2 text-center text-xs font-black uppercase tracking-[0.25em] text-white">
        Pantalla
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid min-w-max gap-2">
          {Array.from({ length: filas }, (_, rowIndex) => {
            const fila = rowIndex + 1;
            return (
              <div key={fila} className="grid grid-flow-col items-center gap-2">
                <span className="w-8 text-right text-xs font-black text-slate-500">F{fila}</span>
                {Array.from({ length: columnas }, (_, columnIndex) => {
                  const columna = columnIndex + 1;
                  const key = seatKey(fila, columna);
                  const isOccupied = occupied.has(key);
                  const isSelected = selected.has(key);

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => onToggle({ fila, columna })}
                      className={`h-9 w-9 rounded-b-xl rounded-t-md border text-xs font-black transition ${
                        isOccupied
                          ? 'cursor-not-allowed border-slate-600 bg-slate-600 text-white'
                          : isSelected
                            ? 'border-cinema bg-cinema text-white'
                            : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-cinema hover:bg-red-50'
                      }`}
                      title={`Fila ${fila}, columna ${columna}`}
                    >
                      {columna}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
        <span className="legend bg-slate-100">Libre</span>
        <span className="legend bg-cinema text-white">Seleccionado</span>
        <span className="legend bg-slate-600 text-white">Ocupado</span>
      </div>
    </section>
  );
}
