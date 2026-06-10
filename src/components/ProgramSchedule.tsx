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
  pdfUrl: string;
};

function VenueIcon({ icon }: { icon: 'hospital' | 'hotel' | 'beach' | 'hall' }) {
  const paths = {
    hospital: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 20V8l4-3 4 3v12M6 20h12M10 14h1v4h-1v-4zm4 0h1v4h-1v-4z"
      />
    ),
    hotel: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 20V9l8-5 8 5v11M8 20v-6h8v6"
      />
    ),
    beach: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 18c2-4 4-6 8-6s6 2 8 6M6 14l2-2m4 2l2-2m4 2l2-2"
      />
    ),
    hall: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M5 8h14v10H5zM9 8V5h6v3"
      />
    ),
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
      <div className="relative pl-8 sm:pl-10">
        <div className={`absolute left-3 top-3 h-3 w-3 rounded-full sm:left-4 ${styles.dot}`} />
        <div className={`rounded-2xl border px-5 py-4 ${styles.card}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{styles.label}</p>
          <h4 className="mt-1 text-lg font-semibold text-white">{title}</h4>
          {hasDetails && (
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{details.join(' · ')}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.4) }}
      className="group relative pl-8 sm:pl-10"
    >
      <div
        className={`absolute left-3 top-5 z-10 h-3 w-3 rounded-full ring-4 ring-deep transition group-hover:scale-110 sm:left-4 ${styles.dot}`}
      />
      <div
        className={`rounded-2xl border p-4 transition duration-300 sm:p-5 ${styles.card} ${
          hasDetails ? 'cursor-pointer' : ''
        }`}
        onClick={hasDetails ? onToggle : undefined}
        onKeyDown={
          hasDetails
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle();
                }
              }
            : undefined
        }
        role={hasDetails ? 'button' : undefined}
        tabIndex={hasDetails ? 0 : undefined}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          {item.time && (
            <time className="shrink-0 rounded-xl bg-deep/80 px-3 py-2 text-center text-xs font-medium leading-snug text-gold ring-1 ring-gold/20 sm:min-w-[7.5rem] sm:text-sm">
              {item.time}
            </time>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles.badge}`}>
                {styles.label}
              </span>
              {item.country && (
                <CountryFlag country={item.country} size="sm" showName={false} className="shrink-0" />
              )}
              {item.price && (
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                  {item.price}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-base font-semibold leading-snug text-white sm:text-[1.05rem]">{title}</h4>
              {item.logo ? (
                <img
                  src={item.logo}
                  alt="Logo del simposio"
                  className="h-10 w-auto rounded-2xl border border-white/10 bg-slate-950/80 p-2 object-contain"
                  loading="lazy"
                />
              ) : null}
            </div>
            <AnimatePresence initial={false}>
              {(expanded || !hasDetails) && hasDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-1 space-y-1.5 border-t border-white/10 pt-3">
                    {details.map((line) => (
                      <li key={line} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            {hasDetails && !expanded && (
              <p className="text-xs text-slate-500">Toca para ver coordinadores y ponentes</p>
            )}
          </div>
          {hasDetails && (
            <span
              className={`hidden shrink-0 text-gold transition sm:inline ${expanded ? 'rotate-180' : ''}`}
              aria-hidden
            >
              ▾
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function VenueTimeline({ venue, dayKey }: { venue: ProgramVenue; dayKey: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const meta = venueLabel(venue.name);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <VenueIcon icon={meta.icon} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Sede</p>
          <h3 className="text-lg font-semibold text-white">{meta.label}</h3>
          <p className="text-sm text-slate-400">{venue.items.length} actividades</p>
        </div>
      </div>
      <div className="relative space-y-4 before:absolute before:bottom-2 before:left-[1.35rem] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/50 before:via-white/15 before:to-transparent sm:before:left-[1.6rem]">
        {venue.items.map((item, idx) => {
          const id = `${dayKey}-${venue.name}-${idx}`;
          return (
            <ProgramEventCard
              key={id}
              item={item}
              index={idx}
              expanded={expandedId === id}
              onToggle={() => setExpandedId((cur) => (cur === id ? null : id))}
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

  const days = useMemo(() => program.filter((d) => d.day), [program]);
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
      .filter((v) => v.items.length > 0);
  }, [currentDay, search]);

  const totalEvents = venues.reduce((n, v) => n + v.items.length, 0);

  return (
    <section id="programa" className="scroll-mt-24 border-t border-white/10 py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Programa Científico</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Cronograma oficial 2026</h2>
          <p className="text-slate-300">
            Agenda alineada con el documento oficial del congreso. Navega por día, filtra actividades y consulta horarios y sedes.
          </p>
        </div>
        <a
          href={encodeURI(pdfUrl)}
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-deep shadow-lg shadow-gold/25 transition hover:-translate-y-0.5"
        >
          <span aria-hidden>↓</span>
          Descargar PDF oficial
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Días del congreso"
        >
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
                className={`shrink-0 rounded-2xl px-5 py-3 text-left transition ${
                  active
                    ? 'bg-gold text-deep shadow-lg shadow-gold/30'
                    : 'bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="block text-sm font-semibold">{meta.short}</span>
                <span className={`block text-xs ${active ? 'text-deep/70' : 'text-slate-400'}`}>
                  {meta.date || day.day}
                </span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Buscar en el programa</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sesión, ponente..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 pl-4 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </label>
      </div>

      <AnimatePresence mode="wait">
        {currentDay && dayMeta && (
          <motion.div
            key={currentDay.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Día seleccionado</p>
                <p className="text-xl font-semibold text-white">{dayMeta.full}</p>
              </div>
              <p className="text-sm text-slate-300">
                {totalEvents} {totalEvents === 1 ? 'actividad' : 'actividades'}
                {search ? ' encontradas' : ' programadas'}
              </p>
            </div>

            {venues.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                No hay resultados para &ldquo;{search}&rdquo;. Prueba otro término.
              </p>
            ) : (
              <div
                className={`grid gap-6 ${
                  venues.length > 1 ? 'xl:grid-cols-2' : 'max-w-3xl mx-auto w-full'
                }`}
              >
                {venues.map((venue) => (
                  <VenueTimeline key={`${currentDay.day}-${venue.name}`} venue={venue} dayKey={currentDay.day} />
                ))}
              </div>
            )}

            {dayIndex === 0 && !search && (
              <p className="mt-6 text-center text-sm text-slate-400">
                Miércoles 8 julio: cursos y talleres precongreso en Hospital de Clínicas del Este, Hotel Tibisay y Hotel Margarita Real.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
        {Object.entries(kindStyles).map(([key, style]) => (
          <span key={key} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        ))}
      </div>
    </section>
  );
}
