import { Download, Share, Smartphone, X } from 'lucide-react';
import { useState } from 'react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export function PWAInstallButton({ compact = false }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Instalar aplicativo com o ícone oficial Projeto Sopão"
        className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#CA8A04] bg-[#FACC15] font-bold text-[#052E16] transition-colors hover:bg-[#EAB308] whitespace-nowrap shrink-0 ${
          compact ? 'min-h-[36px] px-2.5 py-1.5 text-xs' : 'min-h-[40px] px-3 py-1.5 text-xs'
        }`}
      >
        <img
          src="/pwa-192x192.png"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 rounded-full border border-[#15803D] bg-white object-cover"
        />
        <span>Instalar App</span>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#052E16]/65 p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border-2 border-[#15803D] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#BBF7D0] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="Ícone oficial Projeto Sopão Acre para instalação"
                  className="h-14 w-14 rounded-xl border-2 border-[#15803D] bg-white object-cover shadow-sm"
                />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#15803D]">
                    Aplicativo Instalável (PWA)
                  </p>
                  <h3
                    id="pwa-install-guide-title"
                    className="font-serif text-lg font-bold text-[#052E16]"
                  >
                    Bom Pastor — Projeto Sopão
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Fechar instruções de instalação"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#BBF7D0] text-[#052E16] hover:bg-[#F0FDF4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#14532D]">
              {isIOS ? (
                <>
                  <p className="font-semibold text-[#052E16]">
                    Como instalar no iPhone ou iPad (Safari):
                  </p>
                  <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
                    <li>
                      Toque no botão{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-[#052E16]">
                        <Share className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                        Compartilhar
                      </span>{' '}
                      na barra inferior do Safari.
                    </li>
                    <li>
                      Role a lista e selecione{' '}
                      <strong className="text-[#052E16]">Adicionar à Tela de Início</strong>.
                    </li>
                    <li>
                      Confirme tocando em <strong className="text-[#052E16]">Adicionar</strong> para
                      fixar o ícone do Projeto Sopão.
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[#052E16]">
                    Como instalar no celular ou computador:
                  </p>
                  <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
                    <li>
                      Abra o aplicativo diretamente em uma aba dedicada do Chrome, Edge ou navegador
                      Android (fora do modo embutido, caso esteja em pré-visualização).
                    </li>
                    <li>
                      Toque no ícone{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-[#052E16]">
                        <Smartphone className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                        Instalar aplicativo
                      </span>{' '}
                      na barra de endereços ou no menu (<strong className="text-[#052E16]">⋮</strong>){' '}
                      → <strong className="text-[#052E16]">Adicionar à tela inicial</strong>.
                    </li>
                    <li>
                      O atalho será criado com o ícone oficial da logomarca Projeto Sopão (Acre).
                    </li>
                  </ol>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-md border border-[#CA8A04] bg-[#FEF9C3] px-3.5 py-2 text-xs font-semibold text-[#854D0E] shadow-lg"
    >
      <span className="h-2 w-2 rounded-full bg-[#15803D]" aria-hidden="true" />
      <span>Modo offline — exibindo dados em cache local.</span>
    </div>
  );
}
