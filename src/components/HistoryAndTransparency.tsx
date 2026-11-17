import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import {
  INSTITUTIONAL_CHAPTERS,
  INSTITUTION_SPECS,
  TIMELINE_EVENTS,
} from '../data/institutionalData';

interface HistoryAndTransparencyProps {
  onOpenEbook: () => void;
}

export function HistoryAndTransparency({ onOpenEbook }: HistoryAndTransparencyProps) {
  const [activeChapterId, setActiveChapterId] = useState(INSTITUTIONAL_CHAPTERS[0].id);

  const activeChapter =
    INSTITUTIONAL_CHAPTERS.find((c) => c.id === activeChapterId) ?? INSTITUTIONAL_CHAPTERS[0];

  return (
    <>
      {/* Editorial History & Chapter Reader */}
      <section id="historia" className="border-b border-[#E2DDD3] bg-[#FBF9F5]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
              Documentário Institucional &amp; Histórico
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl">
              Do Projeto Sopão Comunitário ao Reconhecimento e Fomento Estadual
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Chapter Index Rail */}
            <aside className="lg:col-span-4">
              <div className="rounded-lg border border-[#E2DDD3] bg-white p-2">
                <p className="px-3 py-2 text-xs font-medium uppercase tracking-widest text-[#78716C]">
                  Índice de Capítulos
                </p>
                <div role="tablist" aria-label="Capítulos da história institucional" className="space-y-1">
                  {INSTITUTIONAL_CHAPTERS.map((chapter) => {
                    const isSelected = chapter.id === activeChapter.id;
                    return (
                      <button
                        key={chapter.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveChapterId(chapter.id)}
                        className={`w-full cursor-pointer rounded-md px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-[#14532D] text-white'
                            : 'text-[#1C1917] hover:bg-[#F5F1E8]'
                        }`}
                      >
                        <p
                          className={`font-mono text-[11px] uppercase tracking-wider ${
                            isSelected ? 'text-white/80' : 'text-[#78716C]'
                          }`}
                        >
                          {chapter.index}
                        </p>
                        <p className="mt-0.5 text-sm font-medium leading-snug">{chapter.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-[#E2DDD3] bg-[#F4F0E8] p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
                  Consulta integral
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#44403C]">
                  Acesse o documento completo em PDF com todas as 11 páginas diagramadas para
                  consulta documental e transparência.
                </p>
                <button
                  type="button"
                  onClick={onOpenEbook}
                  className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#14532D] bg-white px-4 py-2 text-xs font-semibold text-[#14532D] transition-colors hover:bg-[#14532D] hover:text-white"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>Abrir E-book Oficial</span>
                </button>
              </div>
            </aside>

            {/* Main Reading Column */}
            <article className="lg:col-span-8">
              <div className="rounded-lg border border-[#E2DDD3] bg-white p-6 sm:p-10">
                <p className="font-mono text-xs uppercase tracking-widest text-[#14532D]">
                  {activeChapter.index} · {activeChapter.subtitle}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                  {activeChapter.title}
                </h3>

                {activeChapter.quote && (
                  <blockquote className="my-7 border-y border-[#E2DDD3] py-6 font-serif text-xl leading-relaxed italic text-[#292524] sm:text-2xl">
                    {activeChapter.quote}
                  </blockquote>
                )}

                <div className="mt-6 max-w-prose space-y-4 text-[15px] leading-[1.75] text-[#44403C]">
                  {activeChapter.paragraphs.map((paragraph, idx) => (
                    <p
                      key={paragraph}
                      className={
                        idx === 0
                          ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-none first-letter:text-[#14532D]'
                          : ''
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {activeChapter.highlights && (
                  <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#E2DDD3] pt-6 sm:grid-cols-3">
                    {activeChapter.highlights.map((item) => (
                      <div key={item.title}>
                        <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#57534E]">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Transparency, Legal Timeline & Technical Sheet */}
      <section id="transparencia" className="bg-[#FBF9F5]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Timeline Ledger */}
            <div className="lg:col-span-7">
              <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
                Marcos Legais e Parcerias
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1C1917]">
                Linha do tempo cronológica (2019–2026)
              </h2>

              <div className="mt-8 divide-y divide-[#E2DDD3] border-y border-[#E2DDD3]">
                {TIMELINE_EVENTS.map((event) => (
                  <div
                    key={event.date}
                    className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-12 sm:gap-6"
                  >
                    <div className="sm:col-span-3">
                      <p className="font-mono text-sm font-medium tabular-nums text-[#14532D]">
                        {event.date}
                      </p>
                    </div>
                    <div className="sm:col-span-9">
                      <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                        {event.title}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs text-[#78716C]">{event.instrument}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#44403C]">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ficha Técnica Oficial */}
            <div className="lg:col-span-5">
              <div className="rounded-lg border border-[#E2DDD3] bg-white p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
                  Identificação Institucional
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1C1917]">
                  Ficha Técnica Oficial
                </h2>
                <p className="mt-2 text-sm text-[#57534E]">
                  Dados oficiais registrados no e-book documental da Associação Recanto Social Bom
                  Pastor.
                </p>

                <dl className="mt-6 divide-y divide-[#E2DDD3] border-t border-[#E2DDD3] text-sm">
                  {INSTITUTION_SPECS.map((spec) => (
                    <div key={spec.label} className="py-3.5">
                      <dt className="text-xs uppercase tracking-wider text-[#78716C]">
                        {spec.label}
                      </dt>
                      <dd
                        className={`mt-1 text-[#1C1917] ${
                          spec.mono ? 'font-mono tabular-nums font-medium' : 'font-medium'
                        }`}
                      >
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
