import { Download, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { INSTITUTION_PROFILE, OFFICIAL_ASSETS } from '../data/institutionalData';

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EbookModal({ isOpen, onClose }: EbookModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ebook-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#052E16]/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border-2 border-[#15803D] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#BBF7D0] bg-[#F0FDF4] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#854D0E]">
              Edição Documental Oficial · 11 Páginas
            </p>
            <h2 id="ebook-modal-title" className="font-serif text-lg font-semibold text-[#052E16]">
              História da {INSTITUTION_PROFILE.legalName}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={OFFICIAL_ASSETS.ebookPdf}
              download="E-book_Historico_Associacao_Recanto_Social_Bom_Pastor.pdf"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] transition-colors hover:bg-[#EAB308] whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Baixar PDF</span>
            </a>

            <a
              href={OFFICIAL_ASSETS.ebookPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#15803D] bg-white px-4 py-2 text-xs font-semibold text-[#15803D] transition-colors hover:bg-[#F0FDF4] whitespace-nowrap shrink-0"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span>Nova aba</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar visualizador do e-book"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#86EFAC] bg-white text-[#052E16] transition-colors hover:bg-[#FEFCE8]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#F0FDF4]">
          <iframe
            title="E-book Histórico da Associação Recanto Social Bom Pastor"
            src={OFFICIAL_ASSETS.ebookPdf}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
