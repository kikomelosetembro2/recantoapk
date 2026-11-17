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
    primary: 'bg-[#FACC15] text-[#052E16] hover:bg-[#EAB308] border border-[#CA8A04]',
    accent: 'bg-[#15803D] text-white hover:bg-[#14532D] border border-transparent',
    outline: 'bg-white text-[#14532D] border border-[#15803D] hover:bg-[#F0FDF4]',
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
