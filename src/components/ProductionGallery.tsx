import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DOCUMENTARY_FIGURES, DocumentaryFigure } from '../data/institutionalData';

const GALLERY_FILTERS: Array<'Todos os registros' | DocumentaryFigure['category']> = [
  'Todos os registros',
  'Sopão & Refeições',
  'Pães & Bolos',
  'Porcionamento & Entrega',
];

export function ProductionGallery() {
  const [filter, setFilter] = useState<'Todos os registros' | DocumentaryFigure['category']>(
    'Todos os registros'
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleFigures = useMemo(() => {
    if (filter === 'Todos os registros') return DOCUMENTARY_FIGURES;
    return DOCUMENTARY_FIGURES.filter((fig) => fig.category === filter);
  }, [filter]);

  const activeFigure = selectedIndex !== null ? visibleFigures[selectedIndex] ?? null : null;

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((idx) => (idx === null ? null : (idx + 1) % visibleFigures.length));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((idx) =>
          idx === null ? null : (idx - 1 + visibleFigures.length) % visibleFigures.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, visibleFigures.length]);

  return (
    <section id="producao" className="border-b-2 border-[#BBF7D0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-6 border-b border-[#BBF7D0] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
              Capítulo 6 · Acervo Fotográfico Oficial
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#052E16] sm:text-4xl">
              Nossa produção própria de alimentos para doação
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#14532D]">
              Em sua sede no Bairro Olaria, voluntários e colaboradores dedicam-se ao preparo
              artesanal de pães caseiros, pãezinhos individuais, bolos fatiados, refeições
              acompanhadas de farofa temperada e o tradicional sopão comunitário.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar registros da produção própria"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] p-1"
          >
            {GALLERY_FILTERS.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(item);
                    setSelectedIndex(null);
                  }}
                  className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'text-[#14532D] hover:bg-white/80'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {visibleFigures.map((fig, index) => (
            <figure
              key={fig.id}
              className="group flex flex-col justify-between rounded-lg border-2 border-[#BBF7D0] bg-white p-4 transition-colors hover:border-[#FACC15]"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Ampliar ${fig.number} — ${fig.title}`}
                  className="relative block w-full cursor-pointer overflow-hidden rounded bg-[#F0FDF4] aspect-[4/3]"
                >
                  <img
                    src={fig.imageSrc}
                    alt={`${fig.number} — ${fig.title}: ${fig.caption}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute right-2.5 bottom-2.5 inline-flex h-8 w-8 items-center justify-center rounded border border-[#FACC15] bg-[#14532D]/90 text-[#FEF08A] opacity-90 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </button>

                <div className="mt-3.5">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#854D0E]">
                    {fig.number} · {fig.category}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#052E16]">
                    {fig.title}
                  </h3>
                  <figcaption className="mt-1.5 font-serif text-xs leading-relaxed italic text-[#166534]">
                    {fig.caption}
                  </figcaption>
                </div>
              </div>

              <div className="mt-4 border-t border-[#DCFCE7] pt-3 text-[11px] font-medium text-[#15803D]">
                {fig.chapterRef}
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Museum Accession Lightbox */}
      {activeFigure && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accession-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#052E16]/75 p-4 sm:p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="grid max-h-[90vh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-lg border-2 border-[#15803D] bg-white shadow-2xl lg:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center bg-[#F0FDF4] p-4 sm:p-8 lg:col-span-7">
              <img
                src={activeFigure.imageSrc}
                alt={`${activeFigure.number} — ${activeFigure.title}`}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto rounded border border-[#BBF7D0] object-contain shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#854D0E]">
                      Registro {activeFigure.accessionId}
                    </p>
                    <h3
                      id="accession-modal-title"
                      className="mt-1 font-serif text-2xl font-semibold text-[#052E16]"
                    >
                      {activeFigure.number} — {activeFigure.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(null)}
                    aria-label="Fechar visualização ampliada"
                    className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#86EFAC] bg-white text-[#052E16] hover:bg-[#FEFCE8]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 font-serif text-sm leading-relaxed italic text-[#14532D]">
                  {activeFigure.caption}
                </p>

                <dl className="mt-6 divide-y divide-[#DCFCE7] border-y border-[#BBF7D0] text-xs">
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#15803D]">Fonte documental</dt>
                    <dd className="font-semibold text-[#052E16]">{activeFigure.chapterRef}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#15803D]">Frente de produção</dt>
                    <dd className="font-semibold text-[#15803D]">{activeFigure.category}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#15803D]">Destinação</dt>
                    <dd className="text-right text-[#052E16]">{activeFigure.destination}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#15803D]">Local de preparo</dt>
                    <dd className="text-right text-[#052E16]">Sede Bairro Olaria · Plácido de Castro</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex(
                      (selectedIndex - 1 + visibleFigures.length) % visibleFigures.length
                    )
                  }
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#86EFAC] bg-white px-3.5 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#F0FDF4]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Anterior</span>
                </button>

                <span className="font-mono text-xs font-semibold tabular-nums text-[#854D0E]">
                  {selectedIndex + 1} / {visibleFigures.length}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % visibleFigures.length)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-3.5 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                >
                  <span>Próxima</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
