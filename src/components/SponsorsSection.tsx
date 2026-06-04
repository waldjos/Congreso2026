import { motion } from 'framer-motion';
import { sponsors } from '../data/sponsors';

const REAL_LOGO_IDS = new Set([
  'adium',
  'calox',
  'eurofarma',
  'leti',
  'lasermed',
  'clinicalar',
  'dermaskin',
  'gurve',
  'urolatam',
  'nirvalab',
  'valmorca',
  'quirutex',
  'herbaplant',
  'lasante',
  'tiares',
]);

const LIGHT_LOGO_IDS = new Set(['adium']);

function SponsorLogo({ sponsor }: { sponsor: (typeof sponsors)[0] }) {
  const isRealLogo = REAL_LOGO_IDS.has(sponsor.id);
  const needsDarkBg = LIGHT_LOGO_IDS.has(sponsor.id);

  const image = (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      loading="lazy"
      decoding="async"
      className={
        isRealLogo
          ? 'max-h-14 w-full max-w-[9.5rem] object-contain object-center'
          : 'h-full w-full object-contain'
      }
    />
  );

  if (needsDarkBg) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-deep px-4 py-3">
        {image}
      </div>
    );
  }

  return image;
}

export function SponsorsSection() {
  return (
    <section id="patrocinadores" className="scroll-mt-24 space-y-10 border-t border-white/10 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">Patrocinadores</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Aliados estratégicos del congreso</h2>
        <p className="max-w-3xl text-slate-300">
          Laboratorios, casas comerciales y aliados del sector salud que respaldan el XXXVI Congreso Venezolano de
          Urología y hacen posible esta experiencia científica.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
              title={sponsor.name}
              className="group flex aspect-[5/3] items-center justify-center rounded-2xl border border-white/10 bg-white p-4 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold/10"
            >
              <SponsorLogo sponsor={sponsor} />
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        {sponsors.length} aliados comerciales · Gracias por su confianza y respaldo al congreso
      </p>
    </section>
  );
}
