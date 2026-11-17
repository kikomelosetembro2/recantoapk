import { ArrowUpRight, CheckCircle2, Search, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  INSTITUTION_PROFILE,
  VOLUNTEER_ROLES,
  VolunteerRole,
} from '../data/institutionalData';

interface VolunteerApplication {
  id: string;
  roleId: string;
  roleTitle: string;
  fullName: string;
  phone: string;
  availability: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = 'rsbp_volunteer_applications_v1';

const CATEGORIES: Array<'Todas' | VolunteerRole['category']> = [
  'Todas',
  'Cozinha & Panificação',
  'Triagem & Kits',
  'Logística & Entrega',
  'Governança & Projetos',
];

const SHIFTS: Array<'Todos' | VolunteerRole['shift']> = [
  'Todos',
  'Manhã',
  'Tarde',
  'Fins de Semana',
];

export function VolunteerHub() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | VolunteerRole['category']>(
    'Todas'
  );
  const [selectedShift, setSelectedShift] = useState<'Todos' | VolunteerRole['shift']>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<VolunteerRole | null>(null);
  const [showMyApplications, setShowMyApplications] = useState(false);

  const [applications, setApplications] = useState<VolunteerApplication[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as VolunteerApplication[]) : [];
    } catch {
      return [];
    }
  });

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }, [applications]);

  useEffect(() => {
    if (!activeRole && !showMyApplications) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveRole(null);
        setShowMyApplications(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeRole, showMyApplications]);

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VOLUNTEER_ROLES.filter((role) => {
      const matchesCat = selectedCategory === 'Todas' || role.category === selectedCategory;
      const matchesShift = selectedShift === 'Todos' || role.shift === selectedShift;
      const matchesQuery =
        !q ||
        role.title.toLowerCase().includes(q) ||
        role.summary.toLowerCase().includes(q) ||
        role.location.toLowerCase().includes(q);
      return matchesCat && matchesShift && matchesQuery;
    });
  }, [selectedCategory, selectedShift, searchQuery]);

  const totalOpenSpots = useMemo(() => {
    return VOLUNTEER_ROLES.reduce((sum, role) => {
      const userApplied = applications.some((app) => app.roleId === role.id) ? 1 : 0;
      return sum + Math.max(0, role.spotsTotal - role.spotsFilled - userApplied);
    }, 0);
  }, [applications]);

  const openRoleDrawer = (role: VolunteerRole) => {
    setActiveRole(role);
    setAvailability(role.schedule);
    setFormError('');
    setJustSubmittedId(null);
  };

  const handleSubmitApplication = (e: FormEvent) => {
    e.preventDefault();
    if (!activeRole) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 3) {
      setFormError('Informe seu nome completo para registrar a candidatura.');
      return;
    }
    if (trimmedPhone.replace(/\D/g, '').length < 8) {
      setFormError('Informe um telefone ou WhatsApp válido com DDD (ex.: 68 99999-9999).');
      return;
    }

    const existing = applications.find((a) => a.roleId === activeRole.id);
    if (existing) {
      setFormError('Você já possui uma inscrição ativa nesta vaga.');
      return;
    }

    const newApp: VolunteerApplication = {
      id: `${activeRole.id}-${Date.now()}`,
      roleId: activeRole.id,
      roleTitle: activeRole.title,
      fullName: trimmedName,
      phone: trimmedPhone,
      availability: availability.trim() || activeRole.schedule,
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setApplications((prev) => [newApp, ...prev]);
    setJustSubmittedId(newApp.id);
    setFormError('');
    setFullName('');
    setPhone('');
    setNotes('');
  };

  const handleCancelApplication = (id: string) => {
    setApplications((prev) => prev.filter((item) => item.id !== id));
  };

  const buildWhatsappHref = (roleTitle: string, applicantName?: string) => {
    const text = applicantName
      ? `Olá, Projeto Sopão! Meu nome é ${applicantName} e acabei de me inscrever na vaga de voluntariado "${roleTitle}" da Associação Recanto Social Bom Pastor.`
      : `Olá, Projeto Sopão! Gostaria de me candidatar à vaga de voluntariado "${roleTitle}" na sede do Bairro Olaria.`;
    return `https://wa.me/${INSTITUTION_PROFILE.whatsappDigits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="vagas" className="border-b-2 border-[#BBF7D0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-6 border-b border-[#BBF7D0] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
              Central de Voluntariado · Bairro Olaria, Plácido de Castro - AC
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#052E16] sm:text-4xl">
              Vagas abertas no Projeto Sopão
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#14532D]">
              Inspirada no modelo de engajamento comunitário para ONGs, nossa central organiza as
              frentes reais de trabalho voluntário na cozinha solidária, panificação, montagem de
              kits, rotas de entrega e governança documental.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-lg border border-[#FACC15] bg-[#FEFCE8] px-4 py-2.5 text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#854D0E]">
                Vagas disponíveis
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-[#052E16]">
                {totalOpenSpots} posições
              </p>
            </div>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMyApplications(true)}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border-2 border-[#15803D] bg-white px-4 py-2 text-xs font-semibold text-[#15803D] transition-colors hover:bg-[#15803D] hover:text-white whitespace-nowrap shrink-0"
              >
                <span>Minhas inscrições</span>
                <span className="font-mono tabular-nums">({applications.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filtrar vagas por área"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] p-1"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'text-[#14532D] hover:bg-white/80 hover:text-[#052E16]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="shift-filter">
              Filtrar por turno
            </label>
            <select
              id="shift-filter"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as 'Todos' | VolunteerRole['shift'])}
              className="min-h-[42px] cursor-pointer rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-xs font-semibold text-[#052E16]"
            >
              {SHIFTS.map((shift) => (
                <option key={shift} value={shift}>
                  {shift === 'Todos' ? 'Todos os turnos' : `Turno: ${shift}`}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#15803D]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar atividade ou turno..."
                aria-label="Buscar vagas de voluntariado"
                className="min-h-[42px] w-full rounded-md border border-[#86EFAC] bg-white py-2 pr-3 pl-9 text-xs text-[#052E16] placeholder:text-[#15803D]/70"
              />
            </div>
          </div>
        </div>

        {/* Volunteer Roles List */}
        {filteredRoles.length === 0 ? (
          <div className="mt-10 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-10 text-center">
            <p className="font-serif text-xl font-medium text-[#052E16]">
              Nenhuma vaga encontrada para esse filtro
            </p>
            <p className="mt-2 text-sm text-[#14532D]">
              Ajuste a área de atuação, o turno ou limpe a busca para visualizar todas as frentes do
              Projeto Sopão.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todas');
                setSelectedShift('Todos');
                setSearchQuery('');
              }}
              className="mt-5 inline-flex min-h-[40px] cursor-pointer items-center rounded-md bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] hover:bg-[#EAB308]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredRoles.map((role) => {
              const userApplication = applications.find((a) => a.roleId === role.id);
              const remaining = Math.max(
                0,
                role.spotsTotal - role.spotsFilled - (userApplication ? 1 : 0)
              );

              return (
                <article
                  key={role.id}
                  className="flex flex-col justify-between rounded-lg border-2 border-[#BBF7D0] bg-white p-6 transition-colors duration-150 hover:border-[#15803D]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#166534]">
                      <span className="font-semibold text-[#15803D]">{role.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{role.modality}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#854D0E]">Turno: {role.shift}</span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-xl font-semibold text-[#052E16]">
                      {role.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-[#14532D]">{role.summary}</p>

                    <dl className="mt-5 space-y-1.5 border-t border-[#DCFCE7] pt-4 text-xs text-[#166534]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#15803D]">Horário</dt>
                        <dd className="text-right font-semibold text-[#052E16]">{role.schedule}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#15803D]">Local</dt>
                        <dd className="text-right text-[#052E16]">{role.location}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#15803D]">Vagas abertas</dt>
                        <dd className="text-right font-mono tabular-nums font-semibold text-[#052E16]">
                          {remaining} de {role.spotsTotal}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#DCFCE7] pt-4">
                    {userApplication ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>Inscrição registrada</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#854D0E]">
                        Início imediato mediante contato
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => openRoleDrawer(role)}
                      className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-md bg-[#FACC15] px-4 py-2 text-xs font-bold text-[#052E16] border border-[#CA8A04] transition-colors hover:bg-[#EAB308] whitespace-nowrap shrink-0"
                    >
                      <span>{userApplication ? 'Ver detalhes' : 'Quero participar'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Volunteer Role Detail & Application Drawer */}
      {activeRole && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#052E16]/55"
          onClick={() => setActiveRole(null)}
        >
          <div
            className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl border-l-2 border-[#15803D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#BBF7D0] bg-[#F0FDF4] px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-[#15803D]">
                  {activeRole.category} · {activeRole.modality}
                </p>
                <h3 id="role-drawer-title" className="font-serif text-xl font-semibold text-[#052E16]">
                  {activeRole.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRole(null)}
                aria-label="Fechar detalhes da vaga"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#86EFAC] bg-white text-[#052E16] hover:bg-[#FEFCE8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <p className="text-sm leading-relaxed text-[#14532D]">{activeRole.summary}</p>

              <dl className="divide-y divide-[#DCFCE7] rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 text-xs">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#15803D]">Horário previsto</dt>
                  <dd className="text-right font-semibold text-[#052E16]">{activeRole.schedule}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#15803D]">Endereço / Área</dt>
                  <dd className="text-right text-[#052E16]">{activeRole.location}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#15803D]">Impacto direto</dt>
                  <dd className="text-right text-[#14532D]">{activeRole.impactNote}</dd>
                </div>
              </dl>

              <div>
                <h4 className="font-serif text-base font-semibold text-[#052E16]">
                  Atividades da vaga
                </h4>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-[#14532D]">
                  {activeRole.activities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-base font-semibold text-[#052E16]">
                  Orientações e requisitos
                </h4>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-[#14532D]">
                  {activeRole.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#BBF7D0] pt-6">
                {justSubmittedId || applications.some((a) => a.roleId === activeRole.id) ? (
                  <div className="rounded-lg border-2 border-[#15803D] bg-[#F0FDF4] p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#15803D]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-serif text-lg font-semibold text-[#052E16]">
                          Candidatura registrada com sucesso
                        </p>
                        <p className="mt-1 text-sm text-[#14532D]">
                          Seus dados ficaram salvos neste navegador. Para confirmar sua escala com a
                          coordenação do Bairro Olaria, envie sua apresentação diretamente pelo
                          WhatsApp institucional.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <a
                            href={buildWhatsappHref(
                              activeRole.title,
                              applications.find((a) => a.roleId === activeRole.id)?.fullName
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[42px] items-center gap-2 rounded-md bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                          >
                            <span>Confirmar pelo WhatsApp ({INSTITUTION_PROFILE.phoneDisplay})</span>
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              const current = applications.find((a) => a.roleId === activeRole.id);
                              if (current) handleCancelApplication(current.id);
                              setJustSubmittedId(null);
                            }}
                            className="inline-flex min-h-[42px] cursor-pointer items-center rounded-md border border-[#CA8A04] bg-[#FEFCE8] px-4 py-2 text-xs font-semibold text-[#854D0E] hover:bg-[#FEF08A]"
                          >
                            Cancelar inscrição
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <h4 className="font-serif text-lg font-semibold text-[#052E16]">
                      Inscrever-se nesta vaga
                    </h4>

                    <div>
                      <label
                        htmlFor="volunteer-name"
                        className="block text-xs font-semibold text-[#14532D]"
                      >
                        Nome completo
                      </label>
                      <input
                        id="volunteer-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex.: Maria Aparecida da Silva"
                        className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="volunteer-phone"
                        className="block text-xs font-semibold text-[#14532D]"
                      >
                        Telefone / WhatsApp com DDD
                      </label>
                      <input
                        id="volunteer-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(68) 99900-0000"
                        className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="volunteer-availability"
                        className="block text-xs font-semibold text-[#14532D]"
                      >
                        Disponibilidade de dias e horários
                      </label>
                      <input
                        id="volunteer-availability"
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="mt-1.5 min-h-[44px] w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="volunteer-notes"
                        className="block text-xs font-semibold text-[#14532D]"
                      >
                        Experiência ou observação (opcional)
                      </label>
                      <textarea
                        id="volunteer-notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Conte brevemente como gostaria de contribuir..."
                        className="mt-1.5 w-full rounded-md border border-[#86EFAC] bg-white px-3 py-2 text-sm text-[#052E16]"
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

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md bg-[#FACC15] px-5 py-2.5 text-sm font-bold text-[#052E16] border border-[#CA8A04] transition-colors hover:bg-[#EAB308]"
                      >
                        Registrar inscrição
                      </button>

                      <a
                        href={buildWhatsappHref(activeRole.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-[#15803D] bg-white px-4 py-2.5 text-xs font-semibold text-[#15803D] hover:bg-[#F0FDF4]"
                      >
                        <span>Falar direto no WhatsApp</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Applications Drawer */}
      {showMyApplications && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="my-apps-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#052E16]/55"
          onClick={() => setShowMyApplications(false)}
        >
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl border-l-2 border-[#15803D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#BBF7D0] bg-[#F0FDF4] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#15803D]">
                  Registro local de voluntariado
                </p>
                <h3 id="my-apps-title" className="font-serif text-xl font-semibold text-[#052E16]">
                  Minhas inscrições ({applications.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMyApplications(false)}
                aria-label="Fechar minhas inscrições"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#86EFAC] bg-white text-[#052E16]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border border-[#BBF7D0] bg-white p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-base font-semibold text-[#052E16]">
                        {app.roleTitle}
                      </p>
                      <p className="text-xs text-[#166534]">
                        Inscrito em {app.createdAt} · {app.availability}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancelApplication(app.id)}
                      aria-label={`Remover inscrição em ${app.roleTitle}`}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#BBF7D0] text-[#854D0E] hover:bg-[#FEFCE8]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#14532D]">
                    Voluntário: <span className="font-semibold text-[#052E16]">{app.fullName}</span> (
                    {app.phone})
                  </p>

                  <a
                    href={buildWhatsappHref(app.roleTitle, app.fullName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:underline underline-offset-4"
                  >
                    <span>Enviar confirmação pelo WhatsApp</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
