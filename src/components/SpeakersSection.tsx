import { motion } from 'framer-motion';
import { CountryFlag } from './CountryFlag';
import { featuredSpeakers, internationalFaculty } from '../data/speakers';

function initials(name: string): string {
  const parts = name.replace(/^(Dr\.|Dra\.)\s*/i, '').split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function CountryBadge({ country, size = 'sm' }: { country: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 font-medium text-gold ${
        size === 'md' ? 'px-3 py-1.5 text-sm tracking-wide' : 'px-2.5 py-1 text-xs tracking-wide'
      }`}
    >
      <CountryFlag country={country} size={size} />
    </span>
  );
}

function FeaturedCard({ speaker, index }: { speaker: (typeof featuredSpeakers)[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.35) }}
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/35"
    >
      <div className="relative overflow-hidden bg-slate-800">
        {speaker.image ? (
          <img
            src={speaker.image}
            alt={`Foto de ${speaker.name}`}
            loading="lazy"
            className="h-48 w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-deep to-slate-800 text-3xl font-semibold text-gold">
            {initials(speaker.name)}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <CountryBadge country={speaker.country} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-semibold text-white">{speaker.name}</h3>
        <p className="text-sm text-slate-300">{speaker.specialty}</p>
        <ul className="mt-auto space-y-1.5 border-t border-white/10 pt-4 text-sm text-slate-400">
          {speaker.sessions.map((session) => (
            <li key={session} className="flex gap-2">
              <span className="text-gold">·</span>
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
      className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-gold/25 hover:bg-slate-950/80"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-deep text-sm font-bold text-gold ring-1 ring-gold/20">
        {initials(speaker.name)}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4 className="font-semibold text-white">{speaker.name}</h4>
          <CountryBadge country={speaker.country} />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">{speaker.role}</p>
        <p className="text-sm leading-relaxed text-slate-400">{speaker.topics.join(' · ')}</p>
      </div>
    </motion.article>
  );
}

export function SpeakersSection() {
  const countriesRepresented = [
    ...new Set([
      ...featuredSpeakers.map((s) => s.country),
      ...internationalFaculty.map((s) => s.country),
    ]),
  ].sort();

  return (
    <section id="ponentes" className="scroll-mt-24 space-y-16 border-t border-white/10 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">Ponentes internacionales</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Expertos que lideran la agenda</h2>
        <p className="max-w-3xl text-slate-300">
          Además del comité venezolano, el programa oficial reúne especialistas de{' '}
          {countriesRepresented.map((c, index) => (
            <span key={c}>
              {index > 0 ? ', ' : null}
              <CountryFlag country={c} size="sm" className="align-middle" />
            </span>
          ))}{' '}
          en simposios, cursos precongreso,
          mesas redondas y conferencias magistrales.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {featuredSpeakers.map((speaker, index) => (
          <FeaturedCard key={speaker.name} speaker={speaker} index={index} />
        ))}
      </div>

      <div id="facultad-internacional" className="scroll-mt-24 space-y-6 border-t border-white/10 pt-14">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Más invitados internacionales</p>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">Facultad del programa científico</h3>
          <p className="max-w-3xl text-slate-400">
            Ponentes y coordinadores adicionales confirmados en el{' '}
            <span className="text-slate-300">Programa Científico 2026</span>, con participación en bloques de
            endourología, HPB, andrología, cirugía robótica, litiasis y piso pélvico.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {internationalFaculty.map((speaker, index) => (
            <FacultyCard key={speaker.name} speaker={speaker} index={index} />
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">
          La lista completa de sesiones, horarios y sedes está en la{' '}
          <a href="#programa" className="font-medium text-gold underline-offset-4 hover:underline">
            agenda interactiva
          </a>{' '}
          y en el PDF oficial.
        </p>
      </div>
    </section>
  );
}
