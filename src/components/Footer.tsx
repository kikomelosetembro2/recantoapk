import { FileText, Lock, MapPin, Phone } from 'lucide-react';
import { INSTITUTION_PROFILE, OFFICIAL_ASSETS } from '../data/institutionalData';

interface FooterProps {
  onOpenEbook: () => void;
  onOpenAdmin: () => void;
}

export function Footer({ onOpenEbook, onOpenAdmin }: FooterProps) {
  const whatsappUrl = `https://wa.me/${INSTITUTION_PROFILE.whatsappDigits}?text=${encodeURIComponent(
    'Olá! Gostaria de saber mais sobre como ser voluntário ou apoiar o Projeto Sopão (Associação Recanto Social Bom Pastor).'
  )}`;

  return (
    <footer className="border-t-2 border-[#15803D] bg-[#F0FDF4] text-[#052E16]">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-5">
            <img
              src={OFFICIAL_ASSETS.logo}
              alt="Logo Projeto Sopão Acre"
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-full border-2 border-[#FACC15] bg-white object-cover"
            />
            <div>
              <p className="font-serif text-lg font-bold text-[#052E16]">
                {INSTITUTION_PROFILE.legalName}
              </p>
              <p className="mt-1 text-sm text-[#14532D]">
                {INSTITUTION_PROFILE.popularName} · Utilidade Pública Estadual (
                {INSTITUTION_PROFILE.stateLawShort})
              </p>
              <p className="mt-2 font-mono text-xs font-semibold tabular-nums text-[#854D0E]">
                CNPJ / PIX {INSTITUTION_PROFILE.cnpj} · PIX Tel +55 68 9958-7200
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-[#14532D] md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
              Sede e Contato Direto
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" aria-hidden="true" />
              <span>
                {INSTITUTION_PROFILE.address}, {INSTITUTION_PROFILE.cityState} (
                {INSTITUTION_PROFILE.cep})
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#15803D]" aria-hidden="true" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-semibold tabular-nums text-[#15803D] hover:underline underline-offset-4"
              >
                {INSTITUTION_PROFILE.phoneDisplay} (WhatsApp)
              </a>
            </p>
          </div>

          <div className="space-y-2.5 text-sm md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
              Navegação Institucional
            </p>
            <ul className="space-y-1.5 text-[#14532D]">
              <li>
                <a href="#noticias" className="hover:text-[#052E16] hover:underline underline-offset-4">
                  Notícias e Ações Recentes
                </a>
              </li>
              <li>
                <a href="#vagas" className="hover:text-[#052E16] hover:underline underline-offset-4">
                  Vagas de Voluntariado
                </a>
              </li>
              <li>
                <a href="#doacoes" className="hover:text-[#052E16] hover:underline underline-offset-4">
                  Doar via PIX &amp; Agendar Coleta
                </a>
              </li>
              <li>
                <a href="#producao" className="hover:text-[#052E16] hover:underline underline-offset-4">
                  Produção Própria de Alimentos
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEbook}
                  className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-[#15803D] hover:underline underline-offset-4"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>E-book Documental (PDF)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-[#854D0E] hover:text-[#052E16] hover:underline underline-offset-4"
                >
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Painel Administrativo &amp; Contabilidade</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#BBF7D0] pt-6 text-xs text-[#166534]">
          <p>
            © {new Date().getFullYear()} {INSTITUTION_PROFILE.legalName}. Todos os registros
            baseados na Edição Documental Oficial.
          </p>
          <p className="font-semibold text-[#15803D]">Bairro Olaria · Plácido de Castro, Acre</p>
        </div>
      </div>
    </footer>
  );
}
