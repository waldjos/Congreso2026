import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { CountryFlag } from './CountryFlag';
import {
  type ProgramDay,
  type ProgramItem,
  type ProgramVenue,
  classifyEvent,
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
  const styles = kindStyles[kind] ?? kindStyles.talk;
  const details = parseDetailLines(item.details);
  const hasDetails = details.length > 0;
  const isSection = kind === 'section';

  if (isSection) {
    return (
      <div className="relative pl-7 sm:pl-9">
        <div className={`absolute left-2.5 top-4 h-2.5 w-2.5 rounded-full sm:left-3.5 ${styles.dot}`} />
        <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${styles.card}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{styles.label}</p>
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
              {item.country ? <CountryFlag country={item.country} size="sm" showName={false} className="shrink-0" /> : null}
              {item.price ? <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold text-gold">{item.price}</span> : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-[15px] font-semibold leading-6 text-white sm:text-base">{title}</h4>
              {item.logo ? (
                <img
                  src={item.logo}
                  alt="Logo del simposio"
                  className="h-9 w-auto rounded-xl border border-white/10 bg-slate-950/80 p-1.5 object-contain"
                  loading="lazy"
                />
              ) : null}
            </div>

            <AnimatePresence initial={false}>
              {expanded && hasDetails ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
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

            {hasDetails && !expanded ? (
              <p className="mt-2 text-xs text-slate-500">Ver coordinadores, ponentes y detalles</p>
            ) : null}
          </div>

          {hasDetails ? (
            <span className={`shrink-0 self-end text-sm text-gold transition sm:self-start ${expanded ? 'rotate-180' : ''}`} aria-hidden>
              ▾
            </span>
          ) : null}
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
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          {venue.items.length} actividades
        </span>
      </div>

      <div className="relative space-y-3 p-4 before:absolute before:bottom-6 before:left-[1.6rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-gold/45 before:via-white/10 before:to-transparent sm:p-5 sm:before:left-[2rem]">
        {venue.items.map((item, idx) => {
          const id = `${dayKey}-${venue.name}-${idx}`;
          return (
            <ProgramEventCard
              key={id}
              item={item}
              index={idx}
              expanded={expandedId === id}
              onToggle={() => setExpandedId((current) => (current === id ? null : id))}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ProgramSchedule({ program, pdfUrl }: Props) {
  const [dayIndex, setDayIndex] = useState(0);
  const [search, setSearch] = useState('');

  const days = useMemo(() => program.filter((day) => day.day), [program]);
  const currentDay = days[dayIndex];
  const dayMeta = currentDay ? formatDayLabel(currentDay.day) : null;

  const venues = useMemo(() => {
    if (!currentDay?.venues) return [];
    const query = search.trim().toLowerCase();
    return currentDay.venues
      .map((venue) => ({
        ...venue,
        items: venue.items.filter((item) => {
          if (!query) return true;
          const blob = `${item.title} ${item.details || ''} ${item.time || ''}`.toLowerCase();
          return blob.includes(query);
        }),
      }))
      .filter((venue) => venue.items.length > 0);
  }, [currentDay, search]);

  const totalEvents = venues.reduce((total, venue) => total + venue.items.length, 0);
  const venueCount = currentDay?.venues?.length ?? 0;

  return (
    <section id="programa" className="scroll-mt-24 border-t border-white/10 py-14 sm:py-16">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Programa científico actualizado
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">4–7 de noviembre de 2026</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Consulta la agenda por día y sede. Puedes buscar por sesión, tema, ponente u horario.
            </p>
          </div>

          {pdfUrl ? (
            <a
              href={encodeURI(pdfUrl)}
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-deep shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
            >
              <span aria-hidden>↓</span>
              Descargar programa PDF
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Días</p>
            <p className="mt-1 text-lg font-semibold text-white">{days.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Sedes del día</p>
            <p className="mt-1 text-lg font-semibold text-white">{venueCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Actividades</p>
            <p className="mt-1 text-lg font-semibold text-white">{totalEvents}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {days.map((day, idx) => {
          const meta = formatDayLabel(day.day);
          const active = idx === dayIndex;
          return (
            <button
              key={day.day}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setDayIndex(idx);
                setSearch('');
              }}
              className={`rounded-2xl border px-4 py-3 text-left transition sm:px-5 ${active
                ? 'border-gold bg-gold text-deep shadow-lg shadow-gold/20'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              <span className="block text-sm font-semibold">{meta.short}</span>
              <span className={`mt-0.5 block text-xs ${active ? 'text-deep/65' : 'text-slate-500'}`}>{meta.date || day.day}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {dayMeta ? <p className="text-sm font-medium text-white">{dayMeta.full}</p> : null}
          <p className="text-xs text-slate-500">{totalEvents} {totalEvents === 1 ? 'actividad' : 'actividades'} {search ? 'encontradas' : 'programadas'}</p>
        </div>
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Buscar en el programa</span>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar ponente, sesión u horario…"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-9 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/15"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          ) : null}
        </label>
      </div>

      <AnimatePresence mode="wait">
        {currentDay && dayMeta ? (
          <motion.div
            key={currentDay.day}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {venues.length === 0 ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-12 text-center">
                <p className="font-medium text-white">Sin resultados</p>
                <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre, tema u horario.</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${venues.length > 1 ? 'xl:grid-cols-2' : 'mx-auto max-w-4xl'}`}>
                {venues.map((venue) => (
                  <VenueTimeline key={`${currentDay.day}-${venue.name}`} venue={venue} dayKey={currentDay.day} />
                ))}
              </div>
            )}

            {dayIndex === 0 && !search ? (
              <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-sm leading-6 text-amber-100/80">
                El documento actualizado no indica sede para el curso “Manejo de la Disfunción Sexual del Varón”; por eso la agenda lo identifica como sede pendiente de confirmación.
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap justify-center gap-2 text-[10px] text-slate-500">
        {Object.entries(kindStyles).map(([key, style]) => (
          <span key={key} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        ))}
      </div>
    </section>
  );
}
