import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { OFFICIAL_ASSETS } from '../data/institutionalData';

interface HeaderProps {
  onOpenAdmin: () => void;
  onJumpToVolunteer: () => void;
}

const NAV_LINKS = [
  { href: '#vagas', label: 'Vagas' },
  { href: '#doacoes', label: 'Doar' },
  { href: '#producao', label: 'Produção' },
  { href: '#historia', label: 'História' },
];

export function Header({ onOpenAdmin, onJumpToVolunteer }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#D6CEBE] bg-[#FBF9F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-8 px-6 py-3.5">
        <a
          href="#inicio"
          className="flex min-w-0 items-center gap-3 group"
        >
          <img
            src={OFFICIAL_ASSETS.logo}
            alt="Logo oficial Projeto Sopão Acre"
            referrerPolicy="no-referrer"
            className="h-11 w-11 shrink-0 rounded-full border border-[#14532D]/30 bg-white object-cover shadow-xs sm:h-12 sm:w-12"
          />
          <span className="font-serif text-base font-bold leading-tight tracking-tight text-[#14532D] transition-colors group-hover:text-[#0F3F22] sm:text-xl lg:whitespace-nowrap">
            Associação Recanto Social Bom Pastor
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#1C1917] hover:underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 hover:text-[#1C1917] hover:underline underline-offset-4"
          >
            Painel
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onJumpToVolunteer}
            className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#0F3F22] whitespace-nowrap shrink-0"
          >
            Quero ser voluntário
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E2DDD3] text-[#1C1917] lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#E2DDD3] bg-[#FBF9F5] px-6 py-4 lg:hidden">
          <nav aria-label="Navegação móvel" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium text-[#1C1917]"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="py-1.5 text-left text-sm font-medium text-[#1C1917]"
            >
              Painel Administrativo
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onJumpToVolunteer();
              }}
              className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#14532D] px-4 py-2 text-sm font-semibold text-white"
            >
              Quero ser voluntário
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
