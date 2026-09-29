import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { CountryFlag } from './CountryFlag';
import { featuredSpeakers, internationalFaculty } from '../data/speakers';
import {
  type ProgramDay,
  type ProgramItem,
  type ProgramVenue,
  classifyEvent,
  classifySpecialty,
  formatDayLabel,
  kindStyles,
  normalizeTitle,
  parseDetailLines,
  venueLabel,
} from '../lib/programUtils';

type Props = {
  program: ProgramDay[];
  pdfUrl?: string;
};

const speakerOptions = [
  ...new Set([...featuredSpeakers.map((speaker) => speaker.name), ...internationalFaculty.map((speaker) => speaker.name)]),
].sort((a, b) => a.localeCompare(b, 'es'));

function stripDoctorPrefix(name: string) {
  return name.replace(/^(Dr\.|Dra\.|Prof\.|Lic\.)\s*/i, '').trim();
}

function VenueIcon({ icon }: { icon: 'hospital' | 'hotel' | 'beach' | 'hall' }) {
  const paths = {
    hospital: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 20V8l4-3 4 3v12M6 20h12M10 14h1v4h-1v-4zm4 0h1v4h-1v-4z" />,
    hotel: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 20V9l8-5 8 5v11M8 20v-6h8v6" />,
    beach: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 18c2-4 4-6 8-6s6 2 8 6M6 14l2-2m4 2l2-2m4 2l2-2" />,
    hall: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14v10H5zM9 8V5h6v3" />,
  };
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      {paths[icon]}
    </svg>
  );
}

function ProgramEventCard({
  item,
  index,
  expanded,
  onToggle,
}: {
  item: ProgramItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const title = normalizeTitle(item.title || '');
  const kind = (item.kind as keyof typeof kindStyles) || classifyEvent(title, item.details);
  const specialty = classifySpecialty(title, item.details);
  const styles = kindStyles[kind] ?? kindStyles.talk;
  const details = parseDetailLines(item.details);
  const hasDetails = details.length > 0;
  const isSection = kind === 'section';

  if (isSection) {
    return (
      <div className="relative pl-7 sm:pl-9">
        <div className={`absolute left-2.5 top-4 h-2.5 w-2.5 rounded-full sm:left-3.5 ${styles.dot}`} />
        <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${styles.card}`}>
          <div className="flex flex-wrap gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{styles.label}</p>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium text-slate-400">{specialty}</span>
          </div>
          <h4 className="mt-1.5 text-base font-semibold leading-snug text-white sm:text-lg">{title}</h4>
          {hasDetails ? <p className="mt-2 text-sm leading-6 text-slate-300">{details.join(' · ')}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.015, 0.25) }}
      className="group relative pl-7 sm:pl-9"
    >
      <div className={`absolute left-2.5 top-5 z-10 h-2.5 w-2.5 rounded-full ring-4 ring-deep sm:left-3.5 ${styles.dot}`} />
      <div
        className={`rounded-2xl border p-4 transition duration-200 sm:p-5 ${styles.card} ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={hasDetails ? onToggle : undefined}
        onKeyDown={
          hasDetails
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggle();
                }
              }
            : undefined
        }
        role={hasDetails ? 'button' : undefined}
        tabIndex={hasDetails ? 0 : undefined}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {item.time ? (
            <time className="inline-flex w-fit shrink-0 rounded-lg border border-gold/15 bg-deep/80 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-gold sm:min-w-[7.4rem] sm:justify-center">
              {item.time}
            </time>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${styles.badge}`}>
                {styles.label}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-medium text-slate-400">
                {specialty}
              </span>
              {item.country ? <CountryFlag country={item.country} size="sm" showName={false} className="shrink-0" /> : null}
              {item.price ? <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold text-gold">{item.price}</span> : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-[15px] font-semibold leading-6 text-white sm:text-base">{title}</h4>
              {item.logo ? (
                <img src={item.logo} alt="Logo del simposio" className="h-9 w-auto rounded-xl border border-white/10 bg-slate-950/80 p-1.5 object-contain" loading="lazy" />
              ) : null}
            </div>

            <AnimatePresence initial={false}>
              {expanded && hasDetails ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                    {details.map((line) => (
                      <li key={line} className="flex gap-2 text-sm leading-6 text-slate-300">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {hasDetails && !expanded ? <p className="mt-2 text-xs text-slate-500">Ver coordinadores, ponentes y detalles</p> : null}
          </div>

          {hasDetails ? <span className={`shrink-0 self-end text-sm text-gold transition sm:self-start ${expanded ? 'rotate-180' : ''}`} aria-hidden>▾</span> : null}
        </div>
      </div>
    </motion.article>
  );
}

function VenueTimeline({ venue, dayKey }: { venue: ProgramVenue; dayKey: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const meta = venueLabel(venue.name);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] shadow-xl shadow-black/10">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/20 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/15">
            <VenueIcon icon={meta.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Sede</p>
            <h3 className="truncate text-base font-semibold text-white sm:text-lg">{meta.label}</h3>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">{venue.items.length} actividades</span>
      </div>

      <div className="relative space-y-3 p-4 before:absolute before:bottom-6 before:left-[1.6rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-gold/45 before:via-white/10 before:to-transparent sm:p-5 sm:before:left-[2rem]">
        {venue.items.map((item, idx) => {
          const id = `${dayKey}-${venue.name}-${idx}`;
          return <ProgramEventCard key={id} item={item} index={idx} expanded={expandedId === id} onToggle={() => setExpandedId((current) => (current === id ? null : id))} />;
        })}
      </div>
    </div>
  );
}

export function ProgramSchedule({ program, pdfUrl }: Props) {
  const [dayIndex, setDayIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('Todas');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
  const [speakerFilter, setSpeakerFilter] = useState('Todos');

  const days = useMemo(() => program.filter((day) => day.day), [program]);
  const currentDay = days[dayIndex];
  const dayMeta = currentDay ? formatDayLabel(currentDay.day) : null;

  const allActivityCount = useMemo(
    () => days.reduce((total, day) => total + (day.venues ?? []).reduce((sum, venue) => sum + venue.items.length, 0), 0),
    [days],
  );

  const venueOptions = useMemo(
    () => ['Todas', ...new Set((currentDay?.venues ?? []).map((venue) => venue.name))],
    [currentDay],
  );

  const specialtyOptions = useMemo(() => {
    const values = new Set<string>();
    for (const venue of currentDay?.venues ?? []) {
      for (const item of venue.items) values.add(classifySpecialty(item.title, item.details));
    }
    return ['Todas', ...Array.from(values).sort((a, b) => a.localeCompare(b, 'es'))];
  }, [currentDay]);

  useEffect(() => {
    const onSpeakerFilter = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      const searchName = stripDoctorPrefix(detail).toLowerCase();
      const matchingDay = days.findIndex((day) =>
        (day.venues ?? []).some((venue) =>
          venue.items.some((item) => `${item.title} ${item.details || ''}`.toLowerCase().includes(searchName)),
        ),
      );
      if (matchingDay >= 0) setDayIndex(matchingDay);
      setSpeakerFilter(detail);
      setSearch('');
      setVenueFilter('Todas');
      setSpecialtyFilter('Todas');
    };
    window.addEventListener('congress:filter-speaker', onSpeakerFilter);
    return () => window.removeEventListener('congress:filter-speaker', onSpeakerFilter);
  }, [days]);

  useEffect(() => {
    setVenueFilter('Todas');
    setSpecialtyFilter('Todas');
    if (speakerFilter !== 'Todos') {
      const speaker = stripDoctorPrefix(speakerFilter).toLowerCase();
      const exists = (currentDay?.venues ?? []).some((venue) =>
        venue.items.some((item) => `${item.title} ${item.details || ''}`.toLowerCase().includes(speaker)),
      );
      if (!exists) setSpeakerFilter('Todos');
    }
  }, [dayIndex]);

  const venues = useMemo(() => {
    if (!currentDay?.venues) return [];
    const query = search.trim().toLowerCase();
    const selectedSpeaker = speakerFilter === 'Todos' ? '' : stripDoctorPrefix(speakerFilter).toLowerCase();

    return currentDay.venues
      .filter((venue) => venueFilter === 'Todas' || venue.name === venueFilter)
      .map((venue) => ({
        ...venue,
        items: venue.items.filter((item) => {
          const blob = `${item.title} ${item.details || ''} ${item.time || ''}`.toLowerCase();
          const matchesQuery = !query || blob.includes(query);
          const matchesSpecialty = specialtyFilter === 'Todas' || classifySpecialty(item.title, item.details) === specialtyFilter;
          const matchesSpeaker = !selectedSpeaker || blob.includes(selectedSpeaker);
          return matchesQuery && matchesSpecialty && matchesSpeaker;
        }),
      }))
      .filter((venue) => venue.items.length > 0);
  }, [currentDay, search, venueFilter, specialtyFilter, speakerFilter]);

  const totalEvents = venues.reduce((total, venue) => total + venue.items.length, 0);
  const hasActiveFilters = Boolean(search) || venueFilter !== 'Todas' || specialtyFilter !== 'Todas' || speakerFilter !== 'Todos';

  const clearFilters = () => {
    setSearch('');
    setVenueFilter('Todas');
    setSpecialtyFilter('Todas');
    setSpeakerFilter('Todos');
  };

  return (
    <section id="programa" className="scroll-mt-24 border-t border-white/10 py-14 sm:py-16">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.065] via-white/[0.025] to-transparent p-5 shadow-2xl shadow-black/10 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Programa académico</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Actualizado
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Cuatro días. {allActivityCount} actividades.</h2>
            <p className="mt-2 text-lg font-medium text-gold">Un programa fácil de consultar.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Elige el día y filtra por sede, subespecialidad o ponente. Abre cada actividad para consultar coordinadores y detalles.
            </p>
          </div>

          {pdfUrl ? (
            <a href={encodeURI(pdfUrl)} download className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-deep shadow-lg shadow-gold/20 transition hover:-translate-y-0.5">
              <span aria-hidden>↓</span> Descargar programa PDF
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Elige un día</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {days.map((day, idx) => {
            const meta = formatDayLabel(day.day);
            const active = idx === dayIndex;
            const dayCount = (day.venues ?? []).reduce((sum, venue) => sum + venue.items.length, 0);
            return (
              <button key={day.day} type="button" role="tab" aria-selected={active} onClick={() => { setDayIndex(idx); setSearch(''); setSpeakerFilter('Todos'); }}
                className={`rounded-2xl border px-4 py-3 text-left transition sm:px-5 ${active ? 'border-gold bg-gold text-deep shadow-lg shadow-gold/20' : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/[0.08]'}`}>
                <span className="block text-sm font-semibold">{meta.short}</span>
                <span className={`mt-0.5 block text-xs ${active ? 'text-deep/65' : 'text-slate-500'}`}>{meta.date || day.day}</span>
                <span className={`mt-2 block text-[10px] font-medium ${active ? 'text-deep/55' : 'text-slate-600'}`}>{dayCount} actividades</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Filtra el programa</p>
            <p className="mt-1 text-sm text-slate-400">Sede, subespecialidad, ponente o palabra clave.</p>
          </div>
          {hasActiveFilters ? (
            <button type="button" onClick={clearFilters} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white">Limpiar filtros</button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sede</span>
            <select value={venueFilter} onChange={(event) => setVenueFilter(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#071a38] px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none">
              {venueOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Subespecialidad</span>
            <select value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#071a38] px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none">
              {specialtyOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ponente</span>
            <select value={speakerFilter} onChange={(event) => setSpeakerFilter(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#071a38] px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none">
              <option>Todos</option>
              {speakerOptions.map((speaker) => <option key={speaker}>{speaker}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Buscar</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tema, sesión, hora…" className="w-full rounded-xl border border-white/10 bg-[#071a38] px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:border-gold/40 focus:outline-none" />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          {dayMeta ? <p className="text-sm font-semibold text-white">{dayMeta.full}</p> : null}
          <p className="text-xs text-slate-500">{totalEvents} {totalEvents === 1 ? 'actividad' : 'actividades'} {hasActiveFilters ? 'coinciden con los filtros' : 'programadas'}</p>
        </div>
        {speakerFilter !== 'Todos' ? <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold">{speakerFilter}</span> : null}
      </div>

      <AnimatePresence mode="wait">
        {currentDay && dayMeta ? (
          <motion.div key={currentDay.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="mt-5">
            {venues.length === 0 ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-12 text-center">
                <p className="font-medium text-white">Sin resultados</p>
                <p className="mt-1 text-sm text-slate-500">Prueba otro día o elimina alguno de los filtros.</p>
                <button type="button" onClick={clearFilters} className="mt-4 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-deep">Ver todo el día</button>
              </div>
            ) : (
              <div className={`grid gap-5 ${venues.length > 1 ? 'xl:grid-cols-2' : 'mx-auto max-w-4xl'}`}>
                {venues.map((venue) => <VenueTimeline key={`${currentDay.day}-${venue.name}`} venue={venue} dayKey={currentDay.day} />)}
              </div>
            )}

            {dayIndex === 0 && !hasActiveFilters ? (
              <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-sm leading-6 text-amber-100/80">
                El programa fuente no indica sede para “Manejo de la Disfunción Sexual del Varón”; la agenda lo mantiene identificado como sede pendiente de confirmación.
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
