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
    <footer className="border-t border-[#E2DDD3] bg-[#F4F0E8] text-[#1C1917]">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-5">
            <img
              src={OFFICIAL_ASSETS.logo}
              alt="Logo Projeto Sopão Acre"
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-full border border-[#D6CEBE] bg-white object-cover"
            />
            <div>
              <p className="font-serif text-lg font-semibold text-[#1C1917]">
                {INSTITUTION_PROFILE.legalName}
              </p>
              <p className="mt-1 text-sm text-[#57534E]">
                {INSTITUTION_PROFILE.popularName} · Utilidade Pública Estadual (
                {INSTITUTION_PROFILE.stateLawShort})
              </p>
              <p className="mt-2 font-mono text-xs tabular-nums text-[#78716C]">
                CNPJ / PIX {INSTITUTION_PROFILE.cnpj} · PIX Tel +55 68 9958-7200
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-[#44403C] md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
              Sede e Contato Direto
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#14532D]" aria-hidden="true" />
              <span>
                {INSTITUTION_PROFILE.address}, {INSTITUTION_PROFILE.cityState} (
                {INSTITUTION_PROFILE.cep})
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#14532D]" aria-hidden="true" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-medium tabular-nums text-[#14532D] hover:underline underline-offset-4"
              >
                {INSTITUTION_PROFILE.phoneDisplay} (WhatsApp)
              </a>
            </p>
          </div>

          <div className="space-y-2.5 text-sm md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
              Navegação Institucional
            </p>
            <ul className="space-y-1.5 text-[#44403C]">
              <li>
                <a href="#vagas" className="hover:text-[#1C1917] hover:underline underline-offset-4">
                  Vagas de Voluntariado
                </a>
              </li>
              <li>
                <a href="#doacoes" className="hover:text-[#1C1917] hover:underline underline-offset-4">
                  Doar via PIX &amp; Agendar Coleta
                </a>
              </li>
              <li>
                <a href="#producao" className="hover:text-[#1C1917] hover:underline underline-offset-4">
                  Produção Própria de Alimentos
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEbook}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-[#14532D] font-medium hover:underline underline-offset-4"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>E-book Documental (PDF)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-[#44403C] font-medium hover:text-[#1C1917] hover:underline underline-offset-4"
                >
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Painel Administrativo &amp; Contabilidade</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2DDD3] pt-6 text-xs text-[#78716C]">
          <p>
            © {new Date().getFullYear()} {INSTITUTION_PROFILE.legalName}. Todos os registros
            baseados na Edição Documental Oficial.
          </p>
          <p>Bairro Olaria · Plácido de Castro, Acre</p>
        </div>
      </div>
    </footer>
  );
}
