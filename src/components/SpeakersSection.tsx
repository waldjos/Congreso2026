import { motion } from 'framer-motion';
import { CountryFlag } from './CountryFlag';
import { featuredSpeakers, internationalFaculty, speakerCountries } from '../data/speakers';

function initials(name: string): string {
  const parts = name.replace(/^(Dr\.|Dra\.)\s*/i, '').split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function CountryBadge({ countries }: { countries: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/10 bg-[#071a38]/90 px-2.5 py-1 text-[10px] font-medium text-gold backdrop-blur">
      {countries.map((country, index) => (
        <span key={country} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span className="text-white/25" aria-hidden>·</span> : null}
          <CountryFlag country={country} size="sm" />
        </span>
      ))}
    </span>
  );
}

function FeaturedCard({ speaker, index }: { speaker: (typeof featuredSpeakers)[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.24) }}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/30"
    >
      <div className="relative h-56 overflow-hidden bg-slate-800 sm:h-60">
        {speaker.image ? (
          <img
            src={speaker.image}
            alt={`Foto de ${speaker.name}`}
            loading="lazy"
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-deep to-slate-800 text-4xl font-semibold text-gold">
            {initials(speaker.name)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071a38] via-[#071a38]/55 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <CountryBadge countries={speakerCountries(speaker)} />
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-white sm:text-xl">{speaker.name}</h3>
        <p className="mt-1 text-sm font-medium text-gold/90">{speaker.specialty}</p>
        <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
          {speaker.sessions.map((session) => (
            <li key={session} className="flex gap-2 text-sm leading-5 text-slate-400">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
              <span>{session}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function FacultyCard({ speaker, index }: { speaker: (typeof internationalFaculty)[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.015, 0.2) }}
      className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition hover:border-gold/20 hover:bg-slate-950/50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/15 bg-gold/10 text-xs font-bold text-gold">
        {initials(speaker.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4 className="font-semibold text-white">{speaker.name}</h4>
          <CountryBadge countries={speakerCountries(speaker)} />
        </div>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{speaker.role}</p>
        <p className="mt-2 text-sm leading-5 text-slate-400">{speaker.topics.join(' · ')}</p>
      </div>
    </motion.article>
  );
}

export function SpeakersSection() {
  const countriesRepresented = [
    ...new Set([
      ...featuredSpeakers.flatMap((speaker) => speakerCountries(speaker)),
      ...internationalFaculty.flatMap((speaker) => speakerCountries(speaker)),
    ]),
  ].sort();

  return (
    <section id="ponentes" className="scroll-mt-24 border-t border-white/10 py-14 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Facultad científica</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ponentes e invitados internacionales</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Especialistas confirmados en el programa actualizado de noviembre, con participación en cirugía robótica,
            uro-oncología, andrología, urología funcional, HPB, litiasis y piso pélvico.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
            <p className="text-xl font-semibold text-white">{featuredSpeakers.length}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Destacados</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
            <p className="text-xl font-semibold text-white">{internationalFaculty.length}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Invitados</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
            <p className="text-xl font-semibold text-white">{countriesRepresented.length}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Países</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {featuredSpeakers.map((speaker, index) => (
          <FeaturedCard key={speaker.name} speaker={speaker} index={index} />
        ))}
      </div>

      <div id="facultad-internacional" className="mt-14 scroll-mt-24 border-t border-white/10 pt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Facultad internacional</p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Más especialistas del programa</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Ponentes y coordinadores adicionales incluidos en la programación científica reprogramada.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {internationalFaculty.map((speaker, index) => (
            <FacultyCard key={speaker.name} speaker={speaker} index={index} />
          ))}
        </div>
        <p className="mt-7 text-center text-sm text-slate-500">
          Consulta sesiones, horarios y sedes en la{' '}
          <a href="#programa" className="font-medium text-gold underline-offset-4 hover:underline">agenda interactiva</a>.
        </p>
      </div>
    </section>
  );
}
