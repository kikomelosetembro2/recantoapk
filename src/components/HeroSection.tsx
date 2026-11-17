import { ArrowRight, BookOpen } from 'lucide-react';
import { INSTITUTION_PROFILE, OFFICIAL_ASSETS } from '../data/institutionalData';
import { DonateButton } from './DonateButton';

interface HeroSectionProps {
  onOpenEbook: () => void;
  onJumpToVolunteer: () => void;
  onOpenDonate: () => void;
}

export function HeroSection({
  onOpenEbook,
  onJumpToVolunteer,
  onOpenDonate,
}: HeroSectionProps) {
  return (
    <section id="inicio" className="border-b-2 border-[#BBF7D0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-10 lg:pt-16 lg:pb-14">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="font-serif text-base font-bold tracking-tight text-[#15803D] sm:text-lg">
                {INSTITUTION_PROFILE.legalName}
                <span className="font-sans text-xs font-semibold text-[#854D0E]">
                  {' '}
                  · {INSTITUTION_PROFILE.cityState}
                </span>
              </p>

              <h1 className="mt-4 font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-semibold tracking-tight text-[#052E16]">
                Do sopão comunitário no Bairro Olaria à segurança alimentar em Plácido de Castro.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#14532D]">
                Organização da Sociedade Civil fundada em 26 de fevereiro de 2019 e reconhecida como
                Entidade de Utilidade Pública Estadual pela{' '}
                <span className="font-semibold text-[#052E16] underline decoration-[#FACC15] decoration-2 underline-offset-4">
                  {INSTITUTION_PROFILE.stateLawShort}
                </span>
                . Conhecida pela comunidade como{' '}
                <span className="font-semibold text-[#052E16]">Projeto Sopão</span>, a instituição
                mantém produção artesanal própria de sopas nutritivas, pães caseiros, bolos e kits
                alimentares distribuídos gratuitamente às famílias placidianas.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <DonateButton
                onClick={onOpenDonate}
                variant="primary"
                label="Doar via PIX / Produtos"
                showSecurityHint
              />

              <button
                type="button"
                onClick={onJumpToVolunteer}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#14532D] whitespace-nowrap shrink-0"
              >
                <span>Ver vagas de voluntariado</span>
                <ArrowRight className="h-4 w-4 text-[#FEF08A]" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenEbook}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border-2 border-[#BBF7D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#14532D] transition-colors duration-150 hover:border-[#FACC15] hover:bg-[#FEFCE8] whitespace-nowrap shrink-0"
              >
                <BookOpen className="h-4 w-4 text-[#15803D]" aria-hidden="true" />
                <span>E-book Oficial</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#BBF7D0] pt-5">
              <a
                href={`https://wa.me/${INSTITUTION_PROFILE.whatsappDigits}?text=${encodeURIComponent(
                  'Olá! Estou entrando em contato pelo site da Associação Recanto Social Bom Pastor (Projeto Sopão) para falar com a equipe.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Fale direto pelo WhatsApp da Associação Recanto Social Bom Pastor: ${INSTITUTION_PROFILE.phoneDisplay}`}
                className="inline-flex items-center rounded-md transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
              >
                <img
                  src={OFFICIAL_ASSETS.whatsappButton}
                  alt="Fale direto pelo WhatsApp"
                  referrerPolicy="no-referrer"
                  className="h-14 w-auto object-contain"
                />
              </a>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                  WhatsApp Oficial da Associação
                </p>
                <p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-[#052E16]">
                  {INSTITUTION_PROFILE.phoneDisplay}
                </p>
                <p className="text-xs text-[#166534]">
                  Atendimento direto para doações, recibos e coletas
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="relative flex-1 overflow-hidden rounded-lg border-2 border-[#15803D] bg-[#F0FDF4] min-h-[320px]">
              <img
                src="/assets/extracted/fig1_sopao_comunitario.jpg"
                alt="Refeição quente e nutritiva do Projeto Sopão em Plácido de Castro, Acre"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#052E16]/85 via-[#052E16]/20 to-transparent"
              />

              <div className="absolute top-4 right-4 h-20 w-20 overflow-hidden rounded-full border-2 border-[#FACC15] bg-white shadow-sm sm:h-24 sm:w-24">
                <img
                  src={OFFICIAL_ASSETS.logo}
                  alt="Selo oficial Projeto Sopão Acre — Contato 68 999587200"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-mono text-xs tracking-wider text-[#FEF08A]">
                  FIG. 1 · ARQUIVO DOCUMENTAL DA SEDE
                </p>
                <p className="mt-1 font-serif text-lg font-medium leading-snug">
                  Projeto Sopão Comunitário — Cozinha Solidária no Bairro Olaria
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#BBF7D0] pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-b border-[#BBF7D0] pb-4 sm:border-b-0 sm:border-r sm:pr-6 sm:pb-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                Fundação Formal
              </p>
              <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#052E16]">
                {INSTITUTION_PROFILE.foundedShort}
              </p>
              <p className="mt-0.5 text-xs text-[#166534]">Bairro Olaria · Plácido de Castro</p>
            </div>

            <div className="border-b border-[#BBF7D0] pb-4 lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                Registro CNPJ / PIX
              </p>
              <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#052E16]">
                {INSTITUTION_PROFILE.cnpj}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#854D0E]">
                PIX Tel: +55 68 9958-7200
              </p>
            </div>

            <div className="border-b border-[#BBF7D0] pb-4 sm:border-b-0 sm:border-r sm:pr-6 sm:pb-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                Utilidade Pública
              </p>
              <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#15803D]">
                Lei nº 3.809/2021
              </p>
              <p className="mt-0.5 text-xs text-[#166534]">Governo do Estado do Acre · DOE 24/11/21</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                Fomento &amp; Controle
              </p>
              <p className="mt-1 font-mono text-base font-semibold tabular-nums text-[#052E16]">
                R$ 100.000,00
              </p>
              <p className="mt-0.5 text-xs text-[#166534]">SEASDH Termo nº 25 · Editais TJAC</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
