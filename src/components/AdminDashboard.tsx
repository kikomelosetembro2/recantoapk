import {
  ArrowLeft,
  ArrowUpRight,
  BookMarked,
  CalendarClock,
  CheckCircle2,
  Download,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Package,
  PenSquare,
  Plus,
  Search,
  Trash2,
  Truck,
  Wallet,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AccountingKind,
  buildAllDonationsWhatsappUrl,
  buildAllPickupsWhatsappUrl,
  buildDonationReceiptWhatsappUrl,
  buildMonthlyDonorWhatsappUrl,
  buildPickupWhatsappUrl,
  DonationProductItem,
  DonationStatus,
  DonationType,
  MonthlyDonorStatus,
  NewsPostCategory,
  NewsPostRecord,
  PickupItemSelection,
  PickupStatus,
  PIX_INFO,
  ProductCategory,
  useDonationsStore,
} from '../data/donationsStore';
import { DOCUMENTARY_FIGURES, OFFICIAL_ASSETS } from '../data/institutionalData';
import { PWAInstallButton } from './PWAInstallButton';

export type AdminTab =
  | 'overview'
  | 'news'
  | 'receipts'
  | 'monthly-donors'
  | 'accounting'
  | 'pickups'
  | 'products';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  initialTab?: AdminTab;
}

export function AdminDashboard({ onExitAdmin, initialTab = 'overview' }: AdminDashboardProps) {
  const {
    products,
    donations,
    pickups,
    monthlyDonors,
    accountingEntries,
    newsPosts,
    addDonation,
    updateDonationStatus,
    deleteDonation,
    addMonthlyDonor,
    confirmMonthlyDonorPayment,
    updateMonthlyDonorStatus,
    deleteMonthlyDonor,
    addAccountingEntry,
    toggleReconcileEntry,
    deleteAccountingEntry,
    addPickupSchedule,
    updatePickupStatus,
    addProductItem,
    updateProductItem,
    addNewsPost,
    updateNewsPost,
    deleteNewsPost,
  } = useDonationsStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todas' | DonationStatus>('Todas');
  const [typeFilter, setTypeFilter] = useState<'Todos' | DonationType>('Todos');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // News management state
  const [showNewsForm, setShowNewsForm] = useState(initialTab === 'news');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsPostCategory>('Ação Comunitária');
  const [newsDate, setNewsDate] = useState(new Date().toISOString().slice(0, 10));
  const [newsLocation, setNewsLocation] = useState('Sede Bairro Olaria · Plácido de Castro, AC');
  const [newsMetric, setNewsMetric] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsFullText, setNewsFullText] = useState('');
  const [newsImageSrc, setNewsImageSrc] = useState('/assets/extracted/fig1_sopao_comunitario.jpg');
  const [newsPublished, setNewsPublished] = useState(true);

  // Monthly Donors filters & form
  const [monthlyFilter, setMonthlyFilter] = useState<'Todos' | MonthlyDonorStatus>('Todos');
  const [monthlySearch, setMonthlySearch] = useState('');
  const [showNewMonthlyForm, setShowNewMonthlyForm] = useState(false);
  const [mdName, setMdName] = useState('');
  const [mdEmail, setMdEmail] = useState('');
  const [mdPhone, setMdPhone] = useState('');
  const [mdAmount, setMdAmount] = useState('50');
  const [mdDueDay, setMdDueDay] = useState(10);
  const [mdPixChannel, setMdPixChannel] = useState<
    'CNPJ 33.314.701/0001-54' | 'Telefone +55 68 9958-7200'
  >('Telefone +55 68 9958-7200');
  const [mdPaidNow, setMdPaidNow] = useState(false);

  // Accounting filters & form
  const [accKindFilter, setAccKindFilter] = useState<'Todos' | AccountingKind>('Todos');
  const [accSearch, setAccSearch] = useState('');
  const [showNewAccForm, setShowNewAccForm] = useState(false);
  const [accKind, setAccKind] = useState<AccountingKind>('Entrada');
  const [accCategory, setAccCategory] = useState('Doação Avulsa PIX');
  const [accDescription, setAccDescription] = useState('');
  const [accAmount, setAccAmount] = useState('');
  const [accDate, setAccDate] = useState(new Date().toISOString().slice(0, 10));
  const [accRefCode, setAccRefCode] = useState('');

  // Manual donation receipt form
  const [showNewReceiptForm, setShowNewReceiptForm] = useState(false);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonationType, setNewDonationType] = useState<DonationType>('PIX');
  const [newAmountBRL, setNewAmountBRL] = useState('');
  const [newItemsSummary, setNewItemsSummary] = useState('');
  const [newDonationNotes, setNewDonationNotes] = useState('');

  // Admin pickup schedule creation state
  const [showNewPickupForm, setShowNewPickupForm] = useState(false);
  const [collabName, setCollabName] = useState('');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabPhone, setCollabPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-20');
  const [preferredShift, setPreferredShift] = useState<
    'Manhã (08h–12h)' | 'Tarde (14h–18h)' | 'Sábado (08h–12h)'
  >('Manhã (08h–12h)');
  const [pickupQuantities, setPickupQuantities] = useState<Record<string, number>>({});
  const [pickupCustomItems, setPickupCustomItems] = useState('');

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCat, setNewProductCat] = useState<ProductCategory>('Insumos do Sopão');
  const [newProductUnit, setNewProductUnit] = useState('kg');
  const [newProductPriority, setNewProductPriority] =
    useState<DonationProductItem['priority']>('Prioritário');
  const [newProductTarget, setNewProductTarget] = useState('50');

  const metrics = useMemo(() => {
    const confirmedBRL = donations
      .filter((d) => d.status === 'Recebida' && typeof d.amountBRL === 'number')
      .reduce((acc, d) => acc + (d.amountBRL ?? 0), 0);

    const pendingBRL = donations
      .filter(
        (d) =>
          (d.status === 'Pendente' || d.status === 'Em Conferência') &&
          typeof d.amountBRL === 'number'
      )
      .reduce((acc, d) => acc + (d.amountBRL ?? 0), 0);

    const receivedCount = donations.filter((d) => d.status === 'Recebida').length;
    const pendingPickups = pickups.filter(
      (p) => p.status === 'Agendada' || p.status === 'Em Rota'
    ).length;

    const totalProductUnits = products.reduce((acc, p) => acc + p.receivedQty, 0);

    const activeMonthly = monthlyDonors.filter((m) => m.status !== 'Pausado');
    const monthlyExpectedMRR = activeMonthly.reduce((acc, m) => acc + m.monthlyAmountBRL, 0);
    const monthlyPaidCount = monthlyDonors.filter((m) => m.status === 'Em dia').length;

    const totalEntradas = accountingEntries
      .filter((a) => a.kind === 'Entrada')
      .reduce((acc, a) => acc + a.amountBRL, 0);
    const totalSaidas = accountingEntries
      .filter((a) => a.kind === 'Saída')
      .reduce((acc, a) => acc + a.amountBRL, 0);
    const netBalance = totalEntradas - totalSaidas;
    const reconciledCount = accountingEntries.filter((a) => a.reconciled).length;

    const byType = {
      pix: donations.filter((d) => d.type === 'PIX' || d.type === 'PIX Mensal').length,
      gateway: donations.filter((d) => d.type === 'Gateway Cartão/Boleto').length,
      products: donations.filter((d) => d.type === 'Produtos').length,
    };

    return {
      confirmedBRL,
      pendingBRL,
      receivedCount,
      pendingPickups,
      totalProductUnits,
      activeMonthlyCount: activeMonthly.length,
      monthlyExpectedMRR,
      monthlyPaidCount,
      totalEntradas,
      totalSaidas,
      netBalance,
      reconciledCount,
      byType,
    };
  }, [donations, pickups, products, monthlyDonors, accountingEntries]);

  const filteredDonations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return donations.filter((d) => {
      const matchesStatus = statusFilter === 'Todas' || d.status === statusFilter;
      const matchesType = typeFilter === 'Todos' || d.type === typeFilter;
      const matchesQuery =
        !q ||
        d.donorName.toLowerCase().includes(q) ||
        d.referenceCode.toLowerCase().includes(q) ||
        (d.itemsSummary ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesType && matchesQuery;
    });
  }, [donations, statusFilter, typeFilter, searchQuery]);

  const filteredMonthlyDonors = useMemo(() => {
    const q = monthlySearch.trim().toLowerCase();
    return monthlyDonors.filter((m) => {
      const matchesStatus = monthlyFilter === 'Todos' || m.status === monthlyFilter;
      const matchesQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q);
      return matchesStatus && matchesQ;
    });
  }, [monthlyDonors, monthlyFilter, monthlySearch]);

  const filteredAccounting = useMemo(() => {
    const q = accSearch.trim().toLowerCase();
    return accountingEntries.filter((a) => {
      const matchesKind = accKindFilter === 'Todos' || a.kind === accKindFilter;
      const matchesQ =
        !q ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.referenceCode.toLowerCase().includes(q);
      return matchesKind && matchesQ;
    });
  }, [accountingEntries, accKindFilter, accSearch]);

  const handleExportAccountingCsv = () => {
    const header = ['Data', 'Tipo', 'Categoria', 'Descricao', 'Documento', 'Valor_BRL', 'Conciliado'];
    const rows = filteredAccounting.map((a) => [
      a.date,
      a.kind,
      `"${a.category.replace(/"/g, '""')}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      a.referenceCode,
      (a.kind === 'Saída' ? -a.amountBRL : a.amountBRL).toFixed(2),
      a.reconciled ? 'Sim' : 'Nao',
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balancete-contabil-bom-pastor-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    if (activeTab === 'accounting') {
      handleExportAccountingCsv();
      return;
    }
    const header = [
      'Protocolo',
      'Data',
      'Colaborador',
      'Email',
      'Telefone',
      'Tipo',
      'Valor_BRL',
      'Itens',
      'Status',
    ];
    const rows = filteredDonations.map((d) => [
      d.referenceCode,
      d.createdAt,
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.donorEmail,
      d.donorPhone,
      d.type,
      d.amountBRL ? d.amountBRL.toFixed(2) : '',
      `"${(d.itemsSummary ?? '').replace(/"/g, '""')}"`,
      d.status,
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doacoes-recanto-bom-pastor-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddManualReceipt = (e: FormEvent) => {
    e.preventDefault();
    addDonation({
      donorName: newDonorName.trim(),
      donorEmail: newDonorEmail.trim() || 'nao-informado@local.org',
      donorPhone: newDonorPhone.trim() || '(68) não informado',
      type: newDonationType,
      amountBRL:
        newDonationType !== 'Produtos' ? Number(newAmountBRL.replace(',', '.')) || 0 : undefined,
      itemsSummary: newDonationType === 'Produtos' ? newItemsSummary.trim() : undefined,
      status: 'Recebida',
      notes: newDonationNotes.trim() || 'Recebimento registrado manualmente pela administração.',
    });
    setNewDonorName('');
    setNewDonorEmail('');
    setNewDonorPhone('');
    setNewAmountBRL('');
    setNewItemsSummary('');
    setNewDonationNotes('');
    setShowNewReceiptForm(false);
  };

  const handleAddMonthlyDonorSubmit = (e: FormEvent) => {
    e.preventDefault();
    addMonthlyDonor({
      name: mdName.trim(),
      email: mdEmail.trim() || 'nao-informado@local.org',
      phone: mdPhone.trim(),
      monthlyAmountBRL: Math.max(10, Number(mdAmount.replace(',', '.')) || 50),
      dueDay: mdDueDay,
      pixChannel: mdPixChannel,
      paidFirstMonthNow: mdPaidNow,
    });
    setMdName('');
    setMdEmail('');
    setMdPhone('');
    setMdAmount('50');
    setMdPaidNow(false);
    setShowNewMonthlyForm(false);
  };

  const handleAddAccountingSubmit = (e: FormEvent) => {
    e.preventDefault();
    addAccountingEntry({
      date: accDate,
      kind: accKind,
      category: accCategory.trim(),
      description: accDescription.trim(),
      amountBRL: Math.max(0.01, Number(accAmount.replace(',', '.')) || 0),
      referenceCode: accRefCode.trim(),
      reconciled: true,
    });
    setAccDescription('');
    setAccAmount('');
    setAccRefCode('');
    setShowNewAccForm(false);
  };

  const handleAdminCreatePickup = (e: FormEvent) => {
    e.preventDefault();
    const selectedItems: PickupItemSelection[] = products
      .filter((p) => p.active && (pickupQuantities[p.id] ?? 0) > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: pickupQuantities[p.id],
        unit: p.unit,
      }));

    addPickupSchedule({
      collaboratorName: collabName.trim(),
      collaboratorEmail: collabEmail.trim(),
      collaboratorPhone: collabPhone.trim(),
      pickupAddress: pickupAddress.trim(),
      preferredDate,
      preferredShift,
      items: selectedItems,
      customItemsText: pickupCustomItems.trim(),
    });

    setCollabName('');
    setCollabEmail('');
    setCollabPhone('');
    setPickupAddress('');
    setPickupQuantities({});
    setPickupCustomItems('');
    setShowNewPickupForm(false);
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    addProductItem({
      name: newProductName.trim(),
      category: newProductCat,
      unit: newProductUnit.trim() || 'kg',
      priority: newProductPriority,
      targetQty: Math.max(1, Number(newProductTarget) || 50),
    });
    setNewProductName('');
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsCategory('Ação Comunitária');
    setNewsDate(new Date().toISOString().slice(0, 10));
    setNewsLocation('Sede Bairro Olaria · Plácido de Castro, AC');
    setNewsMetric('');
    setNewsSummary('');
    setNewsFullText('');
    setNewsImageSrc('/assets/extracted/fig1_sopao_comunitario.jpg');
    setNewsPublished(true);
  };

  const handleNewsFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setNewsImageSrc(canvas.toDataURL('image/jpeg', 0.82));
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditNewsClick = (post: NewsPostRecord) => {
    setEditingNewsId(post.id);
    setNewsTitle(post.title);
    setNewsCategory(post.category);
    setNewsDate(post.publishedAt);
    setNewsLocation(post.location);
    setNewsMetric(post.highlightMetric ?? '');
    setNewsSummary(post.summary);
    setNewsFullText(post.fullText);
    setNewsImageSrc(post.imageSrc || OFFICIAL_ASSETS.logo);
    setNewsPublished(post.published);
    setShowNewsForm(true);
  };

  const handleSaveNewsSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      publishedAt: newsDate,
      title: newsTitle.trim(),
      category: newsCategory,
      location: newsLocation.trim() || 'Plácido de Castro, AC',
      summary: newsSummary.trim(),
      fullText: newsFullText.trim() || newsSummary.trim(),
      imageSrc: newsImageSrc.trim() || OFFICIAL_ASSETS.logo,
      highlightMetric: newsMetric.trim() || undefined,
      published: newsPublished,
    };

    if (editingNewsId) {
      updateNewsPost(editingNewsId, payload);
    } else {
      addNewsPost(payload);
    }

    resetNewsForm();
    setShowNewsForm(false);
  };

  const tabTitle: Record<AdminTab, string> = {
    overview: 'Dashboard & Contabilidade Geral',
    news: 'Notícias e Ações Recentes',
    receipts: 'Controle de Recebimento de Doações',
    'monthly-donors': 'Banco de Doadores Mensais (PIX)',
    accounting: 'Contabilidade & Balancete',
    pickups: 'Agendamento de Coleta de Doações',
    products: 'Lista de Produtos para Recebimento',
  };

  return (
    <div className="flex min-h-screen bg-[#F0FDF4] text-[#052E16]">
      {/* Left Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r-2 border-[#BBF7D0] bg-white lg:flex">
        <div>
          <div className="h-1 w-full bg-[#FACC15]" aria-hidden="true" />
          <div className="flex items-center gap-3 border-b border-[#BBF7D0] px-4 py-4">
            <img
              src="/assets/aistudio/logo_marca_ac506922.jpg"
              alt="Logo Projeto Sopão Acre"
              referrerPolicy="no-referrer"
              className="h-11 w-11 shrink-0 rounded-full border-2 border-[#15803D] bg-white object-cover"
            />
            <div className="min-w-0">
              <p className="font-serif text-sm font-bold leading-snug text-[#14532D]">
                Associação Recanto Social Bom Pastor
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#854D0E]">
                Painel Administrativo
              </p>
            </div>
          </div>

          <nav aria-label="Menu do painel administrativo" className="space-y-1 p-3">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Dashboard Geral</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'news'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Newspaper className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Notícias &amp; Ações</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {newsPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('accounting')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'accounting'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BookMarked className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Contabilidade</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {accountingEntries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('monthly-donors')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'monthly-donors'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Doadores Mensais</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {monthlyDonors.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('receipts')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'receipts'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Recebimento de Doações</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {donations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pickups')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'pickups'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Agendamento de Coleta</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {pickups.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#14532D] hover:bg-[#F0FDF4]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Lista de Produtos</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85">
                {products.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="border-t border-[#BBF7D0] bg-[#FEFCE8] p-4 space-y-3">
          <div className="space-y-1 text-xs text-[#14532D]">
            <p className="font-bold text-[#854D0E]">Chaves PIX Oficiais</p>
            <p className="font-mono tabular-nums">CNPJ: {PIX_INFO.pixKey}</p>
            <p className="font-mono tabular-nums">Tel: {PIX_INFO.pixPhoneDisplay}</p>
          </div>
          <button
            type="button"
            onClick={onExitAdmin}
            className="flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-[#15803D] bg-white px-3 py-2 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Voltar ao Portal Público</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Breadcrumb Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#BBF7D0] bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium text-[#15803D]">
              Administração / Financeiro &amp; Doações / {tabTitle[activeTab]}
            </p>
            <h1 className="font-serif text-xl font-semibold text-[#052E16]">
              {tabTitle[activeTab]}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-md border border-[#86EFAC] bg-white px-3 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#F0FDF4] lg:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portal</span>
            </button>

            <PWAInstallButton compact />

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-md border border-[#86EFAC] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#F0FDF4] whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{activeTab === 'accounting' ? 'Exportar Balancete CSV' : 'Exportar CSV'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('accounting');
                setShowNewAccForm(true);
              }}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-md bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#14532D] whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-[#FEF08A]" aria-hidden="true" />
              <span>Novo Lançamento Contábil</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Switcher */}
        <div className="flex gap-1 overflow-x-auto border-b border-[#BBF7D0] bg-[#DCFCE7] p-2 lg:hidden">
          {(
            [
              ['overview', 'Dashboard'],
              ['news', 'Notícias'],
              ['accounting', 'Contabilidade'],
              ['monthly-donors', 'Mensalistas'],
              ['receipts', 'Recebimentos'],
              ['pickups', 'Coletas'],
              ['products', 'Produtos'],
            ] as Array<[AdminTab, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                activeTab === id ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#14532D]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="flex-1 space-y-6 p-6">
          {/* KPI Summary Strip (Accounting + Monthly Donors + Operations) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
              <p className="text-xs font-semibold text-[#15803D]">Saldo Líquido Contábil</p>
              <p
                className={`mt-2 font-mono text-2xl font-bold tabular-nums ${
                  metrics.netBalance >= 0 ? 'text-[#15803D]' : 'text-[#854D0E]'
                }`}
              >
                R$ {metrics.netBalance.toFixed(2).replace('.', ',')}
              </p>
              <p className="mt-1 font-mono text-[11px] tabular-nums text-[#166534]">
                Entradas R$ {metrics.totalEntradas.toFixed(2).replace('.', ',')} · Saídas R${' '}
                {metrics.totalSaidas.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
              <p className="text-xs font-semibold text-[#15803D]">Receita Mensal Recorrente (PIX)</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#052E16]">
                R$ {metrics.monthlyExpectedMRR.toFixed(2).replace('.', ',')}
              </p>
              <p className="mt-1 text-xs text-[#166534]">
                {metrics.activeMonthlyCount} doadores ativos ({metrics.monthlyPaidCount} em dia)
              </p>
            </div>

            <div className="rounded-lg border-2 border-[#FACC15] bg-[#FEFCE8] p-5">
              <p className="text-xs font-semibold text-[#854D0E]">Doações em Conferência</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#854D0E]">
                R$ {metrics.pendingBRL.toFixed(2).replace('.', ',')}
              </p>
              <p className="mt-1 text-xs font-medium text-[#14532D]">
                {metrics.receivedCount} doações liquidadas
              </p>
            </div>

            <div className="rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
              <p className="text-xs font-semibold text-[#15803D]">Coletas &amp; Produtos Recebidos</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-[#052E16]">
                {metrics.pendingPickups} rotas · {metrics.totalProductUnits} unid
              </p>
              <p className="mt-1 text-xs text-[#166534]">
                WhatsApp coletas: {PIX_INFO.pickupWhatsappDisplay}
              </p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="rounded-lg border-2 border-[#BBF7D0] bg-white p-6 xl:col-span-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Resumo Contábil do Período
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('accounting')}
                    className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                  >
                    Abrir Livro-Razão
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#166534]">
                  Consolidado entre entradas (PIX, mensalistas, editais) e despesas da cozinha.
                </p>

                <dl className="mt-5 divide-y divide-[#DCFCE7] border-y border-[#BBF7D0] text-xs">
                  <div className="flex justify-between py-3">
                    <dt className="text-[#14532D]">Total de Entradas (Receitas)</dt>
                    <dd className="font-mono font-bold tabular-nums text-[#15803D]">
                      + R$ {metrics.totalEntradas.toFixed(2).replace('.', ',')}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-[#14532D]">Total de Saídas (Despesas Operacionais)</dt>
                    <dd className="font-mono font-bold tabular-nums text-[#854D0E]">
                      - R$ {metrics.totalSaidas.toFixed(2).replace('.', ',')}
                    </dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="font-bold text-[#052E16]">Saldo em Caixa</dt>
                    <dd className="font-mono font-bold tabular-nums text-[#052E16]">
                      R$ {metrics.netBalance.toFixed(2).replace('.', ',')}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 space-y-3">
                  <p className="text-xs font-semibold text-[#14532D]">
                    Canais de Entrada de Doações
                  </p>
                  {[
                    {
                      label: 'PIX (Avulso & Mensal)',
                      count: metrics.byType.pix,
                      color: 'bg-[#15803D]',
                    },
                    {
                      label: 'Gateway Cartão / Boleto',
                      count: metrics.byType.gateway,
                      color: 'bg-[#EAB308]',
                    },
                    {
                      label: 'Produtos & Coletas',
                      count: metrics.byType.products,
                      color: 'bg-[#14532D]',
                    },
                  ].map((bar) => {
                    const pct = Math.round((bar.count / Math.max(1, donations.length)) * 100);
                    return (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#14532D]">{bar.label}</span>
                          <span className="font-mono tabular-nums text-[#166534]">
                            {bar.count} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded bg-[#DCFCE7]">
                          <div className={`h-full ${bar.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border-2 border-[#BBF7D0] bg-white p-6 xl:col-span-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                      Últimos Lançamentos Contábeis
                    </h2>
                    <p className="mt-1 text-xs text-[#166534]">
                      Entradas de PIX, mensalidades e saídas operacionais da sede no Bairro Olaria.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('accounting')}
                    className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                  >
                    Ver contabilidade completa
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#BBF7D0] text-[#15803D]">
                        <th className="py-2.5 pr-3 font-semibold">Data</th>
                        <th className="py-2.5 pr-3 font-semibold">Descrição</th>
                        <th className="py-2.5 pr-3 font-semibold">Categoria</th>
                        <th className="py-2.5 text-right font-semibold">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCFCE7]">
                      {accountingEntries.slice(0, 6).map((a) => (
                        <tr key={a.id} className="hover:bg-[#F0FDF4]">
                          <td className="py-3 pr-3 font-mono tabular-nums text-[#166534]">
                            {a.date}
                          </td>
                          <td className="py-3 pr-3 font-semibold text-[#052E16]">{a.description}</td>
                          <td className="py-3 pr-3 text-[#14532D]">{a.category}</td>
                          <td
                            className={`py-3 text-right font-mono font-bold tabular-nums ${
                              a.kind === 'Entrada' ? 'text-[#15803D]' : 'text-[#854D0E]'
                            }`}
                          >
                            {a.kind === 'Entrada' ? '+' : '-'} R${' '}
                            {a.amountBRL.toFixed(2).replace('.', ',')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTABILIDADE & BALANCETE */}
          {activeTab === 'accounting' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Livro-Razão &amp; Prestação de Contas
                  </h2>
                  <p className="mt-1 text-xs text-[#166534]">
                    Toda doação PIX confirmada ou mensalidade liquidada entra automaticamente neste
                    balancete. Conciliados: {metrics.reconciledCount} de {accountingEntries.length}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAccForm((prev) => !prev)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{showNewAccForm ? 'Ocultar formulário' : 'Registrar Entrada / Saída'}</span>
                </button>
              </div>

              {showNewAccForm && (
                <form
                  onSubmit={handleAddAccountingSubmit}
                  className="grid grid-cols-1 gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-6 sm:grid-cols-12"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#14532D]">Tipo</label>
                    <select
                      value={accKind}
                      onChange={(e) => {
                        const nextKind = e.target.value as AccountingKind;
                        setAccKind(nextKind);
                        setAccCategory(
                          nextKind === 'Entrada' ? 'Doação Avulsa PIX' : 'Insumos do Sopão'
                        );
                      }}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    >
                      <option value="Entrada">Entrada (+)</option>
                      <option value="Saída">Saída (-)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">Categoria</label>
                    <input
                      type="text"
                      required
                      value={accCategory}
                      onChange={(e) => setAccCategory(e.target.value)}
                      placeholder="Ex.: Insumos do Sopão"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#14532D]">Descrição</label>
                    <input
                      type="text"
                      required
                      value={accDescription}
                      onChange={(e) => setAccDescription(e.target.value)}
                      placeholder="Ex.: Compra de legumes e proteínas semanais"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={accAmount}
                      onChange={(e) => setAccAmount(e.target.value)}
                      placeholder="0.00"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">Data</label>
                    <input
                      type="date"
                      value={accDate}
                      onChange={(e) => setAccDate(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Documento / Nota Fiscal (opcional)
                    </label>
                    <input
                      type="text"
                      value={accRefCode}
                      onChange={(e) => setAccRefCode(e.target.value)}
                      placeholder="Ex.: NF-00440 ou Comprovante PIX"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="flex items-end sm:col-span-4">
                    <button
                      type="submit"
                      className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                    >
                      Gravar Lançamento Contábil
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-[#BBF7D0] bg-white p-4">
                <div className="flex items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#DCFCE7] p-1">
                  {(['Todos', 'Entrada', 'Saída'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setAccKindFilter(k)}
                      className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold ${
                        accKindFilter === k
                          ? 'bg-[#15803D] text-white shadow-sm'
                          : 'text-[#14532D] hover:bg-white/75'
                      }`}
                    >
                      {k === 'Todos' ? 'Todos os lançamentos' : `${k}s`}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#15803D]" />
                  <input
                    type="search"
                    value={accSearch}
                    onChange={(e) => setAccSearch(e.target.value)}
                    placeholder="Buscar descrição, categoria ou NF..."
                    className="min-h-[38px] w-64 rounded border border-[#86EFAC] bg-white py-1.5 pr-3 pl-8 text-xs text-[#052E16]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 uppercase tracking-wider text-[#14532D]">
                      <th className="px-4 py-3 font-semibold">Data</th>
                      <th className="px-4 py-3 font-semibold">Doc / Ref</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Descrição</th>
                      <th className="px-4 py-3 text-right font-semibold">Valor (R$)</th>
                      <th className="px-4 py-3 text-right font-semibold">Conciliação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCFCE7]">
                    {filteredAccounting.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#F0FDF4]">
                        <td className="px-4 py-3 font-mono tabular-nums text-[#166534]">
                          {entry.date}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-[#14532D]">
                          {entry.referenceCode}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#052E16]">{entry.category}</td>
                        <td className="px-4 py-3 text-[#14532D]">{entry.description}</td>
                        <td
                          className={`px-4 py-3 text-right font-mono font-bold tabular-nums ${
                            entry.kind === 'Entrada' ? 'text-[#15803D]' : 'text-[#854D0E]'
                          }`}
                        >
                          {entry.kind === 'Entrada' ? '+' : '-'} R${' '}
                          {entry.amountBRL.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReconcileEntry(entry.id)}
                              className={`cursor-pointer text-xs font-bold ${
                                entry.reconciled ? 'text-[#15803D]' : 'text-[#854D0E]'
                              }`}
                            >
                              {entry.reconciled ? 'Conciliado' : 'Pendente'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAccountingEntry(entry.id)}
                              aria-label={`Excluir lançamento ${entry.referenceCode}`}
                              className="cursor-pointer rounded p-1 text-[#15803D] hover:bg-[#FEFCE8] hover:text-[#854D0E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BANCO DE DOADORES MENSAIS */}
          {activeTab === 'monthly-donors' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Banco de Doadores Mensais (Recorrência PIX)
                  </h2>
                  <p className="mt-1 text-xs text-[#166534]">
                    Controle de mantenedores mensais via PIX CNPJ ({PIX_INFO.pixKey}) ou PIX
                    Telefone ({PIX_INFO.pixPhoneDisplay}). Ao confirmar o PIX do mês, o valor entra
                    automaticamente na contabilidade.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewMonthlyForm((prev) => !prev)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{showNewMonthlyForm ? 'Ocultar formulário' : 'Cadastrar Doador Mensal'}</span>
                </button>
              </div>

              {showNewMonthlyForm && (
                <form
                  onSubmit={handleAddMonthlyDonorSubmit}
                  className="grid grid-cols-1 gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-6 sm:grid-cols-12"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Nome do doador mensal
                    </label>
                    <input
                      type="text"
                      required
                      value={mdName}
                      onChange={(e) => setMdName(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#14532D]">E-mail</label>
                    <input
                      type="email"
                      value={mdEmail}
                      onChange={(e) => setMdEmail(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={mdPhone}
                      onChange={(e) => setMdPhone(e.target.value)}
                      placeholder="(68) 99900-0000"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Valor Mensal PIX (R$)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="10"
                      required
                      value={mdAmount}
                      onChange={(e) => setMdAmount(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Dia vencimento
                    </label>
                    <select
                      value={mdDueDay}
                      onChange={(e) => setMdDueDay(Number(e.target.value))}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    >
                      <option value={5}>Dia 05</option>
                      <option value={10}>Dia 10</option>
                      <option value={15}>Dia 15</option>
                      <option value={20}>Dia 20</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Chave PIX escolhida
                    </label>
                    <select
                      value={mdPixChannel}
                      onChange={(e) =>
                        setMdPixChannel(
                          e.target.value as
                            | 'CNPJ 33.314.701/0001-54'
                            | 'Telefone +55 68 9958-7200'
                        )
                      }
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    >
                      <option value="Telefone +55 68 9958-7200">
                        Telefone +55 68 9958-7200
                      </option>
                      <option value="CNPJ 33.314.701/0001-54">CNPJ 33.314.701/0001-54</option>
                    </select>
                  </div>

                  <div className="flex items-end sm:col-span-3">
                    <button
                      type="submit"
                      className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                    >
                      Salvar Doador Mensal
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#14532D] sm:col-span-12">
                    <input
                      type="checkbox"
                      checked={mdPaidNow}
                      onChange={(e) => setMdPaidNow(e.target.checked)}
                      className="h-4 w-4 accent-[#15803D]"
                    />
                    <span>Já recebeu o PIX deste mês (lançar na contabilidade agora)</span>
                  </label>
                </form>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-[#BBF7D0] bg-white p-4">
                <div className="flex flex-wrap items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#DCFCE7] p-1">
                  {(['Todos', 'Em dia', 'Aguardando PIX', 'Pausado'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMonthlyFilter(st)}
                      className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold ${
                        monthlyFilter === st
                          ? 'bg-[#15803D] text-white shadow-sm'
                          : 'text-[#14532D] hover:bg-white/75'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#15803D]" />
                  <input
                    type="search"
                    value={monthlySearch}
                    onChange={(e) => setMonthlySearch(e.target.value)}
                    placeholder="Buscar doador mensal..."
                    className="min-h-[38px] rounded border border-[#86EFAC] bg-white py-1.5 pr-3 pl-8 text-xs text-[#052E16]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 uppercase tracking-wider text-[#14532D]">
                      <th className="px-4 py-3 font-semibold">Doador Mensal</th>
                      <th className="px-4 py-3 font-semibold">Chave PIX / Dia</th>
                      <th className="px-4 py-3 text-right font-semibold">Valor Mensal</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Acumulado</th>
                      <th className="px-4 py-3 font-semibold">Status Mês</th>
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCFCE7]">
                    {filteredMonthlyDonors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-[#F0FDF4]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#052E16]">{donor.name}</p>
                          <p className="text-[11px] text-[#166534]">
                            {donor.email} · {donor.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-[#14532D]">{donor.pixChannel}</p>
                          <p className="text-[11px] text-[#166534]">
                            Todo dia {String(donor.dueDay).padStart(2, '0')} · Último:{' '}
                            {donor.lastPaidMonth || '—'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-[#052E16]">
                          R$ {donor.monthlyAmountBRL.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-[#14532D]">
                          R$ {donor.totalContributedBRL.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Status do doador ${donor.name}`}
                            value={donor.status}
                            onChange={(e) =>
                              updateMonthlyDonorStatus(
                                donor.id,
                                e.target.value as MonthlyDonorStatus
                              )
                            }
                            className={`rounded border border-[#86EFAC] bg-white px-2 py-1 text-xs font-bold ${
                              donor.status === 'Em dia'
                                ? 'text-[#15803D]'
                                : donor.status === 'Pausado'
                                  ? 'text-[#166534]'
                                  : 'text-[#854D0E]'
                            }`}
                          >
                            <option value="Em dia">Em dia</option>
                            <option value="Aguardando PIX">Aguardando PIX</option>
                            <option value="Pausado">Pausado</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => confirmMonthlyDonorPayment(donor.id)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#15803D] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#14532D]"
                            >
                              <CheckCircle2 className="h-3 w-3 text-[#FEF08A]" />
                              <span>Confirmar PIX</span>
                            </button>
                            <a
                              href={buildMonthlyDonorWhatsappUrl(donor)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Enviar recibo WhatsApp de ${donor.name}`}
                              className="inline-flex items-center gap-1 rounded border border-[#86EFAC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#15803D] hover:bg-[#F0FDF4] whitespace-nowrap"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Recibo</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteMonthlyDonor(donor.id)}
                              aria-label={`Remover doador mensal ${donor.name}`}
                              className="cursor-pointer rounded p-1 text-[#15803D] hover:bg-[#FEFCE8] hover:text-[#854D0E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RECEIPTS CONTROL */}
          {activeTab === 'receipts' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Controle de Recebimento de Doações
                  </h2>
                  <p className="mt-1 text-xs text-[#166534]">
                    Confirme transferências PIX, pagamentos de checkout e entregas de produtos.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={buildAllDonationsWhatsappUrl(filteredDonations)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D] whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="h-4 w-4 text-[#FEF08A]" aria-hidden="true" />
                    <span>Enviar Todos os Recibos (WhatsApp)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowNewReceiptForm((prev) => !prev)}
                    className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308] whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Registrar Recebimento</span>
                  </button>
                </div>
              </div>

              {showNewReceiptForm && (
                <form
                  onSubmit={handleAddManualReceipt}
                  className="rounded-lg border-2 border-[#BBF7D0] bg-white p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-[#052E16]">
                      Novo Registro de Recebimento
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewReceiptForm(false)}
                      className="cursor-pointer text-xs font-semibold text-[#854D0E] hover:text-[#052E16]"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">
                        Nome do colaborador
                      </label>
                      <input
                        type="text"
                        required
                        value={newDonorName}
                        onChange={(e) => setNewDonorName(e.target.value)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">E-mail</label>
                      <input
                        type="email"
                        value={newDonorEmail}
                        onChange={(e) => setNewDonorEmail(e.target.value)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">Telefone</label>
                      <input
                        type="tel"
                        value={newDonorPhone}
                        onChange={(e) => setNewDonorPhone(e.target.value)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">Modalidade</label>
                      <select
                        value={newDonationType}
                        onChange={(e) => setNewDonationType(e.target.value as DonationType)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      >
                        <option value="PIX">PIX</option>
                        <option value="PIX Mensal">PIX Mensal</option>
                        <option value="Gateway Cartão/Boleto">Gateway Cartão/Boleto</option>
                        <option value="Produtos">Produtos</option>
                      </select>
                    </div>

                    {newDonationType === 'Produtos' ? (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#14532D]">
                          Descrição dos produtos recebidos
                        </label>
                        <input
                          type="text"
                          required
                          value={newItemsSummary}
                          onChange={(e) => setNewItemsSummary(e.target.value)}
                          placeholder="Ex.: 20 kg Farinha de trigo, 10 kg Açúcar"
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-[#14532D]">
                          Valor (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newAmountBRL}
                          onChange={(e) => setNewAmountBRL(e.target.value)}
                          placeholder="100.00"
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14532D]">Observações</label>
                    <input
                      type="text"
                      value={newDonationNotes}
                      onChange={(e) => setNewDonationNotes(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] cursor-pointer items-center rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                  >
                    Salvar Recebimento
                  </button>
                </form>
              )}

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-[#BBF7D0] bg-white p-4">
                <div className="flex flex-wrap items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#DCFCE7] p-1">
                  {(['Todas', 'Recebida', 'Em Conferência', 'Pendente', 'Cancelada'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                          statusFilter === st
                            ? 'bg-[#15803D] text-white shadow-sm'
                            : 'text-[#14532D] hover:bg-white/75'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'Todos' | DonationType)}
                    aria-label="Filtrar por tipo de doação"
                    className="min-h-[38px] rounded border border-[#86EFAC] bg-white px-3 text-xs font-semibold text-[#052E16]"
                  >
                    <option value="Todos">Todos os canais</option>
                    <option value="PIX">PIX</option>
                    <option value="PIX Mensal">PIX Mensal</option>
                    <option value="Gateway Cartão/Boleto">Gateway Cartão/Boleto</option>
                    <option value="Produtos">Produtos</option>
                  </select>

                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#15803D]" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar colaborador ou protocolo..."
                      className="min-h-[38px] rounded border border-[#86EFAC] bg-white py-1.5 pr-3 pl-8 text-xs text-[#052E16]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 uppercase tracking-wider text-[#14532D]">
                      <th className="px-4 py-3 font-semibold">Data / Protocolo</th>
                      <th className="px-4 py-3 font-semibold">Colaborador &amp; Contato</th>
                      <th className="px-4 py-3 font-semibold">Canal</th>
                      <th className="px-4 py-3 text-right font-semibold">Valor / Produtos</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Controle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCFCE7]">
                    {filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-[#F0FDF4]">
                        <td className="px-4 py-3">
                          <p className="font-mono font-semibold tabular-nums text-[#052E16]">
                            {d.referenceCode}
                          </p>
                          <p className="font-mono text-[11px] tabular-nums text-[#166534]">
                            {d.createdAt}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#052E16]">{d.donorName}</p>
                          <p className="text-[11px] text-[#166534]">
                            {d.donorEmail} · {d.donorPhone}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[#14532D]">{d.type}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-[#052E16]">
                          {typeof d.amountBRL === 'number'
                            ? `R$ ${d.amountBRL.toFixed(2).replace('.', ',')}`
                            : d.itemsSummary}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Alterar status da doação ${d.referenceCode}`}
                            value={d.status}
                            onChange={(e) =>
                              updateDonationStatus(d.id, e.target.value as DonationStatus)
                            }
                            className={`rounded border border-[#86EFAC] bg-white px-2 py-1 text-xs font-bold ${
                              d.status === 'Recebida'
                                ? 'text-[#15803D]'
                                : d.status === 'Cancelada'
                                  ? 'text-[#166534]'
                                  : 'text-[#854D0E]'
                            }`}
                          >
                            <option value="Recebida">Recebida</option>
                            <option value="Em Conferência">Em Conferência</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={buildDonationReceiptWhatsappUrl(d)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Enviar recibo WhatsApp da doação ${d.referenceCode}`}
                              className="inline-flex items-center gap-1 rounded border border-[#86EFAC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#15803D] hover:bg-[#F0FDF4] whitespace-nowrap"
                            >
                              <MessageCircle className="h-3 w-3" aria-hidden="true" />
                              <span>Recibo WhatsApp</span>
                            </a>
                            {d.status !== 'Recebida' && (
                              <button
                                type="button"
                                onClick={() => updateDonationStatus(d.id, 'Recebida')}
                                className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#15803D] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#14532D] whitespace-nowrap"
                              >
                                <CheckCircle2 className="h-3 w-3 text-[#FEF08A]" />
                                <span>Confirmar</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteDonation(d.id)}
                              aria-label={`Excluir registro ${d.referenceCode}`}
                              className="cursor-pointer rounded p-1.5 text-[#15803D] hover:bg-[#FEFCE8] hover:text-[#854D0E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AGENDAMENTO DE COLETA DE DOAÇÕES */}
          {activeTab === 'pickups' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Agenda de Coletas — Veículo Institucional
                  </h2>
                  <p className="mt-1 text-xs text-[#166534]">
                    Cadastre coletas com nome, e-mail, telefone e lista de produtos ou envie a
                    confirmação diretamente para o WhatsApp{' '}
                    <span className="font-mono font-bold text-[#052E16]">
                      {PIX_INFO.pickupWhatsappDisplay}
                    </span>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={buildAllPickupsWhatsappUrl(pickups)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D] whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="h-4 w-4 text-[#FEF08A]" aria-hidden="true" />
                    <span>Enviar Todas as Coletas (WhatsApp)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowNewPickupForm((prev) => !prev)}
                    className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308] whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {showNewPickupForm ? 'Ocultar formulário' : 'Novo Agendamento de Coleta'}
                    </span>
                  </button>
                </div>
              </div>

              {showNewPickupForm && (
                <form
                  onSubmit={handleAdminCreatePickup}
                  className="grid grid-cols-1 gap-6 rounded-lg border-2 border-[#BBF7D0] bg-white p-6 lg:grid-cols-12"
                >
                  <div className="space-y-3 lg:col-span-6">
                    <h3 className="font-serif text-base font-semibold text-[#052E16]">
                      Dados do colaborador
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">
                        Nome do colaborador
                      </label>
                      <input
                        type="text"
                        required
                        value={collabName}
                        onChange={(e) => setCollabName(e.target.value)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#14532D]">
                          E-mail do colaborador
                        </label>
                        <input
                          type="email"
                          required
                          value={collabEmail}
                          onChange={(e) => setCollabEmail(e.target.value)}
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#14532D]">
                          Telefone do colaborador
                        </label>
                        <input
                          type="tel"
                          required
                          value={collabPhone}
                          onChange={(e) => setCollabPhone(e.target.value)}
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#14532D]">
                        Endereço de coleta
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#14532D]">Data</label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#14532D]">Turno</label>
                        <select
                          value={preferredShift}
                          onChange={(e) =>
                            setPreferredShift(
                              e.target.value as
                                | 'Manhã (08h–12h)'
                                | 'Tarde (14h–18h)'
                                | 'Sábado (08h–12h)'
                            )
                          }
                          className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                        >
                          <option value="Manhã (08h–12h)">Manhã (08h–12h)</option>
                          <option value="Tarde (14h–18h)">Tarde (14h–18h)</option>
                          <option value="Sábado (08h–12h)">Sábado (08h–12h)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 lg:col-span-6">
                    <h3 className="font-serif text-base font-semibold text-[#052E16]">
                      Lista de produtos para recebimento
                    </h3>
                    <div className="max-h-56 divide-y divide-[#DCFCE7] overflow-y-auto rounded border border-[#BBF7D0] bg-[#F0FDF4] px-3">
                      {products
                        .filter((p) => p.active)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                            <span className="font-semibold text-[#052E16]">{item.name}</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                value={pickupQuantities[item.id] || ''}
                                placeholder="0"
                                onChange={(e) =>
                                  setPickupQuantities((prev) => ({
                                    ...prev,
                                    [item.id]: Math.max(0, Number(e.target.value) || 0),
                                  }))
                                }
                                className="h-8 w-14 rounded border border-[#86EFAC] bg-white px-2 text-right font-mono tabular-nums text-[#052E16]"
                              />
                              <span className="w-14 text-[#14532D]">{item.unit}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <input
                      type="text"
                      value={pickupCustomItems}
                      onChange={(e) => setPickupCustomItems(e.target.value)}
                      placeholder="Outros itens para coleta..."
                      className="min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="submit"
                        className="inline-flex min-h-[40px] cursor-pointer items-center rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                      >
                        Salvar Agendamento
                      </button>
                      <a
                        href={buildPickupWhatsappUrl({
                          collaboratorName: collabName || 'Colaborador',
                          collaboratorEmail: collabEmail || 'Não informado',
                          collaboratorPhone: collabPhone || 'Não informado',
                          pickupAddress: pickupAddress || 'Plácido de Castro - AC',
                          preferredDate,
                          preferredShift,
                          items: products
                            .filter((p) => (pickupQuantities[p.id] ?? 0) > 0)
                            .map((p) => ({
                              productId: p.id,
                              productName: p.name,
                              quantity: pickupQuantities[p.id],
                              unit: p.unit,
                            })),
                          customItemsText: pickupCustomItems,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border-2 border-[#15803D] bg-white px-4 py-2 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Enviar p/ WhatsApp {PIX_INFO.pickupWhatsappDisplay}</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {pickups.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col justify-between rounded-lg border-2 border-[#BBF7D0] bg-white p-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-medium tabular-nums text-[#15803D]">
                            {p.preferredDate} · {p.preferredShift}
                          </p>
                          <h3 className="mt-1 font-serif text-lg font-semibold text-[#052E16]">
                            {p.collaboratorName}
                          </h3>
                          <p className="text-xs text-[#166534]">
                            {p.collaboratorEmail} ·{' '}
                            <span className="font-mono tabular-nums">{p.collaboratorPhone}</span>
                          </p>
                        </div>

                        <select
                          aria-label={`Status da coleta de ${p.collaboratorName}`}
                          value={p.status}
                          onChange={(e) =>
                            updatePickupStatus(p.id, e.target.value as PickupStatus)
                          }
                          className={`rounded border border-[#86EFAC] bg-white px-2.5 py-1 text-xs font-bold ${
                            p.status === 'Coletada'
                              ? 'text-[#15803D]'
                              : p.status === 'Cancelada'
                                ? 'text-[#166534]'
                                : 'text-[#854D0E]'
                          }`}
                        >
                          <option value="Agendada">Agendada</option>
                          <option value="Em Rota">Em Rota</option>
                          <option value="Coletada">Coletada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>

                      <p className="mt-3 text-xs text-[#14532D]">
                        <strong className="font-semibold text-[#052E16]">Endereço:</strong>{' '}
                        {p.pickupAddress}
                      </p>

                      <div className="mt-3 border-t border-[#DCFCE7] pt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#15803D]">
                          Produtos da coleta
                        </p>
                        <ul className="mt-1.5 space-y-1 text-xs text-[#052E16]">
                          {p.items.map((it) => (
                            <li key={it.productId} className="flex justify-between">
                              <span>{it.productName}</span>
                              <span className="font-mono tabular-nums font-semibold">
                                {it.quantity} {it.unit}
                              </span>
                            </li>
                          ))}
                          {p.customItemsText && (
                            <li className="text-[#166534]">Outros: {p.customItemsText}</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCFCE7] pt-4">
                      <a
                        href={buildPickupWhatsappUrl(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-[#15803D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-[#FEF08A]" aria-hidden="true" />
                        <span>
                          Enviar Recibo da Coleta WhatsApp ({PIX_INFO.pickupWhatsappDisplay})
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>

                      {p.status !== 'Coletada' && (
                        <button
                          type="button"
                          onClick={() => updatePickupStatus(p.id, 'Coletada')}
                          className="cursor-pointer text-xs font-bold text-[#15803D] hover:underline"
                        >
                          Marcar como Coletada
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRODUCT LIST MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5 sm:grid-cols-12 sm:items-end"
              >
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-[#14532D]">
                    Novo produto para recebimento
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Ex.: Óleo de soja 900ml"
                    className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#14532D]">Categoria</label>
                  <select
                    value={newProductCat}
                    onChange={(e) => setNewProductCat(e.target.value as ProductCategory)}
                    className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                  >
                    <option value="Insumos do Sopão">Insumos do Sopão</option>
                    <option value="Panificação Solidária">Panificação Solidária</option>
                    <option value="Porcionamento & Kits">Porcionamento &amp; Kits</option>
                    <option value="Higiene & Limpeza">Higiene &amp; Limpeza</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#14532D]">Unidade</label>
                  <input
                    type="text"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#14532D]">Meta</label>
                  <input
                    type="number"
                    min={1}
                    value={newProductTarget}
                    onChange={(e) => setNewProductTarget(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-2 font-mono text-sm text-[#052E16]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                  >
                    Adicionar item
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 uppercase tracking-wider text-[#14532D]">
                      <th className="px-4 py-3 font-semibold">Produto</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Prioridade</th>
                      <th className="px-4 py-3 text-right font-semibold">Recebido</th>
                      <th className="px-4 py-3 text-right font-semibold">Meta</th>
                      <th className="px-4 py-3 text-right font-semibold">Visível ao público</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCFCE7]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#F0FDF4]">
                        <td className="px-4 py-3 font-semibold text-[#052E16]">{prod.name}</td>
                        <td className="px-4 py-3 text-[#14532D]">{prod.category}</td>
                        <td className="px-4 py-3">
                          <select
                            aria-label={`Prioridade de ${prod.name}`}
                            value={prod.priority}
                            onChange={(e) =>
                              updateProductItem(prod.id, {
                                priority: e.target.value as DonationProductItem['priority'],
                              })
                            }
                            className="rounded border border-[#86EFAC] bg-white px-2 py-1 text-xs font-semibold text-[#052E16]"
                          >
                            <option value="Prioritário">Prioritário</option>
                            <option value="Contínuo">Contínuo</option>
                            <option value="Estável">Estável</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-[#052E16]">
                          {prod.receivedQty} {prod.unit}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-[#166534]">
                          {prod.targetQty} {prod.unit}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => updateProductItem(prod.id, { active: !prod.active })}
                            className={`cursor-pointer text-xs font-bold ${
                              prod.active ? 'text-[#15803D]' : 'text-[#854D0E]'
                            }`}
                          >
                            {prod.active ? 'Ativo na lista' : 'Pausado'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* TAB 7: NOTÍCIAS E AÇÕES RECENTES */}
          {activeTab === 'news' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-5">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#052E16]">
                    Publicações de Notícias e Ações Recentes
                  </h2>
                  <p className="mt-1 text-xs text-[#166534]">
                    As publicações marcadas como ativas aparecem imediatamente na seção{' '}
                    <strong className="text-[#052E16]">Notícias e Ações Recentes</strong> da tela
                    principal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (showNewsForm) {
                      resetNewsForm();
                      setShowNewsForm(false);
                    } else {
                      resetNewsForm();
                      setShowNewsForm(true);
                    }
                  }}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md border border-[#CA8A04] bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{showNewsForm ? 'Ocultar formulário' : 'Nova Notícia / Ação'}</span>
                </button>
              </div>

              {showNewsForm && (
                <form
                  onSubmit={handleSaveNewsSubmit}
                  className="grid grid-cols-1 gap-4 rounded-lg border-2 border-[#BBF7D0] bg-white p-6 sm:grid-cols-12"
                >
                  <div className="flex items-center justify-between sm:col-span-12">
                    <h3 className="font-serif text-base font-semibold text-[#052E16]">
                      {editingNewsId ? 'Editar publicação' : 'Nova Notícia ou Ação Comunitária'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        resetNewsForm();
                        setShowNewsForm(false);
                      }}
                      className="cursor-pointer text-xs font-semibold text-[#854D0E] hover:text-[#052E16]"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Título da notícia ou ação
                    </label>
                    <input
                      type="text"
                      required
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Ex.: Entrega de 180 refeições do Sopão no Bairro Olaria"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">Categoria</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as NewsPostCategory)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    >
                      <option value="Ação Comunitária">Ação Comunitária</option>
                      <option value="Panificação & Cozinha">Panificação &amp; Cozinha</option>
                      <option value="Editais & Transparência">Editais &amp; Transparência</option>
                      <option value="Campanha de Doação">Campanha de Doação</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-[#14532D]">Data</label>
                    <input
                      type="date"
                      required
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 font-mono text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Local da atividade
                    </label>
                    <input
                      type="text"
                      required
                      value={newsLocation}
                      onChange={(e) => setNewsLocation(e.target.value)}
                      placeholder="Sede Bairro Olaria · Plácido de Castro, AC"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Resultado / Destaque curto (opcional)
                    </label>
                    <input
                      type="text"
                      value={newsMetric}
                      onChange={(e) => setNewsMetric(e.target.value)}
                      placeholder="Ex.: 200 porções distribuídas · 12 voluntários"
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Resumo para o cartão da tela principal
                    </label>
                    <input
                      type="text"
                      required
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      placeholder="Resumo objetivo em 1 ou 2 frases sobre a ação realizada..."
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Texto completo da notícia
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={newsFullText}
                      onChange={(e) => setNewsFullText(e.target.value)}
                      placeholder="Descreva os detalhes da ação, famílias atendidas, voluntários envolvidos e agradecimentos..."
                      className="mt-1 w-full rounded border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Foto do acervo oficial ou URL da imagem
                    </label>
                    <select
                      value={newsImageSrc}
                      onChange={(e) => setNewsImageSrc(e.target.value)}
                      className="mt-1 min-h-[40px] w-full rounded border border-[#86EFAC] bg-white px-3 text-sm text-[#052E16]"
                    >
                      {DOCUMENTARY_FIGURES.map((fig) => (
                        <option key={fig.id} value={fig.imageSrc}>
                          {fig.number} — {fig.title}
                        </option>
                      ))}
                      <option value={OFFICIAL_ASSETS.logo}>Logomarca Projeto Sopão Acre</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-[#14532D]">
                      Ou enviar nova foto do computador/celular
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewsFileUpload}
                      className="mt-1 block w-full rounded border border-[#86EFAC] bg-[#F0FDF4] px-3 py-1.5 text-xs text-[#052E16] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#15803D] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-12 pt-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#14532D]">
                      <input
                        type="checkbox"
                        checked={newsPublished}
                        onChange={(e) => setNewsPublished(e.target.checked)}
                        className="h-4 w-4 accent-[#15803D]"
                      />
                      <span>Publicar imediatamente na tela principal</span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-md bg-[#15803D] px-6 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                    >
                      {editingNewsId ? 'Salvar alterações' : 'Publicar Notícia / Ação'}
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-lg border-2 border-[#BBF7D0] bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#BBF7D0] bg-[#DCFCE7]/50 uppercase tracking-wider text-[#14532D]">
                      <th className="px-4 py-3 font-semibold">Data</th>
                      <th className="px-4 py-3 font-semibold">Notícia / Ação</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCFCE7]">
                    {newsPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#F0FDF4]">
                        <td className="px-4 py-3 font-mono tabular-nums text-[#166534] whitespace-nowrap">
                          {post.publishedAt}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.imageSrc || OFFICIAL_ASSETS.logo}
                              alt=""
                              className="h-10 w-14 shrink-0 rounded border border-[#BBF7D0] object-cover"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#052E16]">{post.title}</p>
                              <p className="line-clamp-1 text-[11px] text-[#166534]">
                                {post.summary}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#14532D] whitespace-nowrap">
                          {post.category}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => updateNewsPost(post.id, { published: !post.published })}
                            className={`cursor-pointer text-xs font-bold ${
                              post.published ? 'text-[#15803D]' : 'text-[#854D0E]'
                            }`}
                          >
                            {post.published ? 'Publicada' : 'Rascunho'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditNewsClick(post)}
                              aria-label={`Editar ${post.title}`}
                              className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#86EFAC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#15803D] hover:bg-[#F0FDF4]"
                            >
                              <PenSquare className="h-3 w-3" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteNewsPost(post.id)}
                              aria-label={`Excluir ${post.title}`}
                              className="cursor-pointer rounded p-1.5 text-[#15803D] hover:bg-[#FEFCE8] hover:text-[#854D0E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
