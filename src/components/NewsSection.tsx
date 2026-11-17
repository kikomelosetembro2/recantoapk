import { ArrowUpRight, Calendar, MapPin, Newspaper, PenSquare, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  NewsPostCategory,
  NewsPostRecord,
  useDonationsStore,
} from '../data/donationsStore';
import { INSTITUTION_PROFILE, OFFICIAL_ASSETS } from '../data/institutionalData';

interface NewsSectionProps {
  onOpenAdminNews: () => void;
  onOpenDonate: () => void;
}

const NEWS_CATEGORIES: Array<'Todas' | NewsPostCategory> = [
  'Todas',
  'Ação Comunitária',
  'Panificação & Cozinha',
  'Editais & Transparência',
  'Campanha de Doação',
];

function formatDatePtBR(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function NewsSection({ onOpenAdminNews, onOpenDonate }: NewsSectionProps) {
  const { newsPosts } = useDonationsStore();
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | NewsPostCategory>('Todas');
  const [activePost, setActivePost] = useState<NewsPostRecord | null>(null);

  const publishedPosts = useMemo(() => {
    return newsPosts.filter(
      (post) => post.published && (selectedCategory === 'Todas' || post.category === selectedCategory)
    );
  }, [newsPosts, selectedCategory]);

  const leadPost = publishedPosts[0] ?? null;
  const secondaryPosts = publishedPosts.slice(1);

  useEffect(() => {
    if (!activePost) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePost]);

  return (
    <section id="noticias" className="border-b-2 border-[#BBF7D0] bg-[#F0FDF4]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#BBF7D0] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#854D0E]">
              Diário Comunitário · Plácido de Castro, AC
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#052E16] sm:text-4xl">
              Notícias e Ações Recentes
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#14532D]">
              Acompanhe as entregas semanais do Projeto Sopão, fornadas da padaria solidária,
              rotas comunitárias e atualizações de transparência da Associação Recanto Social Bom
              Pastor.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdminNews}
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-md border-2 border-[#15803D] bg-white px-4 py-2 text-xs font-semibold text-[#15803D] transition-colors hover:bg-[#15803D] hover:text-white whitespace-nowrap shrink-0"
          >
            <PenSquare className="h-4 w-4" aria-hidden="true" />
            <span>Publicar notícia (Painel)</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrar notícias por categoria"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] p-1"
          >
            {NEWS_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'text-[#14532D] hover:bg-white/80'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs font-medium tabular-nums text-[#15803D]">
            {publishedPosts.length}{' '}
            {publishedPosts.length === 1 ? 'publicação ativa' : 'publicações ativas'}
          </p>
        </div>

        {publishedPosts.length === 0 ? (
          <div className="mt-8 rounded-lg border-2 border-[#BBF7D0] bg-white p-10 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-[#15803D]" aria-hidden="true" />
            <p className="mt-3 font-serif text-xl font-semibold text-[#052E16]">
              Nenhuma notícia publicada nesta categoria
            </p>
            <p className="mt-1.5 text-sm text-[#14532D]">
              Selecione outra categoria acima ou publique uma nova ação pelo painel administrativo.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Lead Featured Story */}
            {leadPost && (
              <article className="grid grid-cols-1 overflow-hidden rounded-lg border-2 border-[#BBF7D0] bg-white lg:grid-cols-12">
                <div className="relative min-h-[240px] bg-[#DCFCE7] lg:col-span-5">
                  <img
                    src={leadPost.imageSrc || OFFICIAL_ASSETS.logo}
                    alt={leadPost.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="h-1.5 w-full bg-[#FACC15] lg:hidden" aria-hidden="true" />
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold uppercase tracking-wider text-[#854D0E]">
                        Destaque · {leadPost.category}
                      </span>
                      <span aria-hidden="true" className="text-[#15803D]">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#15803D]">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDatePtBR(leadPost.publishedAt)}
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-[#052E16] sm:text-3xl">
                      {leadPost.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#14532D] sm:text-base">
                      {leadPost.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCFCE7] pt-5">
                    <div className="space-y-0.5 text-xs">
                      <p className="flex items-center gap-1.5 font-medium text-[#166534]">
                        <MapPin className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                        <span>{leadPost.location}</span>
                      </p>
                      {leadPost.highlightMetric && (
                        <p className="font-mono font-semibold text-[#854D0E]">
                          {leadPost.highlightMetric}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePost(leadPost)}
                      className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] transition-colors hover:bg-[#EAB308] whitespace-nowrap shrink-0"
                    >
                      <span>Ler matéria completa</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Secondary Stories Grid */}
            {secondaryPosts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {secondaryPosts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col justify-between overflow-hidden rounded-lg border-2 border-[#BBF7D0] bg-white transition-colors hover:border-[#15803D]"
                  >
                    <div>
                      <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#BBF7D0] bg-[#DCFCE7]">
                        <img
                          src={post.imageSrc || OFFICIAL_ASSETS.logo}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-[#854D0E]">{post.category}</span>
                          <span aria-hidden="true" className="text-[#15803D]">
                            ·
                          </span>
                          <span className="font-mono tabular-nums text-[#15803D]">
                            {formatDatePtBR(post.publishedAt)}
                          </span>
                        </div>

                        <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#052E16]">
                          {post.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-[#14532D]">{post.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#DCFCE7] px-5 py-3.5">
                      <span className="truncate text-[11px] font-medium text-[#166534]">
                        {post.highlightMetric || post.location}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActivePost(post)}
                        className="cursor-pointer text-xs font-bold text-[#15803D] hover:text-[#052E16] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                      >
                        Ler mais →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-reader-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#052E16]/75 p-4 sm:p-6"
          onClick={() => setActivePost(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border-2 border-[#15803D] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#BBF7D0] bg-[#F0FDF4] px-6 py-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#854D0E]">
                  {activePost.category} · {formatDatePtBR(activePost.publishedAt)}
                </p>
                <h3
                  id="news-reader-title"
                  className="mt-1 font-serif text-xl font-semibold text-[#052E16] sm:text-2xl"
                >
                  {activePost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label="Fechar notícia"
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#86EFAC] bg-white text-[#052E16] hover:bg-[#FEFCE8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5">
              {activePost.imageSrc && (
                <div className="overflow-hidden rounded-lg border border-[#BBF7D0] bg-[#F0FDF4]">
                  <img
                    src={activePost.imageSrc}
                    alt={activePost.title}
                    referrerPolicy="no-referrer"
                    className="max-h-72 w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCFCE7] pb-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#15803D]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {activePost.location}
                </span>
                {activePost.highlightMetric && (
                  <span className="font-mono font-bold text-[#854D0E]">
                    {activePost.highlightMetric}
                  </span>
                )}
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-[#14532D] sm:text-[15px]">
                <p className="font-semibold text-[#052E16]">{activePost.summary}</p>
                <p className="whitespace-pre-line">{activePost.fullText}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#BBF7D0] pt-4">
                <a
                  href={`https://wa.me/${INSTITUTION_PROFILE.whatsappDigits}?text=${encodeURIComponent(
                    `Olá, Projeto Sopão! Li a notícia "${activePost.title}" e gostaria de saber como ajudar.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border-2 border-[#15803D] bg-white px-4 py-2 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4]"
                >
                  <span>Falar sobre esta ação no WhatsApp</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setActivePost(null);
                    onOpenDonate();
                  }}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                >
                  <span>Apoiar com doação</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
