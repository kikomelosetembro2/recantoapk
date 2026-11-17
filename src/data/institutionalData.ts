export interface VolunteerRole {
  id: string;
  title: string;
  category:
    | 'Cozinha & Panificação'
    | 'Triagem & Kits'
    | 'Logística & Entrega'
    | 'Governança & Projetos';
  shift: 'Manhã' | 'Tarde' | 'Fins de Semana';
  schedule: string;
  location: string;
  modality: 'Presencial' | 'Presencial / Híbrido';
  spotsTotal: number;
  spotsFilled: number;
  summary: string;
  activities: string[];
  requirements: string[];
  impactNote: string;
}

export interface DocumentaryFigure {
  id: string;
  number: string;
  title: string;
  caption: string;
  imageSrc: string;
  aspectClass: string;
  category: 'Sopão & Refeições' | 'Pães & Bolos' | 'Porcionamento & Entrega';
  accessionId: string;
  chapterRef: string;
  destination: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  instrument: string;
  description: string;
}

export interface InstitutionalChapter {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  quote?: string;
  paragraphs: string[];
  highlights?: { title: string; detail: string }[];
}

export const OFFICIAL_ASSETS = {
  logo: '/assets/aistudio/logo_marca_ac506922.jpg',
  ebookPdf:
    '/assets/aistudio/E-book_Hist_rico_-_Associa__o_Recanto_Social_Bom_Pastor__1__6c01c77d.pdf',
};

export const INSTITUTION_PROFILE = {
  legalName: 'Associação Recanto Social Bom Pastor',
  popularName: 'Projeto Sopão',
  cnpj: '33.314.701/0001-54',
  foundedAt: '26 de fevereiro de 2019',
  foundedShort: '26/02/2019',
  address: 'Rua Zuila Ferreira de Freitas, nº 933, Bairro Olaria',
  cityState: 'Plácido de Castro - AC',
  cep: 'CEP 69928-000',
  phoneDisplay: '(68) 99958-7200',
  whatsappDigits: '5568999587200',
  stateLaw: 'Lei Ordinária nº 3.809, de 22 de novembro de 2021',
  stateLawShort: 'Lei Estadual nº 3.809/2021',
  fomento: 'Termo de Fomento nº 25 · SEASDH (R$ 100.000,00)',
  judiciary: 'TJAC · Vara Única Criminal de Plácido de Castro',
};

export const INSTITUTION_SPECS = [
  { label: 'Razão Social', value: INSTITUTION_PROFILE.legalName },
  { label: 'Nome Popular', value: INSTITUTION_PROFILE.popularName },
  { label: 'CNPJ', value: INSTITUTION_PROFILE.cnpj, mono: true },
  { label: 'Data de Fundação', value: INSTITUTION_PROFILE.foundedAt },
  {
    label: 'Endereço da Sede',
    value: `${INSTITUTION_PROFILE.address}, ${INSTITUTION_PROFILE.cityState} (${INSTITUTION_PROFILE.cep})`,
  },
  { label: 'Contato Institucional', value: INSTITUTION_PROFILE.phoneDisplay, mono: true },
  {
    label: 'Utilidade Pública Estadual',
    value: `${INSTITUTION_PROFILE.stateLaw} (DOE 24/11/2021)`,
  },
  {
    label: 'Parcerias e Controle Social',
    value: 'Prefeitura de Plácido de Castro · SEASDH · TJAC',
  },
];

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  {
    id: 'preparo-sopao-comunitario',
    title: 'Preparo do Sopão Comunitário',
    category: 'Cozinha & Panificação',
    shift: 'Tarde',
    schedule: 'Terças e Quintas · 14h00 às 18h00',
    location: 'Sede no Bairro Olaria · Plácido de Castro, AC',
    modality: 'Presencial',
    spotsTotal: 8,
    spotsFilled: 5,
    summary:
      'Atuação direta na cozinha comunitária para higienização de legumes, preparo de proteínas e cozimento do tradicional sopão nutritivo distribuído às famílias cadastradas.',
    activities: [
      'Seleção, lavagem e corte de legumes, verduras e temperos frescos.',
      'Apoio no cozimento em caldeirões comunitários seguindo boas práticas de higiene.',
      'Organização e higienização dos utensílios ao término da produção.',
    ],
    requirements: [
      'Disposição para trabalho em equipe na cozinha solidária.',
      'Uso de touca, avental e calçado fechado (fornecidos no local quando necessário).',
      'Comprometimento com o horário de preparo antes da saída para entrega.',
    ],
    impactNote:
      'Carro-chefe da assistência alimentar da associação, garantindo refeições quentes e nutritivas para crianças, idosos e trabalhadores.',
  },
  {
    id: 'panificacao-solidaria-paes-bolos',
    title: 'Panificação Solidária: Pães e Bolos Caseiros',
    category: 'Cozinha & Panificação',
    shift: 'Manhã',
    schedule: 'Segundas, Quartas e Sextas · 06h30 às 10h30',
    location: 'Padaria Comunitária · Rua Zuila Ferreira de Freitas, 933',
    modality: 'Presencial',
    spotsTotal: 6,
    spotsFilled: 4,
    summary:
      'Produção artesanal própria de pães caseiros em formas metálicas, pãezinhos individuais e bolos retangulares para compor os kits de café da manhã e lanche.',
    activities: [
      'Preparo de massas, modelagem de pãezinhos individuais e untagem de assadeiras.',
      'Acompanhamento de fornadas e resfriamento organizado em mesas de triagem.',
      'Corte padronizado de bolos caseiros em porções generosas para crianças e famílias.',
    ],
    requirements: [
      'Pontualidade para o turno matinal de panificação.',
      'Não é obrigatória experiência prévia — voluntários veteranos orientam cada etapa.',
    ],
    impactNote:
      'Garante variedade nutricional nos kits gratuitos distribuídos no Bairro Olaria e comunidades vizinhas.',
  },
  {
    id: 'porcionamento-kits-farofa',
    title: 'Porcionamento, Farofa Temperada e Montagem de Kits',
    category: 'Triagem & Kits',
    shift: 'Tarde',
    schedule: 'Terças e Quintas · 16h30 às 19h00',
    location: 'Mesa de Triagem · Bairro Olaria',
    modality: 'Presencial',
    spotsTotal: 10,
    spotsFilled: 6,
    summary:
      'Organização sanitária e porcionamento individual de pães, bolos, potes de farofa temperada e embalagens do sopão prontos para entrega direta.',
    activities: [
      'Enfileiramento e conferência de potes individuais higienizados com farofa temperada.',
      'Embalagem individual de pãezinhos assados e fatias de bolo para proteção no transporte.',
      'Etiquetagem e organização dos lotes por rota de entrega nos bairros.',
    ],
    requirements: [
      'Cuidado com manipulação limpa de alimentos embalados.',
      'Atenção à contagem de porções por família assistida.',
    ],
    impactNote:
      'Assegura porcionamento padronizado e dignidade no acolhimento alimentar em cada entrega.',
  },
  {
    id: 'logistica-distribuicao-urbana-rural',
    title: 'Apoio Logístico de Distribuição (Zona Urbana e Rural)',
    category: 'Logística & Entrega',
    shift: 'Fins de Semana',
    schedule: 'Sábados · 08h00 às 12h00 (e rotas extras)',
    location: 'Bairro Olaria e Zona Rural de Plácido de Castro',
    modality: 'Presencial',
    spotsTotal: 6,
    spotsFilled: 3,
    summary:
      'Apoio ao embarque, conferência de lista de famílias cadastradas e entrega porta a porta utilizando o veículo institucional zero quilômetro da associação.',
    activities: [
      'Carregamento cuidadoso dos potes e kits alimentares no automóvel da entidade.',
      'Acompanhamento das rotas comunitárias na zona urbana e localidades rurais afastadas.',
      'Registro simples de entrega e escuta acolhedora das demandas emergenciais das famílias.',
    ],
    requirements: [
      'Disponibilidade para deslocamento em rotas comunitárias no município.',
      'CNH categoria B desejável para apoio eventual na condução (não obrigatória para ajudantes).',
    ],
    impactNote:
      'Amplia o raio de atendimento graças ao veículo adquirido via emenda parlamentar e parceria municipal.',
  },
  {
    id: 'captacao-insumos-mobilizacao',
    title: 'Captação de Insumos e Mobilização Local',
    category: 'Logística & Entrega',
    shift: 'Manhã',
    schedule: 'Horário flexível · 4h semanais',
    location: 'Plácido de Castro - AC',
    modality: 'Presencial / Híbrido',
    spotsTotal: 4,
    spotsFilled: 2,
    summary:
      'Articulação permanente junto a produtores rurais, mercados locais e colaboradores comunitários para arrecadação de hortaliças, farinha, proteínas e embalagens.',
    activities: [
      'Mapeamento e contato cordial com apoiadores e comércios parceiros da cidade.',
      'Agendamento de retiradas de doações de alimentos não perecíveis e insumos.',
      'Apoio na organização de campanhas comunitárias de arrecadação.',
    ],
    requirements: [
      'Boa comunicação interpessoal e vínculo com a comunidade placidianense.',
      'Compromisso com a transparência no recebimento de doações.',
    ],
    impactNote:
      'Fortalece a rede de solidariedade local que mantém a cozinha funcionando de forma contínua.',
  },
  {
    id: 'governanca-editais-prestacao-contas',
    title: 'Elaboração de Projetos e Prestação de Contas',
    category: 'Governança & Projetos',
    shift: 'Tarde',
    schedule: 'Horário flexível · 4h a 6h semanais',
    location: 'Sede Administrativa · Bairro Olaria / Remoto',
    modality: 'Presencial / Híbrido',
    spotsTotal: 3,
    spotsFilled: 1,
    summary:
      'Suporte técnico à diretoria na organização documental, redação de planos de aplicação e prestação de contas para editais do TJAC, convênios estaduais e emendas.',
    activities: [
      'Organização de notas fiscais, relatórios fotográficos e comprovantes de entrega.',
      'Apoio na redação de propostas técnicas para novos editais de segurança alimentar.',
      'Atualização do acervo histórico e documental da Associação Recanto Social Bom Pastor.',
    ],
    requirements: [
      'Familiaridade com planilhas, redação administrativa ou gestão de OSCs.',
      'Zelo rigoroso pela idoneidade e controle social dos recursos públicos e judiciais.',
    ],
    impactNote:
      'Sustenta a regularidade exemplar que habilitou a entidade junto à SEASDH e ao Tribunal de Justiça do Acre.',
  },
];

export const DOCUMENTARY_FIGURES: DocumentaryFigure[] = [
  {
    id: 'fig-1',
    number: 'Fig. 1',
    title: 'Projeto Sopão Comunitário',
    caption:
      'Refeição quente e nutritiva preparada com legumes e proteínas, carro-chefe da assistência alimentar da associação em Plácido de Castro.',
    imageSrc: '/assets/extracted/fig1_sopao_comunitario.jpg',
    aspectClass: 'aspect-[3/2]',
    category: 'Sopão & Refeições',
    accessionId: 'ARSBP-CAP6-01',
    chapterRef: 'Capítulo 6 · Página 8',
    destination: 'Doação gratuita às famílias cadastradas',
  },
  {
    id: 'fig-2',
    number: 'Fig. 2',
    title: 'Pães Caseiros Artesanais',
    caption:
      'Fornada de pães grandes recém-assados em formas metálicas na cozinha da entidade para distribuição às famílias cadastradas.',
    imageSrc: '/assets/extracted/fig2_paes_caseiros.jpg',
    aspectClass: 'aspect-square',
    category: 'Pães & Bolos',
    accessionId: 'ARSBP-CAP6-02',
    chapterRef: 'Capítulo 6 · Página 8',
    destination: 'Kits de alimentação familiar',
  },
  {
    id: 'fig-3',
    number: 'Fig. 3',
    title: 'Produção em Larga Escala de Pães',
    caption:
      'Conjunto de assadeiras com pães caseiros dourados prontos para o acondicionamento e entrega comunitária.',
    imageSrc: '/assets/extracted/fig3_paes_larga_escala.jpg',
    aspectClass: 'aspect-[16/9]',
    category: 'Pães & Bolos',
    accessionId: 'ARSBP-CAP6-03',
    chapterRef: 'Capítulo 6 · Página 9',
    destination: 'Distribuição no Bairro Olaria e adjacências',
  },
  {
    id: 'fig-4',
    number: 'Fig. 4',
    title: 'Registro Contínuo da Panificação',
    caption:
      'Mosaico de diversas etapas e fornadas da panificação solidária realizada pelos voluntários da Associação Recanto Social Bom Pastor.',
    imageSrc: '/assets/extracted/fig4_mosaico_panificacao.jpg',
    aspectClass: 'aspect-square',
    category: 'Pães & Bolos',
    accessionId: 'ARSBP-CAP6-04',
    chapterRef: 'Capítulo 6 · Página 9',
    destination: 'Produção própria semanal da sede',
  },
  {
    id: 'fig-5',
    number: 'Fig. 5',
    title: 'Pãezinhos Individuais Assados',
    caption:
      'Centenas de unidades de pães individuais organizados em fileiras sobre a mesa de triagem para compor os kits de doação.',
    imageSrc: '/assets/extracted/fig5_paezinhos_individuais.jpg',
    aspectClass: 'aspect-[4/3]',
    category: 'Pães & Bolos',
    accessionId: 'ARSBP-CAP6-05',
    chapterRef: 'Capítulo 6 · Página 10',
    destination: 'Café da manhã e lanche das famílias',
  },
  {
    id: 'fig-6',
    number: 'Fig. 6',
    title: 'Produção e Corte de Bolos Caseiros',
    caption:
      'Bolos assados em formas retangulares e devidamente fatiados em porções generosas para distribuição às crianças e famílias.',
    imageSrc: '/assets/extracted/fig6_bolos_caseiros.jpg',
    aspectClass: 'aspect-square',
    category: 'Pães & Bolos',
    accessionId: 'ARSBP-CAP6-06',
    chapterRef: 'Capítulo 6 · Página 10',
    destination: 'Atendimento prioritário a crianças e idosos',
  },
  {
    id: 'fig-7',
    number: 'Fig. 7',
    title: 'Porcionamento de Refeições e Farofa',
    caption:
      'Potes individuais higienizados contendo farofa temperada preparada na cozinha comunitária para acompanhamento alimentar.',
    imageSrc: '/assets/extracted/fig7_farofa_porcionada.jpg',
    aspectClass: 'aspect-[4/3]',
    category: 'Porcionamento & Entrega',
    accessionId: 'ARSBP-CAP6-07',
    chapterRef: 'Capítulo 6 · Página 10',
    destination: 'Acompanhamento de refeições principais',
  },
  {
    id: 'fig-8',
    number: 'Fig. 8',
    title: 'Logística de Distribuição às Famílias',
    caption:
      'Dezenas de porções individuais enfileiradas e prontas para entrega direta às famílias carentes assistidas no município.',
    imageSrc: '/assets/extracted/fig8_logistica_distribuicao.jpg',
    aspectClass: 'aspect-[3/4]',
    category: 'Porcionamento & Entrega',
    accessionId: 'ARSBP-CAP6-08',
    chapterRef: 'Capítulo 6 · Página 11',
    destination: 'Entrega direta em zonas urbana e rural',
  },
];

export const TIMELINE_EVENTS: TimelineEntry[] = [
  {
    date: '26/02/2019',
    title: 'Constituição Formal e Abertura do CNPJ',
    instrument: 'CNPJ 33.314.701/0001-54',
    description:
      'Registro jurídico definitivo da Associação Recanto Social Bom Pastor com sede na Rua Zuila Ferreira de Freitas, nº 933, Bairro Olaria, em Plácido de Castro (AC).',
  },
  {
    date: '11/08/2020',
    title: 'Reconhecimento Municipal e Cooperação Administrativa',
    instrument: 'DOE-AC 11/08/2020 · Contrato nº 109/2020',
    description:
      'Publicação oficial no Diário Oficial do Estado do Acre dos atos municipais na gestão do prefeito Gedeon Sousa Barros, estruturando a cozinha comunitária.',
  },
  {
    date: '22/11/2021',
    title: 'Declaração de Utilidade Pública Estadual',
    instrument: 'Lei Ordinária nº 3.809 (DOE 24/11/2021)',
    description:
      'Sancionada pelo Governador Gladson de Lima Cameli e aprovada pela ALEAC, atestando a relevância pública do Projeto Sopão em todo o Estado do Acre.',
  },
  {
    date: '10/11/2023',
    title: 'Celebração de Fomento Estadual com a SEASDH',
    instrument: 'Termo de Fomento nº 25 · R$ 100.000,00',
    description:
      'Convênio oficial com a Secretaria de Estado de Assistência Social e Direitos Humanos destinado ao custeio direto das ações de segurança alimentar.',
  },
  {
    date: '20/12/2023',
    title: 'Entrega de Veículo Zero Quilômetro para Logística',
    instrument: 'Emenda Parlamentar · Dep. Fed. Mara Rocha',
    description:
      'Sob a gestão do prefeito Camilo da Silva, a entidade recebeu automóvel próprio para captação de insumos e distribuição em comunidades afastadas.',
  },
  {
    date: '2024–2026',
    title: 'Contemplação em Editais do Poder Judiciário',
    instrument: 'TJAC · Vara Única Criminal de Plácido de Castro',
    description:
      'Credenciamento e aprovação com recursos de penas pecuniárias, reafirmando a idoneidade documental e garantindo a continuidade ininterrupta do Projeto Sopão.',
  },
];

export const INSTITUTIONAL_CHAPTERS: InstitutionalChapter[] = [
  {
    id: 'cap-1',
    index: 'Capítulo 1',
    title: 'Autobiografia Institucional e Seus Criadores',
    subtitle: 'A gênese comunitária no Bairro Olaria',
    quote:
      '“Nascemos do olhar atento para a mesa vazia do vizinho e da convicção inabalável de que a solidariedade organizada transforma realidades locais.”',
    paragraphs: [
      'Muito antes de contar com registros cartoriais ou repasses governamentais, a Associação Recanto Social Bom Pastor nasceu da sensibilidade humanitária de seus fundadores diante da situação de vulnerabilidade alimentar enfrentada por dezenas de famílias no município de Plácido de Castro, Acre.',
      'Instalada de forma comunitária no Bairro Olaria, a iniciativa iniciou suas atividades focada na preparação e distribuição periódica de refeições (sopa nutritiva), o que rapidamente conferiu à entidade o afetuoso reconhecimento público como o “Projeto Sopão”.',
      'Formalizada juridicamente em 2019, a obra social foi estruturada pela dedicação de voluntários e líderes comunitários placidianos, transformando uma ajuda mútua informal em uma Organização da Sociedade Civil (OSC) rigorosamente regularizada.',
    ],
    highlights: [
      {
        title: 'Segurança Alimentar Direta',
        detail:
          'Preparo artesanal e entrega regular de refeições nutritivas às famílias em vulnerabilidade no Bairro Olaria e adjacências.',
      },
      {
        title: 'Mobilização Voluntária',
        detail:
          'Articulação permanente de moradores, colaboradores locais e lideranças comunitárias em prol da dignidade humana.',
      },
      {
        title: 'Governança e Regularidade',
        detail:
          'Compromisso contínuo com a transparência fiscal, documental e administrativa perante os órgãos de controle do Acre.',
      },
    ],
  },
  {
    id: 'cap-2',
    index: 'Capítulo 2',
    title: 'Fundação Formal e Reconhecimento Municipal (2019–2020)',
    subtitle: 'Estruturação jurídica e inserção na rede de proteção social',
    paragraphs: [
      'Em 26 de fevereiro de 2019, a entidade obteve seu registro jurídico definitivo e abertura do CNPJ 33.314.701/0001-54, fixando sua sede na Rua Zuila Ferreira de Freitas, nº 933, Bairro Olaria, consolidando-se como associação civil sem fins lucrativos voltada à assistência social.',
      'Em agosto de 2020, diante do aumento expressivo da demanda por assistência alimentar, o trabalho do Projeto Sopão recebeu chancela formal do Poder Executivo de Plácido de Castro por meio de publicação no Diário Oficial do Estado do Acre (11/08/2020) e da formalização do Extrato do Contrato nº 109/2020.',
      'A atuação conjunta com o poder público municipal garantiu estabilidade institucional para estruturar a cozinha comunitária e expandir o atendimento a famílias carentes na zona urbana e na zona rural do município.',
    ],
  },
  {
    id: 'cap-3',
    index: 'Capítulo 3',
    title: 'Marco Legislativo de Novembro de 2021 no Acre',
    subtitle: 'Reconhecimento estadual pela ALEAC e Governo do Estado',
    quote:
      '“Quando o poder público reconhece oficialmente uma obra nascida na base da comunidade, a solidariedade deixa de ser apenas um gesto isolado e passa a integrar o patrimônio institucional de todo um Estado.”',
    paragraphs: [
      'O ano de 2021 representou um momento decisivo de reconstrução social no Estado do Acre. Em 22 de novembro de 2021 — ano do 60º aniversário do Estado do Acre e do 119º aniversário do Tratado de Petrópolis —, o Poder Executivo e a Assembleia Legislativa (ALEAC) aprovaram medidas essenciais de reconhecimento comunitário.',
      'Nessa data histórica, foi sancionada a Lei Ordinária nº 3.809, de 22 de novembro de 2021 (publicada no Diário Oficial do Estado de 24/11/2021), declarando oficialmente a Associação Recanto Social Bom Pastor como Entidade de Utilidade Pública Estadual.',
      'Com o novo status legal, a Associação consolidou planos de aplicação claros e rigorosa prestação de contas, habilitando-se plenamente para celebrar convênios estaduais e receber emendas parlamentares.',
    ],
  },
  {
    id: 'cap-4',
    index: 'Capítulo 4',
    title: 'Utilidade Pública Estadual e Fomentos (2021–2023)',
    subtitle: 'Expansão operacional, convênio SEASDH e veículo próprio',
    paragraphs: [
      'Com o título estadual em vigor, a diretoria intensificou a elaboração de projetos técnicos voltados à captação de recursos públicos para ampliar a capacidade operacional do Projeto Sopão.',
      'Em 10 de novembro de 2023, foi celebrado o Termo de Fomento nº 25 com a Secretaria de Estado de Assistência Social e Direitos Humanos (SEASDH), no valor de R$ 100.000,00 (cem mil reais), destinado ao custeio direto das atividades de segurança alimentar e aquisição de gêneros alimentícios.',
      'Em 20 de dezembro de 2023, sob a gestão do prefeito Camilo da Silva, a entidade recebeu um automóvel zero quilômetro adquirido por meio de emenda parlamentar da ex-deputada federal Mara Rocha, equipamento decisivo para alcançar comunidades mais afastadas.',
    ],
  },
  {
    id: 'cap-5',
    index: 'Capítulo 5',
    title: 'Parcerias Recentes e Transparência (2024–2026)',
    subtitle: 'Idoneidade documental e editais do Poder Judiciário',
    paragraphs: [
      'Nos anos de 2024 a 2026, a Associação Recanto Social Bom Pastor destacou-se pela rigorosa governança documental e transparência na aplicação dos recursos, sendo contemplada em editais de destinação de penas pecuniárias geridas pelo Tribunal de Justiça do Estado do Acre (TJAC), por meio da Vara Única Criminal da Comarca de Plácido de Castro.',
      'O credenciamento e a aprovação junto ao Poder Judiciário reafirmam a idoneidade da instituição e asseguram a continuidade ininterrupta do Projeto Sopão em benefício das famílias placidianas.',
    ],
  },
];
