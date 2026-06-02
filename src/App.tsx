import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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

const program = [
  {
    day: 'Miércoles 08 Julio',
    items: [
      { title: 'Master Internacional HoLEP', location: 'Hospital de Clínicas del Este', price: 'USD 150' },
      { title: 'Taller de Urodinamia', location: 'Hotel Tibisay', price: 'USD 50' },
      { title: 'Instrumentación Quirúrgica', location: 'Hotel Tibisay', price: 'USD 30' },
      { title: 'Masterclass Cáncer de Vejiga', location: 'Hotel Tibisay', price: 'USD 100' },
      { title: 'Disfunción Sexual Masculina', location: 'Hotel Tibisay', price: 'USD 100' },
    ],
  },
  {
    day: 'Jueves 09 Julio',
    timeline: [
      { time: '09:00', label: 'Urología General' },
      { time: '10:30', label: 'Andrología y Estética Genital' },
      { time: '14:00', label: 'Urología Funcional' },
      { time: '16:00', label: 'Piso Pélvico' },
      { time: '19:00', label: 'Acto Inaugural' },
    ],
  },
  {
    day: 'Viernes 10 Julio',
    sections: [
      { title: 'Sala Principal', items: ['Oncología Urológica', 'Cáncer de Próstata', 'Cáncer de Vejiga', 'Cirugía Robótica'] },
      { title: 'Sala Paralela', items: ['Urología Pediátrica'] },
    ],
  },
  {
    day: 'Sábado 11 Julio',
    items: ['HPB y Láser', 'HoLEP', 'ThuLEP', 'TFL', 'Endourología y Litiasis', 'MiniPerc', 'RIRS', 'TFL vs Holmio', 'White Party'],
  },
];

const sponsors = [
  { tier: 'Diamante', name: 'Instituto Médico Avanzado' },
  { tier: 'Oro', name: 'Laboratorios UroCare' },
  { tier: 'Plata', name: 'Equipos Quirúrgicos Plus' },
  { tier: 'Bronce', name: 'Soluciones Médicas 360' },
];

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
  const [fetchedProgram, setFetchedProgram] = useState<any | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    // Cargar program.json generado desde el DOCX si existe
    fetch('/program.json')
      .then((res) => {
        if (!res.ok) throw new Error('No program.json');
        return res.json();
      })
      .then((data) => setFetchedProgram(data))
      .catch(() => setFetchedProgram(null));
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
              <a href="#programa" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Ver Programa
              </a>
              <a href="/Programa-Congreso-2026.pdf" download className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
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
                <div className="overflow-hidden rounded-3xl bg-slate-800 p-6">
                  <img
                    src="/logo-svu.png"
                    alt="Logo de la Sociedad Venezolana de Urología"
                    loading="lazy"
                    className="h-44 w-full object-contain object-center"
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

        <section id="programa" className="space-y-8 border-t border-white/10 py-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Programa Científico</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Agenda interactiva por día</h2>
          </div>
          <div className="space-y-4">
            {(fetchedProgram && fetchedProgram.length ? fetchedProgram : program).map((day: any) => (
              <details key={day.day} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 transition duration-300 hover:border-gold/40">
                <summary className="flex cursor-pointer flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">{day.day}</p>
                    <p className="mt-2 text-xl font-semibold text-white">Revisa el contenido y horarios planeados</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition duration-300 group-open:bg-gold/10">
                    Ver detalles
                  </span>
                </summary>
                  <div className="mt-6 space-y-4">
                  {/* Items genéricos (precongreso, talleres) */}
                  {day.items && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {day.items.map((item: any) => (
                        <div key={typeof item === 'string' ? item : item.title} className="rounded-3xl bg-deep/85 p-5 ring-1 ring-white/10">
                          {typeof item === 'string' ? (
                            <p className="font-semibold text-white">{item}</p>
                          ) : (
                            <>
                              <p className="font-semibold text-white">{item.title}</p>
                              <p className="mt-2 text-sm text-slate-300">{item.location}</p>
                              <p className="mt-1 text-sm text-slate-400">{item.price}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline extraída del DOCX: mostrar hora, título y detalles (enfatizados) */}
                  {day.timeline && (
                    <div className="space-y-3">
                      {day.timeline.map((event: any) => (
                        <div key={event.time + event.title} className="flex flex-col gap-3 rounded-3xl bg-deep/85 p-5 ring-1 ring-white/10 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.25em] text-gold">{event.time}</span>
                            <div>
                              <p className="text-base font-semibold text-white">{event.title}</p>
                              {event.details && (
                                <p className="mt-2 whitespace-pre-line text-sm text-slate-300">{event.details}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.sections && (
                    <div className="space-y-4">
                      {day.sections.map((section: any) => (
                        <div key={section.title} className="rounded-3xl bg-deep/85 p-5 ring-1 ring-white/10">
                          <p className="font-semibold text-white">{section.title}</p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {section.items.map((topic: any) => (
                              <span key={topic} className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300">{topic}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
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
