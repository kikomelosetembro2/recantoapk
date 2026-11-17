import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  Phone,
  QrCode,
  Truck,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  buildPickupWhatsappUrl,
  PickupItemSelection,
  PickupScheduleRecord,
  PIX_INFO,
  ProductCategory,
  useDonationsStore,
} from '../data/donationsStore';
import { DonateButton } from './DonateButton';

interface DonationSectionProps {
  onOpenDonateModal: (tab: 'pix' | 'monthly' | 'pickup') => void;
  onOpenAdmin: () => void;
}

const PRODUCT_CATEGORIES: Array<'Todos' | ProductCategory> = [
  'Todos',
  'Insumos do Sopão',
  'Panificação Solidária',
  'Porcionamento & Kits',
  'Higiene & Limpeza',
];

export function DonationSection({ onOpenDonateModal, onOpenAdmin }: DonationSectionProps) {
  const { products, addPickupSchedule } = useDonationsStore();
  const [activeTab, setActiveTab] = useState<'produtos' | 'agendamento'>('produtos');
  const [productFilter, setProductFilter] = useState<'Todos' | ProductCategory>('Todos');
  const [copiedKey, setCopiedKey] = useState<'cnpj' | 'phone' | null>(null);

  // Inline Pickup Form State
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
  const [formError, setFormError] = useState('');
  const [submittedPickup, setSubmittedPickup] = useState<PickupScheduleRecord | null>(null);

  const visibleProducts = useMemo(() => {
    return products.filter(
      (p) => p.active && (productFilter === 'Todos' || p.category === productFilter)
    );
  }, [products, productFilter]);

  const selectedItems: PickupItemSelection[] = useMemo(() => {
    return products
      .filter((p) => p.active && (selectedQuantities[p.id] ?? 0) > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: selectedQuantities[p.id],
        unit: p.unit,
      }));
  }, [products, selectedQuantities]);

  const handleCopyKey = async (text: string, type: 'cnpj' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(type);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(type);
    }
  };

  const handleSubmitPickup = (e: FormEvent) => {
    e.preventDefault();
    if (collabName.trim().length < 3) {
      setFormError('Informe o nome completo do colaborador.');
      return;
    }
    if (!collabEmail.includes('@')) {
      setFormError('Informe um e-mail válido.');
      return;
    }
    if (collabPhone.replace(/\D/g, '').length < 8) {
      setFormError('Informe um telefone com DDD.');
      return;
    }
    if (pickupAddress.trim().length < 5) {
      setFormError('Informe o endereço completo para coleta.');
      return;
    }
    if (selectedItems.length === 0 && !customItemsText.trim()) {
      setFormError('Selecione pelo menos um produto na lista ou descreva os itens.');
      return;
    }

    const recordPayload = {
      collaboratorName: collabName.trim(),
      collaboratorEmail: collabEmail.trim(),
      collaboratorPhone: collabPhone.trim(),
      pickupAddress: pickupAddress.trim(),
      preferredDate,
      preferredShift,
      items: selectedItems,
      customItemsText: customItemsText.trim(),
    };

    const created = addPickupSchedule(recordPayload);
    setFormError('');
    setSubmittedPickup(created);
  };

  return (
    <section id="doacoes" className="border-b-2 border-[#BBF7D0] bg-[#F0FDF4]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
        {/* Top split */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#BBF7D0] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#854D0E]">
              Apoio Financeiro, Doadores Mensais &amp; Coletas
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#052E16] sm:text-4xl">
              Contribua via PIX, torne-se doador mensal ou agende uma coleta
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#14532D]">
              Cada contribuição mantém a cozinha comunitária e a panificação solidária em
              Plácido de Castro. Apoie com doação única, assinatura mensal via PIX ou produtos
              da lista abaixo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DonateButton
              onClick={() => onOpenDonateModal('pix')}
              variant="primary"
              label="Doar agora (PIX / Gateway)"
              showSecurityHint
            />
            <button
              type="button"
              onClick={() => onOpenDonateModal('monthly')}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md bg-[#15803D] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#14532D] whitespace-nowrap shrink-0"
            >
              <CalendarClock className="h-4 w-4 text-[#FEF08A]" aria-hidden="true" />
              <span>Ser Doador Mensal</span>
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border-2 border-[#15803D] bg-white px-4 py-2.5 text-xs font-semibold text-[#14532D] transition-colors hover:bg-[#FEFCE8] whitespace-nowrap shrink-0"
            >
              <span>Painel &amp; Contabilidade</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Dual PIX Keys Strip (CNPJ + Telefone +55 68 9958-7200) */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]">
                <QrCode className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                  Chave PIX · CNPJ Institucional
                </p>
                <p className="mt-1 font-mono text-base font-bold tabular-nums text-[#052E16]">
                  {PIX_INFO.pixKey}
                </p>
                <p className="text-xs text-[#166534]">{PIX_INFO.beneficiary}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyKey(PIX_INFO.pixKey, 'cnpj')}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-3.5 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308] whitespace-nowrap shrink-0"
            >
              {copiedKey === 'cnpj' ? (
                <Check className="h-4 w-4 text-[#052E16]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copiedKey === 'cnpj' ? 'CNPJ copiado' : 'Copiar CNPJ'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#FACC15] bg-[#FEFCE8] text-[#854D0E]">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                  Chave PIX &amp; WhatsApp · Telefone
                </p>
                <p className="mt-1 font-mono text-base font-bold tabular-nums text-[#052E16]">
                  {PIX_INFO.pixPhoneDisplay}
                </p>
                <p className="text-xs text-[#166534]">
                  Transferência PIX ou envio de comprovantes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyKey(PIX_INFO.pixPhoneKey, 'phone')}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-3.5 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308] whitespace-nowrap shrink-0"
            >
              {copiedKey === 'phone' ? (
                <Check className="h-4 w-4 text-[#052E16]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copiedKey === 'phone' ? 'Telefone copiado' : 'Copiar Telefone'}</span>
            </button>
          </div>
        </div>

        {/* Section Tabs: Lista de Produtos vs Agendamento de Coleta */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" className="inline-flex rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] p-1">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'produtos'}
              onClick={() => setActiveTab('produtos')}
              className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'produtos'
                  ? 'bg-[#15803D] text-white shadow-sm'
                  : 'text-[#14532D] hover:bg-white/75'
              }`}
            >
              Lista de Produtos Aceitos ({products.filter((p) => p.active).length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'agendamento'}
              onClick={() => setActiveTab('agendamento')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'agendamento'
                  ? 'bg-[#15803D] text-white shadow-sm'
                  : 'text-[#14532D] hover:bg-white/75'
              }`}
            >
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Agendar Coleta de Doações</span>
            </button>
          </div>

          {activeTab === 'produtos' && (
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#FACC15] bg-[#FEFCE8] p-1">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setProductFilter(cat)}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    productFilter === cat
                      ? 'bg-[#FACC15] text-[#052E16] shadow-sm'
                      : 'text-[#854D0E] hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'produtos' ? (
          <div className="mt-6 overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 text-xs uppercase tracking-wider text-[#14532D]">
                  <th className="px-5 py-3.5 font-semibold">Produto / Insumo</th>
                  <th className="px-5 py-3.5 font-semibold">Frente</th>
                  <th className="px-5 py-3.5 font-semibold">Prioridade</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Recebido / Meta</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Doar item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCFCE7]">
                {visibleProducts.map((item) => {
                  const pct = Math.min(
                    100,
                    Math.round((item.receivedQty / Math.max(1, item.targetQty)) * 100)
                  );
                  return (
                    <tr key={item.id} className="hover:bg-[#F0FDF4]">
                      <td className="px-5 py-3.5 font-semibold text-[#052E16]">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs text-[#166534]">{item.category}</td>
                      <td className="px-5 py-3.5 text-xs">
                        <span
                          className={`font-semibold ${
                            item.priority === 'Prioritário'
                              ? 'text-[#854D0E]'
                              : item.priority === 'Contínuo'
                                ? 'text-[#15803D]'
                                : 'text-[#166534]'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs tabular-nums text-[#052E16]">
                        {item.receivedQty} / {item.targetQty} {item.unit}{' '}
                        <span className="text-[#15803D]">({pct}%)</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [item.id]: (prev[item.id] ?? 0) > 0 ? prev[item.id] : 5,
                            }));
                            setActiveTab('agendamento');
                          }}
                          className="cursor-pointer text-xs font-bold text-[#15803D] hover:text-[#052E16] hover:underline underline-offset-4 whitespace-nowrap"
                        >
                          Selecionar para coleta
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-[#BBF7D0] bg-white p-6 sm:p-8">
            <form onSubmit={handleSubmitPickup} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#052E16]">
                    Dados do colaborador e coleta
                  </h3>
                  <p className="mt-1 text-xs text-[#14532D]">
                    Preencha seus dados para agendarmos a retirada pelo veículo do Projeto Sopão ou
                    envie direto pelo WhatsApp{' '}
                    <span className="font-mono font-bold text-[#052E16]">
                      {PIX_INFO.pickupWhatsappDisplay}
                    </span>
                    .
                  </p>
                </div>

                <div>
                  <label htmlFor="sec-collab-name" className="block text-xs font-semibold text-[#14532D]">
                    Nome do colaborador
                  </label>
                  <input
                    id="sec-collab-name"
                    type="text"
                    required
                    value={collabName}
                    onChange={(e) => setCollabName(e.target.value)}
                    placeholder="Ex.: João Carlos Pereira"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sec-collab-email" className="block text-xs font-semibold text-[#14532D]">
                      E-mail do colaborador
                    </label>
                    <input
                      id="sec-collab-email"
                      type="email"
                      required
                      value={collabEmail}
                      onChange={(e) => setCollabEmail(e.target.value)}
                      placeholder="colaborador@email.com"
                      className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                    />
                  </div>
                  <div>
                    <label htmlFor="sec-collab-phone" className="block text-xs font-semibold text-[#14532D]">
                      Telefone do colaborador
                    </label>
                    <input
                      id="sec-collab-phone"
                      type="tel"
                      required
                      value={collabPhone}
                      onChange={(e) => setCollabPhone(e.target.value)}
                      placeholder="(68) 99900-0000"
                      className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sec-pickup-addr" className="block text-xs font-semibold text-[#14532D]">
                    Endereço completo de coleta
                  </label>
                  <input
                    id="sec-pickup-addr"
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Rua, nº, bairro ou ramal em Plácido de Castro - AC"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sec-pickup-date" className="block text-xs font-semibold text-[#14532D]">
                      Data preferencial
                    </label>
                    <input
                      id="sec-pickup-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 font-mono text-sm text-[#052E16]"
                    />
                  </div>
                  <div>
                    <label htmlFor="sec-pickup-shift" className="block text-xs font-semibold text-[#14532D]">
                      Turno preferencial
                    </label>
                    <select
                      id="sec-pickup-shift"
                      value={preferredShift}
                      onChange={(e) =>
                        setPreferredShift(
                          e.target.value as
                            | 'Manhã (08h–12h)'
                            | 'Tarde (14h–18h)'
                            | 'Sábado (08h–12h)'
                        )
                      }
                      className="mt-1 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                    >
                      <option value="Manhã (08h–12h)">Manhã (08h–12h)</option>
                      <option value="Tarde (14h–18h)">Tarde (14h–18h)</option>
                      <option value="Sábado (08h–12h)">Sábado (08h–12h)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#052E16]">
                    Produtos selecionados para doação
                  </h3>
                  <p className="mt-1 text-xs text-[#166534]">
                    Informe a quantidade dos itens disponíveis para retirada.
                  </p>
                </div>

                <div className="max-h-[260px] divide-y divide-[#DCFCE7] overflow-y-auto rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4">
                  {products
                    .filter((p) => p.active)
                    .map((item) => {
                      const qty = selectedQuantities[item.id] ?? 0;
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#052E16]">{item.name}</p>
                            <p className="text-[11px] text-[#15803D]">{item.category}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min={0}
                              aria-label={`Quantidade de ${item.name}`}
                              value={qty === 0 ? '' : qty}
                              placeholder="0"
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                setSelectedQuantities((prev) => ({ ...prev, [item.id]: val }));
                              }}
                              className="h-9 w-16 rounded border border-[#86EFAC] bg-white px-2 text-right font-mono text-xs tabular-nums text-[#052E16]"
                            />
                            <span className="w-16 text-xs text-[#14532D]">{item.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div>
                  <label htmlFor="sec-custom-items" className="block text-xs font-semibold text-[#14532D]">
                    Outros produtos ou observações
                  </label>
                  <input
                    id="sec-custom-items"
                    type="text"
                    value={customItemsText}
                    onChange={(e) => setCustomItemsText(e.target.value)}
                    placeholder="Ex.: 2 sacos de cebola, 5 caixas de leite..."
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                  />
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded border border-[#EAB308] bg-[#FEFCE8] px-3 py-2 text-xs font-semibold text-[#854D0E]"
                  >
                    {formError}
                  </p>
                )}

                {submittedPickup ? (
                  <div className="space-y-3 rounded-lg border-2 border-[#15803D] bg-[#F0FDF4] p-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#15803D]">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>Recibo de agendamento salvo no painel administrativo!</span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-semibold text-[#854D0E]">
                        Protocolo: {submittedPickup.id.toUpperCase()} · {submittedPickup.preferredDate}
                      </p>
                    </div>
                    <a
                      href={buildPickupWhatsappUrl(submittedPickup)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#15803D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#14532D]"
                    >
                      <MessageCircle className="h-4 w-4 text-[#FEF08A]" aria-hidden="true" />
                      <span>
                        Enviar recibo do agendamento via WhatsApp ({PIX_INFO.pickupWhatsappDisplay})
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedPickup(null)}
                      className="cursor-pointer text-xs font-semibold text-[#854D0E] hover:underline"
                    >
                      Agendar outra coleta
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-md bg-[#FACC15] px-5 py-2.5 text-xs font-bold text-[#052E16] border border-[#CA8A04] hover:bg-[#EAB308]"
                    >
                      Confirmar Agendamento de Coleta
                    </button>

                    <a
                      href={buildPickupWhatsappUrl({
                        collaboratorName: collabName || 'Colaborador',
                        collaboratorEmail: collabEmail || 'Não informado',
                        collaboratorPhone: collabPhone || 'Não informado',
                        pickupAddress: pickupAddress || 'Plácido de Castro - AC',
                        preferredDate,
                        preferredShift,
                        items: selectedItems,
                        customItemsText,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-[#15803D] bg-white px-4 py-2.5 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4] whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      <span>WhatsApp {PIX_INFO.pickupWhatsappDisplay}</span>
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
