import { useCallback, useEffect, useState } from 'react';

export type DonationType = 'PIX' | 'PIX Mensal' | 'Gateway Cartão/Boleto' | 'Produtos';
export type DonationStatus = 'Recebida' | 'Pendente' | 'Em Conferência' | 'Cancelada';
export type PickupStatus = 'Agendada' | 'Em Rota' | 'Coletada' | 'Cancelada';
export type MonthlyDonorStatus = 'Em dia' | 'Aguardando PIX' | 'Pausado';
export type AccountingKind = 'Entrada' | 'Saída';
export type ProductCategory =
  | 'Insumos do Sopão'
  | 'Panificação Solidária'
  | 'Porcionamento & Kits'
  | 'Higiene & Limpeza';

export type NewsPostCategory =
  | 'Ação Comunitária'
  | 'Panificação & Cozinha'
  | 'Editais & Transparência'
  | 'Campanha de Doação';

export interface NewsPostRecord {
  id: string;
  publishedAt: string;
  title: string;
  category: NewsPostCategory;
  location: string;
  summary: string;
  fullText: string;
  imageSrc?: string;
  highlightMetric?: string;
  published: boolean;
}

export interface DonationProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;
  priority: 'Prioritário' | 'Contínuo' | 'Estável';
  targetQty: number;
  receivedQty: number;
  active: boolean;
}

export interface DonationRecord {
  id: string;
  createdAt: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  type: DonationType;
  amountBRL?: number;
  itemsSummary?: string;
  referenceCode: string;
  status: DonationStatus;
  notes?: string;
}

export interface MonthlyDonorRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  monthlyAmountBRL: number;
  dueDay: number;
  pixChannel: 'CNPJ 33.314.701/0001-54' | 'Telefone +55 68 9958-7200';
  status: MonthlyDonorStatus;
  lastPaidMonth: string; // YYYY-MM or ''
  totalContributedBRL: number;
  notes?: string;
}

export interface AccountingEntry {
  id: string;
  date: string;
  kind: AccountingKind;
  category: string;
  description: string;
  amountBRL: number;
  referenceCode: string;
  reconciled: boolean;
}

export interface PickupItemSelection {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface PickupScheduleRecord {
  id: string;
  createdAt: string;
  collaboratorName: string;
  collaboratorEmail: string;
  collaboratorPhone: string;
  pickupAddress: string;
  preferredDate: string;
  preferredShift: 'Manhã (08h–12h)' | 'Tarde (14h–18h)' | 'Sábado (08h–12h)';
  items: PickupItemSelection[];
  customItemsText?: string;
  status: PickupStatus;
  notes?: string;
}

export const PIX_INFO = {
  keyType: 'CNPJ',
  pixKey: '33.314.701/0001-54',
  pixPhoneDisplay: '+55 68 9958-7200',
  pixPhoneKey: '+556899587200',
  beneficiary: 'Associação Recanto Social Bom Pastor',
  city: 'Plácido de Castro - AC',
  bankLabel: 'Conta Institucional OSC · Projeto Sopão',
  pickupWhatsappDigits: '556899587200',
  pickupWhatsappDisplay: '+55 68 9958-7200',
};

export const INITIAL_PRODUCTS: DonationProductItem[] = [
  {
    id: 'prod-arroz',
    name: 'Arroz tipo 1',
    category: 'Insumos do Sopão',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 200,
    receivedQty: 135,
    active: true,
  },
  {
    id: 'prod-feijao',
    name: 'Feijão carioca ou preto',
    category: 'Insumos do Sopão',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 120,
    receivedQty: 78,
    active: true,
  },
  {
    id: 'prod-macarrao',
    name: 'Macarrão para sopa',
    category: 'Insumos do Sopão',
    unit: 'pct 500g',
    priority: 'Contínuo',
    targetQty: 150,
    receivedQty: 92,
    active: true,
  },
  {
    id: 'prod-proteina',
    name: 'Carne bovina ou frango',
    category: 'Insumos do Sopão',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 100,
    receivedQty: 54,
    active: true,
  },
  {
    id: 'prod-legumes',
    name: 'Legumes frescos (batata, cenoura, abóbora)',
    category: 'Insumos do Sopão',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 180,
    receivedQty: 110,
    active: true,
  },
  {
    id: 'prod-trigo',
    name: 'Farinha de trigo especial',
    category: 'Panificação Solidária',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 250,
    receivedQty: 165,
    active: true,
  },
  {
    id: 'prod-acucar',
    name: 'Açúcar cristal',
    category: 'Panificação Solidária',
    unit: 'kg',
    priority: 'Contínuo',
    targetQty: 100,
    receivedQty: 68,
    active: true,
  },
  {
    id: 'prod-fermento',
    name: 'Fermento biológico seco',
    category: 'Panificação Solidária',
    unit: 'unid 500g',
    priority: 'Contínuo',
    targetQty: 30,
    receivedQty: 18,
    active: true,
  },
  {
    id: 'prod-margarina',
    name: 'Margarina ou óleo de soja',
    category: 'Panificação Solidária',
    unit: 'unid',
    priority: 'Contínuo',
    targetQty: 80,
    receivedQty: 52,
    active: true,
  },
  {
    id: 'prod-farinha-mandioca',
    name: 'Farinha de mandioca (para farofa)',
    category: 'Porcionamento & Kits',
    unit: 'kg',
    priority: 'Prioritário',
    targetQty: 90,
    receivedQty: 48,
    active: true,
  },
  {
    id: 'prod-potes',
    name: 'Potes descartáveis com tampa (500ml)',
    category: 'Porcionamento & Kits',
    unit: 'pct 50 unid',
    priority: 'Prioritário',
    targetQty: 40,
    receivedQty: 24,
    active: true,
  },
  {
    id: 'prod-higiene',
    name: 'Detergente, álcool 70% e luvas descartáveis',
    category: 'Higiene & Limpeza',
    unit: 'kit',
    priority: 'Estável',
    targetQty: 35,
    receivedQty: 26,
    active: true,
  },
];

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-001',
    createdAt: '2026-11-14',
    donorName: 'Raimundo Nonato Ferreira',
    donorEmail: 'raimundo.ferreira@exemplo.com',
    donorPhone: '(68) 99912-4410',
    type: 'PIX',
    amountBRL: 250,
    referenceCode: 'PIX-20261114-01',
    status: 'Recebida',
    notes: 'Apoio mensal para aquisição de farinha de trigo da panificação.',
  },
  {
    id: 'don-002',
    createdAt: '2026-11-15',
    donorName: 'Supermercado Olaria Parceiro',
    donorEmail: 'compras@mercadoolaria.com.br',
    donorPhone: '(68) 99941-8832',
    type: 'Produtos',
    itemsSummary: '30 kg Arroz tipo 1, 20 kg Feijão, 15 pct Macarrão',
    referenceCode: 'COL-20261115-02',
    status: 'Recebida',
    notes: 'Entregue diretamente na sede da Rua Zuila Ferreira de Freitas, 933.',
  },
  {
    id: 'don-003',
    createdAt: '2026-11-16',
    donorName: 'Carla Cristina Mendes',
    donorEmail: 'carla.mendes@exemplo.com',
    donorPhone: '(68) 99973-1129',
    type: 'Gateway Cartão/Boleto',
    amountBRL: 100,
    referenceCode: 'GW-20261116-03',
    status: 'Em Conferência',
    notes: 'Contribuição para compra de potes individuais de 500ml.',
  },
  {
    id: 'don-004',
    createdAt: '2026-11-16',
    donorName: 'José Augusto Almeida',
    donorEmail: 'jose.almeida@exemplo.com',
    donorPhone: '(68) 99985-3091',
    type: 'PIX',
    amountBRL: 50,
    referenceCode: 'PIX-20261116-04',
    status: 'Pendente',
    notes: 'Aguardando envio do comprovante pelo colaborador.',
  },
];

const INITIAL_MONTHLY_DONORS: MonthlyDonorRecord[] = [
  {
    id: 'md-001',
    createdAt: '2026-03-10',
    name: 'Antônia Nascimento Oliveira',
    email: 'antonia.oliveira@exemplo.com',
    phone: '(68) 99931-4210',
    monthlyAmountBRL: 100,
    dueDay: 10,
    pixChannel: 'Telefone +55 68 9958-7200',
    status: 'Em dia',
    lastPaidMonth: '2026-11',
    totalContributedBRL: 900,
    notes: 'Doadora recorrente para insumos da padaria comunitária.',
  },
  {
    id: 'md-002',
    createdAt: '2026-05-05',
    name: 'Comercial Vale do Acre Ltda',
    email: 'financeiro@valedoacre.com.br',
    phone: '(68) 99954-1980',
    monthlyAmountBRL: 250,
    dueDay: 5,
    pixChannel: 'CNPJ 33.314.701/0001-54',
    status: 'Em dia',
    lastPaidMonth: '2026-11',
    totalContributedBRL: 1750,
    notes: 'Patrocinador mensal de proteínas e legumes para o sopão.',
  },
  {
    id: 'md-003',
    createdAt: '2026-07-15',
    name: 'Marcos Vinícius Cavalcante',
    email: 'marcos.cavalcante@exemplo.com',
    phone: '(68) 99982-6614',
    monthlyAmountBRL: 50,
    dueDay: 15,
    pixChannel: 'Telefone +55 68 9958-7200',
    status: 'Aguardando PIX',
    lastPaidMonth: '2026-10',
    totalContributedBRL: 200,
    notes: 'Vencimento dia 15 — lembrete amigável via WhatsApp.',
  },
  {
    id: 'md-004',
    createdAt: '2026-08-20',
    name: 'Luciana Beatriz Souza',
    email: 'luciana.souza@exemplo.com',
    phone: '(68) 99917-9045',
    monthlyAmountBRL: 30,
    dueDay: 20,
    pixChannel: 'CNPJ 33.314.701/0001-54',
    status: 'Aguardando PIX',
    lastPaidMonth: '2026-10',
    totalContributedBRL: 90,
    notes: 'Apoio mensal para embalagens e farofa temperada.',
  },
];

const INITIAL_ACCOUNTING: AccountingEntry[] = [
  {
    id: 'acc-001',
    date: '2026-11-01',
    kind: 'Entrada',
    category: 'Fomento / Edital TJAC',
    description: 'Parcela de custeio operacional — Edital Vara Única Criminal',
    amountBRL: 4500,
    referenceCode: 'TJAC-2026-11',
    reconciled: true,
  },
  {
    id: 'acc-002',
    date: '2026-11-05',
    kind: 'Entrada',
    category: 'Doador Mensal PIX',
    description: 'Mensalidade 2026-11 — Comercial Vale do Acre Ltda',
    amountBRL: 250,
    referenceCode: 'PIXM-20261105',
    reconciled: true,
  },
  {
    id: 'acc-003',
    date: '2026-11-08',
    kind: 'Saída',
    category: 'Insumos do Sopão',
    description: 'Compra de carnes, legumes frescos e temperos para o sopão semanal',
    amountBRL: 1420.5,
    referenceCode: 'NF-00418',
    reconciled: true,
  },
  {
    id: 'acc-004',
    date: '2026-11-10',
    kind: 'Entrada',
    category: 'Doador Mensal PIX',
    description: 'Mensalidade 2026-11 — Antônia Nascimento Oliveira (+55 68 9958-7200)',
    amountBRL: 100,
    referenceCode: 'PIXM-20261110',
    reconciled: true,
  },
  {
    id: 'acc-005',
    date: '2026-11-11',
    kind: 'Saída',
    category: 'Panificação Solidária',
    description: 'Aquisição de sacos de farinha de trigo 25kg, fermento e açúcar',
    amountBRL: 890,
    referenceCode: 'NF-00422',
    reconciled: true,
  },
  {
    id: 'acc-006',
    date: '2026-11-13',
    kind: 'Saída',
    category: 'Embalagens & Gás',
    description: 'Recarga de gás GLP cozinha comunitária e potes 500ml com tampa',
    amountBRL: 465.8,
    referenceCode: 'NF-00429',
    reconciled: true,
  },
  {
    id: 'acc-007',
    date: '2026-11-14',
    kind: 'Entrada',
    category: 'Doação Avulsa PIX',
    description: 'Doação confirmada — Raimundo Nonato Ferreira',
    amountBRL: 250,
    referenceCode: 'PIX-20261114-01',
    reconciled: true,
  },
  {
    id: 'acc-008',
    date: '2026-11-15',
    kind: 'Saída',
    category: 'Logística & Veículo',
    description: 'Abastecimento do veículo institucional para rotas urbana e rural',
    amountBRL: 310,
    referenceCode: 'NF-00435',
    reconciled: true,
  },
];

const INITIAL_PICKUPS: PickupScheduleRecord[] = [
  {
    id: 'col-001',
    createdAt: '2026-11-15',
    collaboratorName: 'Francisca das Chagas Lima',
    collaboratorEmail: 'francisca.lima@exemplo.com',
    collaboratorPhone: '(68) 99924-5501',
    pickupAddress: 'Rua Epitácio Pessoa, 412 · Centro, Plácido de Castro - AC',
    preferredDate: '2026-11-18',
    preferredShift: 'Manhã (08h–12h)',
    items: [
      { productId: 'prod-arroz', productName: 'Arroz tipo 1', quantity: 10, unit: 'kg' },
      { productId: 'prod-trigo', productName: 'Farinha de trigo especial', quantity: 15, unit: 'kg' },
    ],
    status: 'Agendada',
    notes: 'Retirar com o veículo da associação na parte da manhã.',
  },
  {
    id: 'col-002',
    createdAt: '2026-11-14',
    collaboratorName: 'Sítio Boa Esperança — Produtor Local',
    collaboratorEmail: 'producao@sitioboaesperanca.br',
    collaboratorPhone: '(68) 99961-7740',
    pickupAddress: 'Ramal do Pau d’Arco, Km 4 · Zona Rural, Plácido de Castro - AC',
    preferredDate: '2026-11-17',
    preferredShift: 'Tarde (14h–18h)',
    items: [
      {
        productId: 'prod-legumes',
        productName: 'Legumes frescos (batata, cenoura, abóbora)',
        quantity: 40,
        unit: 'kg',
      },
      {
        productId: 'prod-farinha-mandioca',
        productName: 'Farinha de mandioca (para farofa)',
        quantity: 20,
        unit: 'kg',
      },
    ],
    status: 'Em Rota',
    notes: 'Doação de abóbora e macaxeira recém-colhidas.',
  },
];

const INITIAL_NEWS_POSTS: NewsPostRecord[] = [
  {
    id: 'news-001',
    publishedAt: '2026-11-16',
    title: 'Mutirão semanal do Sopão Comunitário atende famílias no Bairro Olaria',
    category: 'Ação Comunitária',
    location: 'Sede Bairro Olaria · Plácido de Castro, AC',
    summary:
      'Voluntários da cozinha solidária prepararam e distribuíram dezenas de porções quentes de sopa nutritiva com legumes, proteínas e farofa temperada.',
    fullText:
      'Nesta semana, a equipe de voluntários da Associação Recanto Social Bom Pastor reuniu-se na sede da Rua Zuila Ferreira de Freitas, nº 933, para mais uma edição do Projeto Sopão Comunitário. Os alimentos foram preparados com insumos recebidos por meio de doações de produtores locais, parceiros comerciais e apoiadores via PIX. As porções individuais foram higienizadas, acondicionadas e entregues gratuitamente às famílias cadastradas do Bairro Olaria e adjacências.',
    imageSrc: '/assets/extracted/fig1_sopao_comunitario.jpg',
    highlightMetric: 'Refeições quentes entregues gratuitamente',
    published: true,
  },
  {
    id: 'news-002',
    publishedAt: '2026-11-14',
    title: 'Padaria solidária amplia fornadas matinais de pães e bolos caseiros',
    category: 'Panificação & Cozinha',
    location: 'Padaria Comunitária · Bairro Olaria',
    summary:
      'A produção própria de pães grandes, pãezinhos individuais e bolos fatiados garante o reforço nutricional do café da manhã de crianças e idosos.',
    fullText:
      'Com apoio dos colaboradores que doam farinha de trigo, açúcar e fermento, a frente de Panificação Solidária manteve o ritmo intenso de fornadas artesanais nesta semana. Centenas de pãezinhos individuais e tabuleiros de bolo caseiro foram assados, resfriados na mesa de triagem e encaminhados junto aos kits familiares distribuídos pela associação.',
    imageSrc: '/assets/extracted/fig3_paes_larga_escala.jpg',
    highlightMetric: 'Produção própria artesanal da sede',
    published: true,
  },
  {
    id: 'news-003',
    publishedAt: '2026-11-10',
    title: 'Veículo institucional leva kits alimentares para ramais da zona rural',
    category: 'Ação Comunitária',
    location: 'Zona Urbana e Rural · Plácido de Castro, AC',
    summary:
      'Automóvel conquistado por meio de emenda parlamentar permite que as entregas alcancem famílias em comunidades mais distantes da sede.',
    fullText:
      'Utilizando o veículo zero quilômetro incorporado ao patrimônio da associação, os voluntários de logística realizaram rotas de entrega na zona urbana e em ramais rurais de Plácido de Castro. Além da entrega das porções alimentares e farofa porcionada, a equipe também realizou coletas de hortaliças e legumes doados por sítios parceiros.',
    imageSrc: '/assets/extracted/fig8_logistica_distribuicao.jpg',
    highlightMetric: 'Atendimento em bairros e zona rural',
    published: true,
  },
  {
    id: 'news-004',
    publishedAt: '2026-11-05',
    title: 'Prestação de contas e regularidade documental junto à SEASDH e TJAC',
    category: 'Editais & Transparência',
    location: 'Secretaria Administrativa · Plácido de Castro, AC',
    summary:
      'Diretoria atualiza balancete mensal e relatórios fotográficos exigidos pelos termos de fomento estadual e editais do Poder Judiciário.',
    fullText:
      'Reafirmando o compromisso de transparência que garantiu o reconhecimento de Utilidade Pública Estadual pela Lei nº 3.809/2021, a Associação Recanto Social Bom Pastor disponibiliza o acompanhamento contínuo de receitas, doações mensais via PIX e aplicação de recursos provenientes do Termo de Fomento nº 25 (SEASDH) e dos editais da Vara Única Criminal do TJAC.',
    imageSrc: '/assets/extracted/fig6_bolos_caseiros.jpg',
    highlightMetric: 'Transparência contábil permanente',
    published: true,
  },
];

const KEY_PRODUCTS = 'rsbp_donation_products_v1';
const KEY_DONATIONS = 'rsbp_donation_records_v1';
const KEY_PICKUPS = 'rsbp_pickup_schedules_v1';
const KEY_MONTHLY_DONORS = 'rsbp_monthly_donors_v1';
const KEY_ACCOUNTING = 'rsbp_accounting_entries_v1';
const KEY_NEWS_POSTS = 'rsbp_news_posts_v1';
const SYNC_EVENT = 'rsbp-donations-sync';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export function buildPixPayload(
  amountBRL?: number,
  keyOption: 'cnpj' | 'phone' = 'cnpj'
): string {
  const key = keyOption === 'phone' ? PIX_INFO.pixPhoneKey : '33314701000154';
  const keySub = `0014br.gov.bcb.pix01${String(key.length).padStart(2, '0')}${key}`;
  const tag26 = `26${String(keySub.length).padStart(2, '0')}${keySub}`;
  const amount = amountBRL && amountBRL > 0 ? amountBRL.toFixed(2) : '';
  const amountTag = amount ? `54${String(amount.length).padStart(2, '0')}${amount}` : '';
  return [
    '000201',
    tag26,
    '52040000',
    '5303986',
    amountTag,
    '5802BR',
    '5925RECANTO SOCIAL BOM PASTOR',
    '6016PLACIDO DE CASTRO',
    '62070503***',
    '6304A1B2',
  ].join('');
}

function formatMoneyBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function buildDonationReceiptWhatsappUrl(donation: DonationRecord): string {
  const valueLine =
    typeof donation.amountBRL === 'number'
      ? `Valor contribuído: ${formatMoneyBRL(donation.amountBRL)}`
      : `Produtos doados: ${donation.itemsSummary || 'Itens diversos'}`;

  const message = [
    '*RECIBO OFICIAL DE DOAÇÃO — PROJETO SOPÃO*',
    'Associação Recanto Social Bom Pastor · CNPJ 33.314.701/0001-54',
    `Protocolo / Recibo: ${donation.referenceCode}`,
    `Data do registro: ${donation.createdAt}`,
    `Doador / Colaborador(a): ${donation.donorName}`,
    `E-mail: ${donation.donorEmail}`,
    `Telefone: ${donation.donorPhone}`,
    `Modalidade: ${donation.type}`,
    valueLine,
    `Status: ${donation.status}`,
    donation.notes ? `Observações: ${donation.notes}` : '',
    '',
    'Plácido de Castro - AC · Bairro Olaria',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${PIX_INFO.pickupWhatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function buildAllDonationsWhatsappUrl(donations: DonationRecord[]): string {
  const receivedTotal = donations
    .filter((d) => d.status === 'Recebida' && typeof d.amountBRL === 'number')
    .reduce((acc, d) => acc + (d.amountBRL ?? 0), 0);

  const maxLines = 15;
  const lines = donations.slice(0, maxLines).map((d, idx) => {
    const val =
      typeof d.amountBRL === 'number'
        ? formatMoneyBRL(d.amountBRL)
        : d.itemsSummary || 'Produtos';
    return `${idx + 1}. [${d.referenceCode}] ${d.createdAt} · ${d.donorName} · ${d.type} · ${val} (${d.status})`;
  });

  const extraCount = donations.length - lines.length;

  const message = [
    '*RECIBO GERAL DE DOAÇÕES — ASSOCIAÇÃO RECANTO SOCIAL BOM PASTOR*',
    'Projeto Sopão · CNPJ 33.314.701/0001-54',
    `Total de registros: ${donations.length}`,
    `Total confirmado em espécie/PIX: ${formatMoneyBRL(receivedTotal)}`,
    '',
    '*Detalhamento das doações:*',
    ...lines,
    extraCount > 0 ? `... e mais ${extraCount} registro(s) no painel administrativo.` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${PIX_INFO.pickupWhatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function buildPickupWhatsappUrl(pickup: {
  id?: string;
  createdAt?: string;
  status?: PickupStatus;
  collaboratorName: string;
  collaboratorEmail: string;
  collaboratorPhone: string;
  pickupAddress: string;
  preferredDate: string;
  preferredShift: string;
  items: PickupItemSelection[];
  customItemsText?: string;
}): string {
  const itemsList = pickup.items
    .map((i) => `- ${i.productName}: ${i.quantity} ${i.unit}`)
    .join('\n');
  const customLine = pickup.customItemsText?.trim()
    ? `\n- Outros itens: ${pickup.customItemsText.trim()}`
    : '';

  const message = [
    '*RECIBO DE AGENDAMENTO DE COLETA — PROJETO SOPÃO*',
    'Associação Recanto Social Bom Pastor · CNPJ 33.314.701/0001-54',
    pickup.id ? `Protocolo da coleta: ${pickup.id.toUpperCase()}` : '',
    pickup.status ? `Status da coleta: ${pickup.status}` : '',
    `Colaborador(a): ${pickup.collaboratorName}`,
    `E-mail: ${pickup.collaboratorEmail}`,
    `Telefone: ${pickup.collaboratorPhone}`,
    `Endereço de coleta: ${pickup.pickupAddress}`,
    `Data e turno: ${pickup.preferredDate} · ${pickup.preferredShift}`,
    '',
    '*Lista de produtos para recebimento:*',
    itemsList || '- A combinar no momento da coleta',
    customLine,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${PIX_INFO.pickupWhatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function buildAllPickupsWhatsappUrl(pickups: PickupScheduleRecord[]): string {
  const maxItems = 12;
  const lines = pickups.slice(0, maxItems).map((p, idx) => {
    const prodSummary = [
      ...p.items.map((i) => `${i.quantity} ${i.unit} ${i.productName}`),
      p.customItemsText?.trim() || '',
    ]
      .filter(Boolean)
      .join(', ');

    return `${idx + 1}. [${p.id.toUpperCase()}] ${p.preferredDate} (${p.preferredShift}) · ${p.collaboratorName} (${p.collaboratorPhone}) · ${p.pickupAddress} · Itens: ${prodSummary || 'A combinar'} · Status: ${p.status}`;
  });

  const extraCount = pickups.length - lines.length;

  const message = [
    '*RECIBO GERAL DE AGENDAMENTOS DE COLETA — PROJETO SOPÃO*',
    'Associação Recanto Social Bom Pastor · CNPJ 33.314.701/0001-54',
    `Total de coletas listadas: ${pickups.length}`,
    '',
    '*Agenda de retiradas:*',
    ...lines,
    extraCount > 0 ? `... e mais ${extraCount} coleta(s) no painel administrativo.` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${PIX_INFO.pickupWhatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function buildMonthlyDonorWhatsappUrl(donor: {
  name: string;
  email?: string;
  phone?: string;
  monthlyAmountBRL: number;
  dueDay: number;
  pixChannel: string;
  status?: MonthlyDonorStatus;
  totalContributedBRL?: number;
}): string {
  const message = [
    '*RECIBO DE DOADOR MENSAL PIX — PROJETO SOPÃO*',
    'Associação Recanto Social Bom Pastor · CNPJ 33.314.701/0001-54',
    `Doador(a): ${donor.name}`,
    donor.email ? `E-mail: ${donor.email}` : '',
    donor.phone ? `Telefone: ${donor.phone}` : '',
    `Valor mensal via PIX: ${formatMoneyBRL(donor.monthlyAmountBRL)}`,
    `Dia de contribuição: Todo dia ${String(donor.dueDay).padStart(2, '0')}`,
    `Chave PIX escolhida: ${donor.pixChannel}`,
    donor.status ? `Status: ${donor.status}` : '',
    typeof donor.totalContributedBRL === 'number'
      ? `Total acumulado contribuído: ${formatMoneyBRL(donor.totalContributedBRL)}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${PIX_INFO.pickupWhatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function useDonationsStore() {
  const [products, setProducts] = useState<DonationProductItem[]>(() =>
    readStorage(KEY_PRODUCTS, INITIAL_PRODUCTS)
  );
  const [donations, setDonations] = useState<DonationRecord[]>(() =>
    readStorage(KEY_DONATIONS, INITIAL_DONATIONS)
  );
  const [pickups, setPickups] = useState<PickupScheduleRecord[]>(() =>
    readStorage(KEY_PICKUPS, INITIAL_PICKUPS)
  );
  const [monthlyDonors, setMonthlyDonors] = useState<MonthlyDonorRecord[]>(() =>
    readStorage(KEY_MONTHLY_DONORS, INITIAL_MONTHLY_DONORS)
  );
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>(() =>
    readStorage(KEY_ACCOUNTING, INITIAL_ACCOUNTING)
  );
  const [newsPosts, setNewsPosts] = useState<NewsPostRecord[]>(() =>
    readStorage(KEY_NEWS_POSTS, INITIAL_NEWS_POSTS)
  );

  useEffect(() => {
    const sync = () => {
      setProducts(readStorage(KEY_PRODUCTS, INITIAL_PRODUCTS));
      setDonations(readStorage(KEY_DONATIONS, INITIAL_DONATIONS));
      setPickups(readStorage(KEY_PICKUPS, INITIAL_PICKUPS));
      setMonthlyDonors(readStorage(KEY_MONTHLY_DONORS, INITIAL_MONTHLY_DONORS));
      setAccountingEntries(readStorage(KEY_ACCOUNTING, INITIAL_ACCOUNTING));
      setNewsPosts(readStorage(KEY_NEWS_POSTS, INITIAL_NEWS_POSTS));
    };
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const appendAccountingIfMissing = useCallback(
    (entry: Omit<AccountingEntry, 'id'>) => {
      const current = readStorage<AccountingEntry[]>(KEY_ACCOUNTING, INITIAL_ACCOUNTING);
      if (current.some((a) => a.referenceCode === entry.referenceCode)) return;
      const next: AccountingEntry[] = [{ ...entry, id: `acc-${Date.now()}` }, ...current];
      setAccountingEntries(next);
      writeStorage(KEY_ACCOUNTING, next);
    },
    []
  );

  const addDonation = useCallback(
    (entry: Omit<DonationRecord, 'id' | 'createdAt' | 'referenceCode'>) => {
      const current = readStorage<DonationRecord[]>(KEY_DONATIONS, INITIAL_DONATIONS);
      const today = new Date().toISOString().slice(0, 10);
      const prefix =
        entry.type === 'PIX'
          ? 'PIX'
          : entry.type === 'PIX Mensal'
            ? 'PIXM'
            : entry.type === 'Produtos'
              ? 'PROD'
              : 'GW';
      const referenceCode = `${prefix}-${today.replace(/-/g, '')}-${String(
        current.length + 1
      ).padStart(2, '0')}`;
      const newRecord: DonationRecord = {
        ...entry,
        id: `don-${Date.now()}`,
        createdAt: today,
        referenceCode,
      };
      const next = [newRecord, ...current];
      setDonations(next);
      writeStorage(KEY_DONATIONS, next);

      if (newRecord.status === 'Recebida' && typeof newRecord.amountBRL === 'number') {
        appendAccountingIfMissing({
          date: today,
          kind: 'Entrada',
          category:
            newRecord.type === 'PIX Mensal'
              ? 'Doador Mensal PIX'
              : newRecord.type === 'PIX'
                ? 'Doação Avulsa PIX'
                : 'Gateway Cartão/Boleto',
          description: `Doação confirmada — ${newRecord.donorName}`,
          amountBRL: newRecord.amountBRL,
          referenceCode,
          reconciled: true,
        });
      }

      return newRecord;
    },
    [appendAccountingIfMissing]
  );

  const updateDonationStatus = useCallback(
    (id: string, status: DonationStatus) => {
      const current = readStorage<DonationRecord[]>(KEY_DONATIONS, INITIAL_DONATIONS);
      const target = current.find((d) => d.id === id);
      const next = current.map((d) => (d.id === id ? { ...d, status } : d));
      setDonations(next);
      writeStorage(KEY_DONATIONS, next);

      if (
        status === 'Recebida' &&
        target &&
        typeof target.amountBRL === 'number' &&
        target.amountBRL > 0
      ) {
        appendAccountingIfMissing({
          date: new Date().toISOString().slice(0, 10),
          kind: 'Entrada',
          category:
            target.type === 'PIX Mensal'
              ? 'Doador Mensal PIX'
              : target.type === 'PIX'
                ? 'Doação Avulsa PIX'
                : 'Gateway Cartão/Boleto',
          description: `Doação liquidada — ${target.donorName}`,
          amountBRL: target.amountBRL,
          referenceCode: target.referenceCode,
          reconciled: true,
        });
      }
    },
    [appendAccountingIfMissing]
  );

  const deleteDonation = useCallback((id: string) => {
    const current = readStorage<DonationRecord[]>(KEY_DONATIONS, INITIAL_DONATIONS);
    const next = current.filter((d) => d.id !== id);
    setDonations(next);
    writeStorage(KEY_DONATIONS, next);
  }, []);

  const addMonthlyDonor = useCallback(
    (
      donor: Omit<
        MonthlyDonorRecord,
        'id' | 'createdAt' | 'status' | 'lastPaidMonth' | 'totalContributedBRL'
      > & { paidFirstMonthNow?: boolean }
    ) => {
      const current = readStorage<MonthlyDonorRecord[]>(
        KEY_MONTHLY_DONORS,
        INITIAL_MONTHLY_DONORS
      );
      const today = new Date().toISOString().slice(0, 10);
      const currentMonth = today.slice(0, 7);
      const paidNow = Boolean(donor.paidFirstMonthNow);

      const newDonor: MonthlyDonorRecord = {
        id: `md-${Date.now()}`,
        createdAt: today,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        monthlyAmountBRL: donor.monthlyAmountBRL,
        dueDay: donor.dueDay,
        pixChannel: donor.pixChannel,
        status: paidNow ? 'Em dia' : 'Aguardando PIX',
        lastPaidMonth: paidNow ? currentMonth : '',
        totalContributedBRL: paidNow ? donor.monthlyAmountBRL : 0,
        notes: donor.notes,
      };

      const next = [newDonor, ...current];
      setMonthlyDonors(next);
      writeStorage(KEY_MONTHLY_DONORS, next);

      if (paidNow) {
        const ref = `PIXM-${today.replace(/-/g, '')}-${String(current.length + 1).padStart(2, '0')}`;
        appendAccountingIfMissing({
          date: today,
          kind: 'Entrada',
          category: 'Doador Mensal PIX',
          description: `Adesão mensal ${currentMonth} — ${newDonor.name} (${newDonor.pixChannel})`,
          amountBRL: newDonor.monthlyAmountBRL,
          referenceCode: ref,
          reconciled: true,
        });
      }

      return newDonor;
    },
    [appendAccountingIfMissing]
  );

  const confirmMonthlyDonorPayment = useCallback(
    (id: string) => {
      const current = readStorage<MonthlyDonorRecord[]>(
        KEY_MONTHLY_DONORS,
        INITIAL_MONTHLY_DONORS
      );
      const target = current.find((m) => m.id === id);
      if (!target) return;

      const today = new Date().toISOString().slice(0, 10);
      const currentMonth = today.slice(0, 7);

      const next = current.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Em dia' as MonthlyDonorStatus,
              lastPaidMonth: currentMonth,
              totalContributedBRL: m.totalContributedBRL + m.monthlyAmountBRL,
            }
          : m
      );
      setMonthlyDonors(next);
      writeStorage(KEY_MONTHLY_DONORS, next);

      const refCode = `PIXM-${currentMonth.replace('-', '')}-${id.slice(-4)}-${Date.now()
        .toString()
        .slice(-3)}`;

      appendAccountingIfMissing({
        date: today,
        kind: 'Entrada',
        category: 'Doador Mensal PIX',
        description: `Mensalidade ${currentMonth} — ${target.name} (${target.pixChannel})`,
        amountBRL: target.monthlyAmountBRL,
        referenceCode: refCode,
        reconciled: true,
      });

      // Also mirror into DonationRecord receipts
      const currentDonations = readStorage<DonationRecord[]>(KEY_DONATIONS, INITIAL_DONATIONS);
      const mirroredDonation: DonationRecord = {
        id: `don-md-${Date.now()}`,
        createdAt: today,
        donorName: target.name,
        donorEmail: target.email,
        donorPhone: target.phone,
        type: 'PIX Mensal',
        amountBRL: target.monthlyAmountBRL,
        referenceCode: refCode,
        status: 'Recebida',
        notes: `Mensalidade ${currentMonth} via ${target.pixChannel}`,
      };
      const nextDonations = [mirroredDonation, ...currentDonations];
      setDonations(nextDonations);
      writeStorage(KEY_DONATIONS, nextDonations);
    },
    [appendAccountingIfMissing]
  );

  const updateMonthlyDonorStatus = useCallback((id: string, status: MonthlyDonorStatus) => {
    const current = readStorage<MonthlyDonorRecord[]>(
      KEY_MONTHLY_DONORS,
      INITIAL_MONTHLY_DONORS
    );
    const next = current.map((m) => (m.id === id ? { ...m, status } : m));
    setMonthlyDonors(next);
    writeStorage(KEY_MONTHLY_DONORS, next);
  }, []);

  const deleteMonthlyDonor = useCallback((id: string) => {
    const current = readStorage<MonthlyDonorRecord[]>(
      KEY_MONTHLY_DONORS,
      INITIAL_MONTHLY_DONORS
    );
    const next = current.filter((m) => m.id !== id);
    setMonthlyDonors(next);
    writeStorage(KEY_MONTHLY_DONORS, next);
  }, []);

  const addAccountingEntry = useCallback(
    (entry: Omit<AccountingEntry, 'id' | 'referenceCode'> & { referenceCode?: string }) => {
      const current = readStorage<AccountingEntry[]>(KEY_ACCOUNTING, INITIAL_ACCOUNTING);
      const code =
        entry.referenceCode?.trim() ||
        `${entry.kind === 'Entrada' ? 'ENT' : 'SAI'}-${entry.date.replace(/-/g, '')}-${String(
          current.length + 1
        ).padStart(2, '0')}`;
      const newAcc: AccountingEntry = {
        id: `acc-${Date.now()}`,
        date: entry.date,
        kind: entry.kind,
        category: entry.category,
        description: entry.description,
        amountBRL: entry.amountBRL,
        referenceCode: code,
        reconciled: entry.reconciled,
      };
      const next = [newAcc, ...current];
      setAccountingEntries(next);
      writeStorage(KEY_ACCOUNTING, next);
      return newAcc;
    },
    []
  );

  const toggleReconcileEntry = useCallback((id: string) => {
    const current = readStorage<AccountingEntry[]>(KEY_ACCOUNTING, INITIAL_ACCOUNTING);
    const next = current.map((a) => (a.id === id ? { ...a, reconciled: !a.reconciled } : a));
    setAccountingEntries(next);
    writeStorage(KEY_ACCOUNTING, next);
  }, []);

  const deleteAccountingEntry = useCallback((id: string) => {
    const current = readStorage<AccountingEntry[]>(KEY_ACCOUNTING, INITIAL_ACCOUNTING);
    const next = current.filter((a) => a.id !== id);
    setAccountingEntries(next);
    writeStorage(KEY_ACCOUNTING, next);
  }, []);

  const addPickupSchedule = useCallback(
    (entry: Omit<PickupScheduleRecord, 'id' | 'createdAt' | 'status'>) => {
      const currentPickups = readStorage<PickupScheduleRecord[]>(
        KEY_PICKUPS,
        INITIAL_PICKUPS
      );
      const today = new Date().toISOString().slice(0, 10);
      const newPickup: PickupScheduleRecord = {
        ...entry,
        id: `col-${Date.now()}`,
        createdAt: today,
        status: 'Agendada',
      };
      const nextPickups = [newPickup, ...currentPickups];
      setPickups(nextPickups);
      writeStorage(KEY_PICKUPS, nextPickups);

      const summaryParts = entry.items.map(
        (item) => `${item.quantity} ${item.unit} ${item.productName}`
      );
      if (entry.customItemsText?.trim()) {
        summaryParts.push(entry.customItemsText.trim());
      }
      const currentDonations = readStorage<DonationRecord[]>(
        KEY_DONATIONS,
        INITIAL_DONATIONS
      );
      const linkedDonation: DonationRecord = {
        id: `don-col-${Date.now()}`,
        createdAt: today,
        donorName: entry.collaboratorName,
        donorEmail: entry.collaboratorEmail,
        donorPhone: entry.collaboratorPhone,
        type: 'Produtos',
        itemsSummary: summaryParts.join(', ') || 'Coleta agendada de alimentos',
        referenceCode: `COL-${today.replace(/-/g, '')}-${String(
          currentDonations.length + 1
        ).padStart(2, '0')}`,
        status: 'Pendente',
        notes: `Coleta agendada para ${entry.preferredDate} (${entry.preferredShift}) em ${entry.pickupAddress}.`,
      };
      const nextDonations = [linkedDonation, ...currentDonations];
      setDonations(nextDonations);
      writeStorage(KEY_DONATIONS, nextDonations);

      return newPickup;
    },
    []
  );

  const updatePickupStatus = useCallback((id: string, status: PickupStatus) => {
    const current = readStorage<PickupScheduleRecord[]>(KEY_PICKUPS, INITIAL_PICKUPS);
    const target = current.find((p) => p.id === id);
    const next = current.map((p) => (p.id === id ? { ...p, status } : p));
    setPickups(next);
    writeStorage(KEY_PICKUPS, next);

    if (status === 'Coletada' && target && target.status !== 'Coletada') {
      const currentProducts = readStorage<DonationProductItem[]>(
        KEY_PRODUCTS,
        INITIAL_PRODUCTS
      );
      const nextProducts = currentProducts.map((prod) => {
        const matched = target.items.find((i) => i.productId === prod.id);
        if (!matched) return prod;
        return { ...prod, receivedQty: prod.receivedQty + matched.quantity };
      });
      setProducts(nextProducts);
      writeStorage(KEY_PRODUCTS, nextProducts);
    }
  }, []);

  const addProductItem = useCallback(
    (item: Omit<DonationProductItem, 'id' | 'receivedQty' | 'active'>) => {
      const current = readStorage<DonationProductItem[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
      const newProd: DonationProductItem = {
        ...item,
        id: `prod-${Date.now()}`,
        receivedQty: 0,
        active: true,
      };
      const next = [newProd, ...current];
      setProducts(next);
      writeStorage(KEY_PRODUCTS, next);
      return newProd;
    },
    []
  );

  const updateProductItem = useCallback(
    (id: string, patch: Partial<DonationProductItem>) => {
      const current = readStorage<DonationProductItem[]>(KEY_PRODUCTS, INITIAL_PRODUCTS);
      const next = current.map((p) => (p.id === id ? { ...p, ...patch } : p));
      setProducts(next);
      writeStorage(KEY_PRODUCTS, next);
    },
    []
  );

  const addNewsPost = useCallback((post: Omit<NewsPostRecord, 'id'>) => {
    const current = readStorage<NewsPostRecord[]>(KEY_NEWS_POSTS, INITIAL_NEWS_POSTS);
    const newPost: NewsPostRecord = {
      ...post,
      id: `news-${Date.now()}`,
    };
    const next = [newPost, ...current].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt)
    );
    setNewsPosts(next);
    writeStorage(KEY_NEWS_POSTS, next);
    return newPost;
  }, []);

  const updateNewsPost = useCallback((id: string, patch: Partial<NewsPostRecord>) => {
    const current = readStorage<NewsPostRecord[]>(KEY_NEWS_POSTS, INITIAL_NEWS_POSTS);
    const next = current
      .map((item) => (item.id === id ? { ...item, ...patch } : item))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    setNewsPosts(next);
    writeStorage(KEY_NEWS_POSTS, next);
  }, []);

  const deleteNewsPost = useCallback((id: string) => {
    const current = readStorage<NewsPostRecord[]>(KEY_NEWS_POSTS, INITIAL_NEWS_POSTS);
    const next = current.filter((item) => item.id !== id);
    setNewsPosts(next);
    writeStorage(KEY_NEWS_POSTS, next);
  }, []);

  return {
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
  };
}
