import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  MessageCircle,
  QrCode,
  Truck,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  buildMonthlyDonorWhatsappUrl,
  buildPickupWhatsappUrl,
  buildPixPayload,
  PickupItemSelection,
  PIX_INFO,
  useDonationsStore,
} from '../data/donationsStore';

interface DonationModalProps {
  isOpen: boolean;
  initialTab?: 'pix' | 'monthly' | 'pickup';
  onClose: () => void;
}

const PRESET_AMOUNTS = [30, 50, 100, 200];

function PixQrMatrix() {
  const size = 21;
  const cells: boolean[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= size - 7;
      const inBottomLeft = r >= size - 7 && c < 7;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const lr = r < 7 ? r : r - (size - 7);
        const lc = c < 7 ? c : c - (size - 7);
        const isBorder = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const isCenter = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        cells.push(isBorder || isCenter);
      } else if (r === 6 || c === 6) {
        cells.push((r + c) % 2 === 0);
      } else {
        const hash = (r * 31 + c * 17 + 7) % 11;
        cells.push(hash === 0 || hash === 2 || hash === 5 || hash === 8);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-36 w-36 rounded border border-[#E2DDD3] bg-white p-2"
      role="img"
      aria-label="QR Code PIX da Associação Recanto Social Bom Pastor"
    >
      {cells.map((filled, idx) => {
        if (!filled) return null;
        const x = idx % size;
        const y = Math.floor(idx / size);
        return <rect key={idx} x={x} y={y} width={1} height={1} fill="#1C1917" />;
      })}
    </svg>
  );
}

export function DonationModal({
  isOpen,
  initialTab = 'pix',
  onClose,
}: DonationModalProps) {
  const { products, addDonation, addMonthlyDonor, addPickupSchedule } = useDonationsStore();

  const [tab, setTab] = useState<'pix' | 'monthly' | 'pickup'>(initialTab);
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [pixKeyOption, setPixKeyOption] = useState<'cnpj' | 'phone'>('cnpj');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Gateway Cartão/Boleto'>('PIX');
  const [copiedField, setCopiedField] = useState<'cnpj' | 'phone' | 'payload' | null>(null);

  // Single donation form
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorNotes, setDonorNotes] = useState('');
  const [donationSuccessCode, setDonationSuccessCode] = useState<string | null>(null);

  // Monthly donor form
  const [monthlyAmount, setMonthlyAmount] = useState<number>(50);
  const [monthlyCustomAmount, setMonthlyCustomAmount] = useState('');
  const [monthlyName, setMonthlyName] = useState('');
  const [monthlyEmail, setMonthlyEmail] = useState('');
  const [monthlyPhone, setMonthlyPhone] = useState('');
  const [monthlyDueDay, setMonthlyDueDay] = useState<number>(10);
  const [monthlyPixChannel, setMonthlyPixChannel] = useState<
    'CNPJ 33.314.701/0001-54' | 'Telefone +55 68 9958-7200'
  >('Telefone +55 68 9958-7200');
  const [monthlyPaidNow, setMonthlyPaidNow] = useState(true);
  const [monthlySuccessUrl, setMonthlySuccessUrl] = useState<string | null>(null);

  // Pickup tab state
  const [collabName, setCollabName] = useState('');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabPhone, setCollabPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-20');
  const [preferredShift, setPreferredShift] = useState<
    'Manhã (08h–12h)' | 'Tarde (14h–18h)' | 'Sábado (08h–12h)'
  >('Manhã (08h–12h)');
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [customItemsText, setCustomItemsText] = useState('');
  const [pickupError, setPickupError] = useState('');
  const [pickupSubmittedUrl, setPickupSubmittedUrl] = useState<string | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const effectiveAmount = useMemo(() => {
    const parsed = Number(customAmount.replace(',', '.'));
    return customAmount && !Number.isNaN(parsed) && parsed > 0 ? parsed : amount;
  }, [amount, customAmount]);

  const effectiveMonthlyAmount = useMemo(() => {
    const parsed = Number(monthlyCustomAmount.replace(',', '.'));
    return monthlyCustomAmount && !Number.isNaN(parsed) && parsed > 0 ? parsed : monthlyAmount;
  }, [monthlyAmount, monthlyCustomAmount]);

  const pixPayload = useMemo(
    () =>
      buildPixPayload(
        tab === 'monthly' ? effectiveMonthlyAmount : effectiveAmount,
        tab === 'monthly'
          ? monthlyPixChannel.includes('Telefone')
            ? 'phone'
            : 'cnpj'
          : pixKeyOption
      ),
    [tab, effectiveAmount, effectiveMonthlyAmount, pixKeyOption, monthlyPixChannel]
  );

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const chosenPickupItems: PickupItemSelection[] = useMemo(() => {
    return activeProducts
      .filter((p) => (selectedQuantities[p.id] ?? 0) > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: selectedQuantities[p.id],
        unit: p.unit,
      }));
  }, [activeProducts, selectedQuantities]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, field: 'cnpj' | 'phone' | 'payload') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(field);
    }
  };

  const handleConfirmFinancialDonation = (e: FormEvent) => {
    e.preventDefault();
    const record = addDonation({
      donorName: donorName.trim() || 'Colaborador Anônimo',
      donorEmail: donorEmail.trim() || 'nao-informado@colaborador.org',
      donorPhone: donorPhone.trim() || '(68) não informado',
      type: paymentMethod,
      amountBRL: effectiveAmount,
      status: paymentMethod === 'PIX' ? 'Em Conferência' : 'Recebida',
      notes:
        donorNotes.trim() ||
        `Contribuição via ${paymentMethod} (${
          pixKeyOption === 'phone' ? PIX_INFO.pixPhoneDisplay : PIX_INFO.pixKey
        }).`,
    });

    setDonationSuccessCode(record.referenceCode);
    setDonorName('');
    setDonorEmail('');
    setDonorPhone('');
    setDonorNotes('');
  };

  const handleRegisterMonthlyDonor = (e: FormEvent) => {
    e.preventDefault();
    const donor = addMonthlyDonor({
      name: monthlyName.trim(),
      email: monthlyEmail.trim(),
      phone: monthlyPhone.trim(),
      monthlyAmountBRL: effectiveMonthlyAmount,
      dueDay: monthlyDueDay,
      pixChannel: monthlyPixChannel,
      paidFirstMonthNow: monthlyPaidNow,
      notes: `Adesão via portal com PIX ${monthlyPixChannel}.`,
    });

    setMonthlySuccessUrl(
      buildMonthlyDonorWhatsappUrl({
        name: donor.name,
        monthlyAmountBRL: donor.monthlyAmountBRL,
        dueDay: donor.dueDay,
        pixChannel: donor.pixChannel,
      })
    );
    setMonthlyName('');
    setMonthlyEmail('');
    setMonthlyPhone('');
  };

  const handleSchedulePickup = (e: FormEvent) => {
    e.preventDefault();
    if (collabName.trim().length < 3) {
      setPickupError('Informe o nome completo do colaborador.');
      return;
    }
    if (!collabEmail.includes('@')) {
      setPickupError('Informe um e-mail válido para contato.');
      return;
    }
    if (collabPhone.replace(/\D/g, '').length < 8) {
      setPickupError('Informe um telefone/WhatsApp válido com DDD.');
      return;
    }
    if (pickupAddress.trim().length < 5) {
      setPickupError('Informe o endereço ou ponto de referência para coleta.');
      return;
    }
    if (chosenPickupItems.length === 0 && !customItemsText.trim()) {
      setPickupError('Selecione ao menos um produto da lista ou descreva os itens a doar.');
      return;
    }

    const payload = {
      collaboratorName: collabName.trim(),
      collaboratorEmail: collabEmail.trim(),
      collaboratorPhone: collabPhone.trim(),
      pickupAddress: pickupAddress.trim(),
      preferredDate,
      preferredShift,
      items: chosenPickupItems,
      customItemsText: customItemsText.trim(),
    };

    addPickupSchedule(payload);
    setPickupError('');
    setPickupSubmittedUrl(buildPickupWhatsappUrl(payload));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DDD3] bg-white px-6 py-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#14532D]">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                PIX CNPJ {PIX_INFO.pixKey} · PIX Telefone {PIX_INFO.pixPhoneDisplay}
              </span>
            </p>
            <h2 id="donation-modal-title" className="mt-1 font-serif text-xl font-semibold text-[#1C1917]">
              Apoiar a {PIX_INFO.beneficiary}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de doação"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#E2DDD3] text-[#1C1917] hover:bg-[#EFEBE3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="border-b border-[#E2DDD3] bg-[#F4F0E8] px-6 py-3">
          <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-lg bg-[#E8E2D5] p-1">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'pix'}
              onClick={() => setTab('pix')}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                tab === 'pix'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
              <span>PIX &amp; Pagamento Único</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'monthly'}
              onClick={() => setTab('monthly')}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                tab === 'monthly'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Doador Mensal (PIX)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'pickup'}
              onClick={() => setTab('pickup')}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                tab === 'pickup'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Agendar Coleta de Produtos</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {tab === 'pix' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
                    1. Valor e Chave PIX Oficial
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {PRESET_AMOUNTS.map((val) => {
                      const active = !customAmount && amount === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setAmount(val);
                            setCustomAmount('');
                          }}
                          className={`min-h-[42px] cursor-pointer rounded-md border font-mono text-xs font-medium tabular-nums transition-colors ${
                            active
                              ? 'border-[#14532D] bg-[#14532D] text-white'
                              : 'border-[#D6CEBE] bg-white text-[#1C1917] hover:bg-[#F4F0E8]'
                          }`}
                        >
                          R$ {val}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="custom-donation-amount" className="block text-xs text-[#57534E]">
                      Ou informe outro valor (R$)
                    </label>
                    <input
                      id="custom-donation-amount"
                      type="number"
                      min="5"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Ex.: 150"
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 font-mono text-sm tabular-nums text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                      paymentMethod === 'PIX'
                        ? 'border-[#14532D] bg-[#14532D]/10 text-[#14532D]'
                        : 'border-[#D6CEBE] bg-white text-[#57534E]'
                    }`}
                  >
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    <span>PIX Instantâneo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Gateway Cartão/Boleto')}
                    className={`flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                      paymentMethod === 'Gateway Cartão/Boleto'
                        ? 'border-[#14532D] bg-[#14532D]/10 text-[#14532D]'
                        : 'border-[#D6CEBE] bg-white text-[#57534E]'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    <span>Cartão / Boleto</span>
                  </button>
                </div>

                {/* Dual PIX Key Card */}
                <div className="rounded-lg border border-[#E2DDD3] bg-white p-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPixKeyOption('cnpj')}
                      className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold ${
                        pixKeyOption === 'cnpj'
                          ? 'bg-[#14532D] text-white'
                          : 'bg-[#F4F0E8] text-[#57534E]'
                      }`}
                    >
                      Chave CNPJ: {PIX_INFO.pixKey}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPixKeyOption('phone')}
                      className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold ${
                        pixKeyOption === 'phone'
                          ? 'bg-[#14532D] text-white'
                          : 'bg-[#F4F0E8] text-[#57534E]'
                      }`}
                    >
                      Chave Telefone: {PIX_INFO.pixPhoneDisplay}
                    </button>
                  </div>

                  <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                    <PixQrMatrix />
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-xs text-[#57534E]">
                        Favorecido: <strong className="text-[#1C1917]">{PIX_INFO.beneficiary}</strong>
                      </p>
                      <p className="text-xs text-[#57534E]">
                        Chave selecionada:{' '}
                        <span className="font-mono font-semibold tabular-nums text-[#1C1917]">
                          {pixKeyOption === 'phone' ? PIX_INFO.pixPhoneDisplay : PIX_INFO.pixKey}
                        </span>
                      </p>
                      <p className="font-mono text-sm font-semibold tabular-nums text-[#14532D]">
                        Valor: R$ {effectiveAmount.toFixed(2).replace('.', ',')}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              pixKeyOption === 'phone' ? PIX_INFO.pixPhoneKey : PIX_INFO.pixKey,
                              pixKeyOption
                            )
                          }
                          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-1.5 text-xs font-medium text-[#1C1917] hover:bg-[#EFEBE3]"
                        >
                          {copiedField === pixKeyOption ? (
                            <Check className="h-3.5 w-3.5 text-[#14532D]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>
                            {copiedField === pixKeyOption ? 'Chave copiada' : 'Copiar chave'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(pixPayload, 'payload')}
                          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded border border-[#14532D] bg-[#14532D] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0F3F22]"
                        >
                          {copiedField === 'payload' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>
                            {copiedField === 'payload' ? 'PIX copiado' : 'PIX Copia e Cola'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-lg border border-[#E2DDD3] bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
                    2. Registrar no controle contábil da associação
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#1C1917]">
                    {paymentMethod === 'PIX'
                      ? 'Confirmar transferência ou intenção PIX'
                      : 'Checkout Seguro · Cartão ou Boleto'}
                  </h3>

                  {donationSuccessCode ? (
                    <div className="mt-5 space-y-4 rounded-lg border border-[#14532D]/30 bg-[#FBF9F5] p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14532D]" />
                        <div>
                          <p className="font-serif text-lg font-semibold text-[#1C1917]">
                            Doação registrada no painel administrativo
                          </p>
                          <p className="mt-1 font-mono text-xs text-[#14532D]">
                            Protocolo: {donationSuccessCode}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-[#44403C]">
                            O lançamento já aparece no controle de recebimentos e na contabilidade
                            do painel administrativo.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDonationSuccessCode(null)}
                        className="inline-flex min-h-[40px] cursor-pointer items-center rounded-md border border-[#D6CEBE] bg-white px-4 py-2 text-xs font-medium text-[#1C1917]"
                      >
                        Registrar outra doação
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleConfirmFinancialDonation} className="mt-4 space-y-3.5">
                      <div>
                        <label htmlFor="modal-donor-name" className="block text-xs font-medium text-[#44403C]">
                          Nome completo do colaborador
                        </label>
                        <input
                          id="modal-donor-name"
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Seu nome ou razão social"
                          className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917]"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="modal-donor-email" className="block text-xs font-medium text-[#44403C]">
                            E-mail para recibo
                          </label>
                          <input
                            id="modal-donor-email"
                            type="email"
                            required
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            placeholder="voce@email.com"
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917]"
                          />
                        </div>

                        <div>
                          <label htmlFor="modal-donor-phone" className="block text-xs font-medium text-[#44403C]">
                            Telefone / WhatsApp
                          </label>
                          <input
                            id="modal-donor-phone"
                            type="tel"
                            required
                            value={donorPhone}
                            onChange={(e) => setDonorPhone(e.target.value)}
                            placeholder="(68) 99900-0000"
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="modal-donor-notes" className="block text-xs font-medium text-[#44403C]">
                          Observação (opcional)
                        </label>
                        <input
                          id="modal-donor-notes"
                          type="text"
                          value={donorNotes}
                          onChange={(e) => setDonorNotes(e.target.value)}
                          placeholder="Ex.: Apoio à panificação ou sopão comunitário"
                          className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-2 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#9A3412] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7C2D12]"
                      >
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {paymentMethod === 'PIX'
                            ? `Registrar doação PIX de R$ ${effectiveAmount
                                .toFixed(2)
                                .replace('.', ',')}`
                            : `Finalizar checkout seguro (R$ ${effectiveAmount
                                .toFixed(2)
                                .replace('.', ',')})`}
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'monthly' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
                    Programa Doador Mensal · Projeto Sopão
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-[#1C1917]">
                    Escolha o valor mensal via PIX
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#57534E]">
                    Sua contribuição recorrente é cadastrada diretamente no Banco de Doadores
                    Mensais da associação e contabilizada no balancete transparente do dashboard.
                  </p>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {PRESET_AMOUNTS.map((val) => {
                      const active = !monthlyCustomAmount && monthlyAmount === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setMonthlyAmount(val);
                            setMonthlyCustomAmount('');
                          }}
                          className={`min-h-[42px] cursor-pointer rounded-md border font-mono text-xs font-medium tabular-nums transition-colors ${
                            active
                              ? 'border-[#14532D] bg-[#14532D] text-white'
                              : 'border-[#D6CEBE] bg-white text-[#1C1917] hover:bg-[#F4F0E8]'
                          }`}
                        >
                          R$ {val}/mês
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="monthly-custom-val" className="block text-xs text-[#57534E]">
                      Ou defina outro valor mensal (R$)
                    </label>
                    <input
                      id="monthly-custom-val"
                      type="number"
                      min="10"
                      value={monthlyCustomAmount}
                      onChange={(e) => setMonthlyCustomAmount(e.target.value)}
                      placeholder="Ex.: 80"
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 font-mono text-sm tabular-nums"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-[#E2DDD3] bg-white p-5 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#78716C]">
                    Chaves PIX para recorrência mensal
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 rounded border border-[#EFEBE3] bg-[#FBF9F5] p-3">
                      <div>
                        <p className="text-[#78716C]">PIX Telefone</p>
                        <p className="font-mono font-semibold tabular-nums text-[#1C1917]">
                          {PIX_INFO.pixPhoneDisplay}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(PIX_INFO.pixPhoneKey, 'phone')}
                        className="cursor-pointer rounded border border-[#D6CEBE] bg-white px-2.5 py-1.5 font-medium text-[#1C1917]"
                      >
                        {copiedField === 'phone' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded border border-[#EFEBE3] bg-[#FBF9F5] p-3">
                      <div>
                        <p className="text-[#78716C]">PIX CNPJ</p>
                        <p className="font-mono font-semibold tabular-nums text-[#1C1917]">
                          {PIX_INFO.pixKey}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(PIX_INFO.pixKey, 'cnpj')}
                        className="cursor-pointer rounded border border-[#D6CEBE] bg-white px-2.5 py-1.5 font-medium text-[#1C1917]"
                      >
                        {copiedField === 'cnpj' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-lg border border-[#E2DDD3] bg-white p-5">
                  <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                    Cadastro no Banco de Doadores Mensais
                  </h3>

                  {monthlySuccessUrl ? (
                    <div className="mt-4 space-y-4 rounded-lg border border-[#14532D]/30 bg-[#FBF9F5] p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#14532D]" />
                        <div>
                          <p className="font-serif text-lg font-semibold text-[#1C1917]">
                            Doador mensal cadastrado!
                          </p>
                          <p className="mt-1 text-xs text-[#44403C]">
                            Seu nome já consta no Banco de Doadores Mensais e no livro contábil do
                            Painel Administrativo.
                          </p>
                        </div>
                      </div>
                      <a
                        href={monthlySuccessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Enviar comprovante/adesão via WhatsApp ({PIX_INFO.pixPhoneDisplay})</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setMonthlySuccessUrl(null)}
                        className="cursor-pointer text-xs font-medium text-[#57534E] hover:underline"
                      >
                        Cadastrar outro doador mensal
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterMonthlyDonor} className="mt-4 space-y-3.5">
                      <div>
                        <label htmlFor="md-name" className="block text-xs font-medium text-[#44403C]">
                          Nome completo do doador
                        </label>
                        <input
                          id="md-name"
                          type="text"
                          required
                          value={monthlyName}
                          onChange={(e) => setMonthlyName(e.target.value)}
                          placeholder="Seu nome ou empresa"
                          className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="md-email" className="block text-xs font-medium text-[#44403C]">
                            E-mail
                          </label>
                          <input
                            id="md-email"
                            type="email"
                            required
                            value={monthlyEmail}
                            onChange={(e) => setMonthlyEmail(e.target.value)}
                            placeholder="voce@email.com"
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="md-phone" className="block text-xs font-medium text-[#44403C]">
                            Telefone / WhatsApp
                          </label>
                          <input
                            id="md-phone"
                            type="tel"
                            required
                            value={monthlyPhone}
                            onChange={(e) => setMonthlyPhone(e.target.value)}
                            placeholder="(68) 99900-0000"
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="md-due" className="block text-xs font-medium text-[#44403C]">
                            Dia mensal preferencial
                          </label>
                          <select
                            id="md-due"
                            value={monthlyDueDay}
                            onChange={(e) => setMonthlyDueDay(Number(e.target.value))}
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 text-sm"
                          >
                            <option value={5}>Todo dia 05</option>
                            <option value={10}>Todo dia 10</option>
                            <option value={15}>Todo dia 15</option>
                            <option value={20}>Todo dia 20</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="md-pix-chan" className="block text-xs font-medium text-[#44403C]">
                            Chave PIX utilizada
                          </label>
                          <select
                            id="md-pix-chan"
                            value={monthlyPixChannel}
                            onChange={(e) =>
                              setMonthlyPixChannel(
                                e.target.value as
                                  | 'CNPJ 33.314.701/0001-54'
                                  | 'Telefone +55 68 9958-7200'
                              )
                            }
                            className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-[#FBF9F5] px-3 text-sm"
                          >
                            <option value="Telefone +55 68 9958-7200">
                              Telefone +55 68 9958-7200
                            </option>
                            <option value="CNPJ 33.314.701/0001-54">
                              CNPJ 33.314.701/0001-54
                            </option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-1 text-xs text-[#44403C]">
                        <input
                          type="checkbox"
                          checked={monthlyPaidNow}
                          onChange={(e) => setMonthlyPaidNow(e.target.checked)}
                          className="h-4 w-4 accent-[#14532D]"
                        />
                        <span>Já realizei o primeiro PIX deste mês</span>
                      </label>

                      <button
                        type="submit"
                        className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-md bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3F22]"
                      >
                        Confirmar Adesão Mensal (R${' '}
                        {effectiveMonthlyAmount.toFixed(2).replace('.', ',')}/mês)
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'pickup' && (
            <form onSubmit={handleSchedulePickup} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-6">
                <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
                  1. Lista de produtos para recebimento
                </p>
                <div className="max-h-[360px] divide-y divide-[#E2DDD3] overflow-y-auto rounded-lg border border-[#E2DDD3] bg-white px-4">
                  {activeProducts.map((item) => {
                    const qty = selectedQuantities[item.id] ?? 0;
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1C1917]">{item.name}</p>
                          <p className="text-xs text-[#78716C]">
                            {item.category} · {item.priority}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min={0}
                            aria-label={`Quantidade de ${item.name} em ${item.unit}`}
                            value={qty === 0 ? '' : qty}
                            placeholder="0"
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              setSelectedQuantities((prev) => ({ ...prev, [item.id]: val }));
                            }}
                            className="h-9 w-16 rounded border border-[#D6CEBE] bg-[#FBF9F5] px-2 text-right font-mono text-xs tabular-nums text-[#1C1917]"
                          />
                          <span className="w-16 text-xs text-[#57534E]">{item.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label htmlFor="modal-custom-items" className="block text-xs font-medium text-[#44403C]">
                    Outros itens ou observação dos produtos
                  </label>
                  <input
                    id="modal-custom-items"
                    type="text"
                    value={customItemsText}
                    onChange={(e) => setCustomItemsText(e.target.value)}
                    placeholder="Ex.: 2 cestas básicas, 10L de leite..."
                    className="mt-1 min-h-[40px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:col-span-6">
                <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
                  2. Dados do colaborador para agendamento
                </p>

                <div>
                  <label htmlFor="modal-collab-name" className="block text-xs font-medium text-[#44403C]">
                    Nome do colaborador
                  </label>
                  <input
                    id="modal-collab-name"
                    type="text"
                    required
                    value={collabName}
                    onChange={(e) => setCollabName(e.target.value)}
                    placeholder="Nome completo"
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="modal-collab-email" className="block text-xs font-medium text-[#44403C]">
                      E-mail
                    </label>
                    <input
                      id="modal-collab-email"
                      type="email"
                      required
                      value={collabEmail}
                      onChange={(e) => setCollabEmail(e.target.value)}
                      placeholder="colaborador@email.com"
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-collab-phone" className="block text-xs font-medium text-[#44403C]">
                      Telefone / WhatsApp
                    </label>
                    <input
                      id="modal-collab-phone"
                      type="tel"
                      required
                      value={collabPhone}
                      onChange={(e) => setCollabPhone(e.target.value)}
                      placeholder="(68) 99900-0000"
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-pickup-addr" className="block text-xs font-medium text-[#44403C]">
                    Endereço para coleta em Plácido de Castro
                  </label>
                  <input
                    id="modal-pickup-addr"
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Rua, número, bairro ou ramal"
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="modal-pickup-date" className="block text-xs font-medium text-[#44403C]">
                      Data preferencial
                    </label>
                    <input
                      id="modal-pickup-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 font-mono text-sm text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-pickup-shift" className="block text-xs font-medium text-[#44403C]">
                      Turno
                    </label>
                    <select
                      id="modal-pickup-shift"
                      value={preferredShift}
                      onChange={(e) =>
                        setPreferredShift(
                          e.target.value as
                            | 'Manhã (08h–12h)'
                            | 'Tarde (14h–18h)'
                            | 'Sábado (08h–12h)'
                        )
                      }
                      className="mt-1 min-h-[42px] w-full rounded-md border border-[#D6CEBE] bg-white px-3 py-2 text-sm text-[#1C1917]"
                    >
                      <option value="Manhã (08h–12h)">Manhã (08h–12h)</option>
                      <option value="Tarde (14h–18h)">Tarde (14h–18h)</option>
                      <option value="Sábado (08h–12h)">Sábado (08h–12h)</option>
                    </select>
                  </div>
                </div>

                {pickupError && (
                  <p role="alert" className="text-xs font-medium text-[#9A3412]">
                    {pickupError}
                  </p>
                )}

                {pickupSubmittedUrl ? (
                  <div className="space-y-3 rounded-lg border border-[#14532D]/30 bg-white p-4">
                    <p className="text-sm font-semibold text-[#14532D]">
                      Coleta registrada no painel administrativo!
                    </p>
                    <a
                      href={pickupSubmittedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22]"
                    >
                      <span>Enviar agendamento no WhatsApp ({PIX_INFO.pickupWhatsappDisplay})</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-md bg-[#14532D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0F3F22]"
                    >
                      Registrar Agendamento
                    </button>

                    <a
                      href={buildPickupWhatsappUrl({
                        collaboratorName: collabName || 'Colaborador',
                        collaboratorEmail: collabEmail || 'Não informado',
                        collaboratorPhone: collabPhone || 'Não informado',
                        pickupAddress: pickupAddress || 'Plácido de Castro - AC',
                        preferredDate,
                        preferredShift,
                        items: chosenPickupItems,
                        customItemsText,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-[#14532D] bg-white px-4 py-2.5 text-xs font-semibold text-[#14532D] hover:bg-[#F4F0E8] whitespace-nowrap shrink-0"
                    >
                      <span>WhatsApp {PIX_INFO.pickupWhatsappDisplay}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
