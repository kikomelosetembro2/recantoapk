import { HeartHandshake, ShieldCheck } from 'lucide-react';

interface DonateButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'accent';
  label?: string;
  showSecurityHint?: boolean;
  className?: string;
}

export function DonateButton({
  onClick,
  variant = 'primary',
  label = 'Doar agora (PIX / Produtos)',
  showSecurityHint = false,
  className = '',
}: DonateButtonProps) {
  const variantClasses = {
    primary: 'bg-[#9A3412] text-white hover:bg-[#7C2D12] border border-transparent',
    accent: 'bg-[#14532D] text-white hover:bg-[#0F3F22] border border-transparent',
    outline: 'bg-white text-[#9A3412] border border-[#9A3412]/40 hover:bg-[#FFF7ED]',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 ${variantClasses} ${className}`}
    >
      {showSecurityHint ? (
        <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <HeartHandshake className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
}
