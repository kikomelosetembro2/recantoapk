import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { OFFICIAL_ASSETS } from '../data/institutionalData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenAdmin: () => void;
  onJumpToVolunteer: () => void;
}

const NAV_LINKS = [
  { href: '#noticias', label: 'Notícias' },
  { href: '#vagas', label: 'Vagas' },
  { href: '#doacoes', label: 'Doar' },
  { href: '#producao', label: 'Produção' },
  { href: '#historia', label: 'História' },
];

export function Header({ onOpenAdmin, onJumpToVolunteer }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#15803D] bg-white/98 backdrop-blur-sm">
      <div className="h-1 w-full bg-[#FACC15]" aria-hidden="true" />
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-3.5">
        <a href="#inicio" className="flex min-w-0 items-center gap-3 group">
          <img
            src={OFFICIAL_ASSETS.logo}
            alt="Logo oficial Projeto Sopão Acre"
            referrerPolicy="no-referrer"
            className="h-11 w-11 shrink-0 rounded-full border-2 border-[#15803D] bg-white object-cover sm:h-12 sm:w-12"
          />
          <span className="font-serif text-base font-bold leading-tight tracking-tight text-[#14532D] transition-colors group-hover:text-[#15803D] sm:text-xl lg:whitespace-nowrap">
            Associação Recanto Social Bom Pastor
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#166534]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#052E16] hover:underline decoration-[#FACC15] decoration-2 underline-offset-4"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 hover:text-[#052E16] hover:underline decoration-[#FACC15] decoration-2 underline-offset-4"
          >
            Painel
          </button>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <PWAInstallButton compact />
          </div>

          <button
            type="button"
            onClick={onJumpToVolunteer}
            className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#14532D] whitespace-nowrap shrink-0"
          >
            Quero ser voluntário
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#BBF7D0] bg-white text-[#14532D] lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#BBF7D0] bg-white px-6 py-4 lg:hidden">
          <nav aria-label="Navegação móvel" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium text-[#14532D]"
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
              className="py-1.5 text-left text-sm font-medium text-[#14532D]"
            >
              Painel Administrativo
            </button>
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <PWAInstallButton />
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJumpToVolunteer();
                }}
                className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white"
              >
                Quero ser voluntário
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
