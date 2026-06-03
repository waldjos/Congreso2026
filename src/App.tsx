import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProgramSchedule } from './components/ProgramSchedule';
import type { ProgramDay } from './lib/programUtils';

const speakers = [
  {
    name: 'Dr. René Sotelo',
    country: 'USA',
    specialty: 'Cirugía Robótica',
    sessions: ['Taller Robótico', 'Panel Oncológico'],
    image: 'https://doctorsotelo.com/profile/dr-rene-sotelo.jpg',
  },
  {
    name: 'Dr. Joan Palou',
    country: 'España',
    specialty: 'Oncología Urológica',
    sessions: ['Prostatectomía de Vanguardia'],
    image: 'https://static.emedevents.com/uploads/speakers/200/79282bf1f8c7a312e8d6b838b607e4cc.png',
  },
  {
    name: 'Dr. Gabriele Antonini',
    country: 'Italia',
    specialty: 'Andrología',
    sessions: ['Estética Genital y Función Sexual'],
    image: 'https://www.duam.it/assets/img/avatar/gabriele-antonini-urologo-andrologo.jpg',
  },
  {
    name: 'Dr. Carlos Errando',
    country: 'España',
    specialty: 'Urología Funcional',
    sessions: ['Innovación en Piso Pélvico'],
    image: 'https://objects-es.cdn-topdoctors.com/provider/1084885/image/profile/medium/prof_10221_20210719162910.png?width=648&format=png',
  },
  {
    name: 'Dr. Gustavo Villoldo',
    country: 'Argentina',
    specialty: 'Uro-Oncología',
    sessions: ['Cáncer de Vejiga'],
    image: 'https://alexanderfleming.org/wp-content/uploads/2020/11/VILLOLDO-FOTO.jpeg',
  },
  {
    name: 'Dr. Edwin Reyes',
    country: 'Colombia',
    specialty: 'Endourología',
    sessions: ['Litiasis y Tecnología Láser'],
    image: 'https://web-auna-backend-prd-images.s3.amazonaws.com/07618347_mobile_27c67ecffd.png',
  },
  {
    name: 'Dr. Julián Azuero',
    country: 'Colombia',
    specialty: 'Urología Funcional',
    sessions: ['Avances en Disfunción Urinaria'],
    image: 'https://www.ama.com.co/wp-content/uploads/2022/02/julian-6-Julian-Azuero-768x1024.jpeg',
  },
];

const sponsors = [
  { tier: 'Diamante', name: 'Instituto Médico Avanzado' },
  { tier: 'Oro', name: 'Laboratorios UroCare' },
  { tier: 'Plata', name: 'Equipos Quirúrgicos Plus' },
  { tier: 'Bronce', name: 'Soluciones Médicas 360' },
];

const countryFlags: Record<string, string> = {
  USA: '🇺🇸',
  España: '🇪🇸',
  Italia: '🇮🇹',
  Argentina: '🇦🇷',
  Colombia: '🇨🇴',
};

const getCountryLabel = (country: string) => {
  const flag = countryFlags[country] || '';
  return flag ? `${flag} ${country}` : country;
};

const locations = [
  {
    name: 'Hotel Tibisay',
    description: 'Sede de acreditación, cursos y eventos sociales.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Tibisay,+Margarita+Venezuela',
  },
  {
    name: 'Hospital de Clínicas del Este',
    description: 'Sede principal para sesiones científicas y talleres prácticos.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hospital+de+Cl%C3%ADnicas+del+Este,+Margarita+Venezuela',
  },
];

const PROGRAM_PDF = '/PROGRAMA CIENTIFICO 2026. UROLOGIA.pdf';

const eventDate = new Date('2026-07-08T09:00:00');

const formatValue = (value: number) => String(value).padStart(2, '0');

const getCountdown = () => {
  const diff = eventDate.getTime() - Date.now();
  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  return {
    days: formatValue(days),
    hours: formatValue(hours),
    minutes: formatValue(minutes),
    seconds: formatValue(seconds),
  };
};

function App() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [menuOpen, setMenuOpen] = useState(false);
  const [program, setProgram] = useState<ProgramDay[] | null>(null);
  const [programLoading, setProgramLoading] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/program.json')
      .then((res) => {
        if (!res.ok) throw new Error('No program.json');
        return res.json();
      })
      .then((data: ProgramDay[]) => setProgram(data))
      .catch(() => setProgram([]))
      .finally(() => setProgramLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-deep text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-deep/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <a href="#" className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-sm font-bold text-deep">SVU</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em]">SVU 2026</p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300">Congreso Internacional</p>
            </div>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#bienvenida" className="text-sm font-medium text-slate-200 transition hover:text-white">Bienvenida</a>
<a href="#ponentes" className="text-sm font-medium text-slate-200 transition hover:text-white">Ponentes</a>
            <a href="#programa" className="text-sm font-medium text-slate-200 transition hover:text-white">Programa</a>
            <a href="#evento-social" className="text-sm font-medium text-slate-200 transition hover:text-white">White Party</a>
            <a href="#inscripciones" className="text-sm font-medium text-slate-200 transition hover:text-white">Inscripciones</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#inscripciones" className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-deep transition hover:-translate-y-0.5 md:inline-flex">
              Inscríbete
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-white md:hidden"
              aria-label="Abrir menú"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-deep/95 px-6 py-4">
            <div className="flex flex-col gap-3">
              <a href="#bienvenida" onClick={() => setMenuOpen(false)} className="rounded-3xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
                Bienvenida
              </a>
              <a href="#ponentes" onClick={() => setMenuOpen(false)} className="rounded-3xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
                Ponentes
              </a>
<a href="#programa" onClick={() => setMenuOpen(false)} className="rounded-3xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
                Programa
              </a>
              <a href="#evento-social" onClick={() => setMenuOpen(false)} className="rounded-3xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
                White Party
              </a>
              <a href="#inscripciones" onClick={() => setMenuOpen(false)} className="rounded-3xl bg-gold px-4 py-3 text-sm font-semibold text-deep transition hover:-translate-y-0.5">
                Inscríbete
              </a>
            </div>
          </div>
        )}
      </nav>

      <header className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,163,78,0.18),_transparent_25%)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092337525-3abfbb8b13a1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="inline-flex rounded-full border border-gold bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.35em] text-gold">
              XXXVI Congreso Venezolano de Urología
            </p>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Integrando innovación, ciencia y excelencia quirúrgica
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl">
              8 al 11 de julio de 2026 · Hospital de Clínicas del Este · Hotel Tibisay
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#inscripciones" className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase text-deep shadow-lg shadow-gold/20 transition hover:-translate-y-0.5">
                Inscríbete
              </a>
              <a href="#programa" className="inline-flex items-center justify-center rounded-full bg-gold/90 px-8 py-3 text-sm font-semibold uppercase text-deep shadow-lg shadow-gold/25 transition hover:scale-105">
                Ver Programa
              </a>
              <a href={encodeURI(PROGRAM_PDF)} download className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Descargar PDF
              </a>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Días', value: countdown.days },
                { label: 'Horas', value: countdown.hours },
                { label: 'Minutos', value: countdown.minutes },
                { label: 'Segundos', value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/5 px-5 py-4 text-center ring-1 ring-white/10 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <section id="bienvenida" className="space-y-8 pb-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-gold">Bienvenida</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Mensaje del Presidente</h2>
              <p className="mt-6 text-lg leading-8 text-slate-200">
                Bienvenidos al XXXVI Congreso Venezolano de Urología, un espacio diseñado para la actualización científica, el intercambio académico y el fortalecimiento de nuestra especialidad en Venezuela y Latinoamérica.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:max-w-md">
              <div className="space-y-4">
                <div className="flex items-center justify-center overflow-hidden rounded-3xl bg-slate-800 p-6">
                  <img
                    src="/logo-svu.png"
                    alt="Logo de la Sociedad Venezolana de Urología"
                    loading="lazy"
                    className="mx-auto h-44 w-auto max-w-full object-contain object-center sm:h-56"
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">Dr. Nelson Medero Parrilla</p>
                  <p className="text-sm text-slate-400">Presidente del XXXVI Congreso Venezolano de Urología</p>
                </div>
                <p className="text-slate-300">
                  Conocido como Eponimo, el Dr. Nelson Medero Parrilla encabeza este congreso con una visión renovada para la urología venezolana.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ponentes" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Ponentes Internacionales</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Expertos que lideran la agenda</h2>
            <p className="max-w-2xl text-slate-300">
              Descubre a los oradores principales del congreso: especialistas en cirugía robótica, oncología urológica, andrología y urología funcional.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <article key={speaker.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                <div className="overflow-hidden rounded-3xl bg-slate-800">
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={`Foto de ${speaker.name}`}
                      loading="lazy"
                      className="h-44 w-full object-cover object-center transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="h-44" />
                  )}
                </div>
                <div className="mt-5 space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-gold">{speaker.country}</p>
                  <h3 className="text-xl font-semibold text-white">{speaker.name}</h3>
                  <p className="text-sm text-slate-300">{speaker.specialty}</p>
                  <ul className="space-y-1 text-sm text-slate-400">
                    {speaker.sessions.map((session) => (
                      <li key={session}>• {session}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {programLoading ? (
          <section id="programa" className="scroll-mt-24 border-t border-white/10 py-16">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 rounded-xl bg-white/10" />
              <div className="h-4 w-96 max-w-full rounded-lg bg-white/5" />
              <div className="mt-8 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 w-28 rounded-2xl bg-white/10" />
                ))}
              </div>
              <div className="mt-6 h-96 rounded-[1.75rem] bg-white/5" />
            </div>
          </section>
        ) : program && program.length > 0 ? (
          <ProgramSchedule program={program} pdfUrl={PROGRAM_PDF} />
        ) : (
          <section id="programa" className="scroll-mt-24 border-t border-white/10 py-16 text-center text-slate-400">
            <p>No se pudo cargar el programa. Descarga el PDF oficial desde el inicio.</p>
            <a href={encodeURI(PROGRAM_PDF)} download className="mt-4 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep">
              Descargar PDF
            </a>
          </section>
        )}

<section id="evento-social" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Evento Social</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">White Party - Fiesta de Clausura</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/10">
              <div className="overflow-hidden rounded-t-[2rem]">
                <img
                  src="/fiesta.png.png"
                  alt="White Party - Fiesta de Clausura del XXXVI Congreso Venezolano de Urología"
                  className="h-auto w-full object-contain transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-gold">Sábado 11 de Julio · 8:00 PM</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">White Party Downtown Beach</h3>
                <p className="mt-4 text-slate-300">
                  Cierra el congreso con una noche unforgettable en nuestra fiesta de clausura. 
                  Vive la elegancia en blanco mientras celebramos los logros de la urología venezolana 
                  en un ambiente exclusivo con música, cócteles y networking entre colegas.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href="#inscripciones"
                    className="inline-flex items-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep shadow-lg shadow-gold/20 transition hover:-translate-y-0.5"
                  >
                    Reserve su Lugar
                  </a>
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    Dress Code: White
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Horario</p>
                    <p className="text-sm text-slate-400">8:00 PM - 2:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Ubicación</p>
                    <p className="text-sm text-slate-400">Downtown Beach, Margarita</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Dress Code</p>
                    <p className="text-sm text-slate-400">Vestido Blanco Obligatorio</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Incluye</p>
                    <p className="text-sm text-slate-400">Cócteles, Cena y Noche de Baile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="patrocinadores" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Patrocinadores</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Aliados estratégicos del congreso</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                <p className="text-sm uppercase tracking-[0.35em] text-gold">{sponsor.tier}</p>
                <p className="mt-4 text-xl font-semibold text-white">{sponsor.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="sedes" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Sedes</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ubicaciones del evento</h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {locations.map((location) => (
              <div key={location.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                <h3 className="text-2xl font-semibold text-white">{location.name}</h3>
                <p className="mt-4 text-slate-300">{location.description}</p>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cómo llegar
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="inscripciones" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Inscripciones</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Planes y acceso</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {['Médicos Especialistas', 'Residentes', 'Estudiantes', 'Cursos Precongreso'].map((plan) => (
              <div key={plan} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                <p className="text-lg font-semibold text-white">{plan}</p>
                <p className="mt-4 text-slate-300">Tarifas y acceso especial según categoría.</p>
                <div className="mt-6">
                  <a
                    href="https://www.soveuroapp.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:-translate-y-0.5"
                  >
                    Pagar Ahora
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contacto" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Contacto</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Estamos listos para ayudarte</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
              <p className="text-sm uppercase tracking-[0.35em] text-gold">Página Web</p>
              <p className="mt-4 text-lg font-semibold text-white">https://www.soveuroapp.com/</p>
              <a href="https://www.soveuroapp.com/" target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:-translate-y-0.5">
                Visitar app
              </a>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
              <p className="text-sm uppercase tracking-[0.35em] text-gold">WhatsApp</p>
              <p className="mt-4 text-lg font-semibold text-white">0412 706 5848</p>
              <a href="https://wa.me/584127065848" target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:-translate-y-0.5">
                Contactar por WhatsApp
              </a>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-gold/40">
              <p className="text-sm uppercase tracking-[0.35em] text-gold">Instagram</p>
              <p className="mt-4 text-lg font-semibold text-white">@sovzlauro</p>
              <a href="https://www.instagram.com/sovzlauro" target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:-translate-y-0.5">
                Ver Instagram
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
