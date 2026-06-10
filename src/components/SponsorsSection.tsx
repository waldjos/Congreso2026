import { motion } from 'framer-motion';
import { isOfficialSponsorLogo, LIGHT_LOGO_IDS, sponsors } from '../data/sponsors';

function SponsorLogo({ sponsor }: { sponsor: (typeof sponsors)[0] }) {
  const official = isOfficialSponsorLogo(sponsor.logo);
  const needsDarkBg = LIGHT_LOGO_IDS.has(sponsor.id);

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-xl px-3 py-2.5 ${
        needsDarkBg ? 'bg-deep' : ''
      }`}
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        loading="lazy"
        decoding="async"
        className="h-16 w-auto max-w-full object-contain object-center"
      />
    </div>
  );
}

export function SponsorsSection() {
  const officialCount = sponsors.filter((s) => isOfficialSponsorLogo(s.logo)).length;

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

        <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
              title={sponsor.name}
              className="group flex h-full min-h-[7rem] items-center justify-center rounded-2xl border border-white/10 bg-white p-3 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold/10 sm:p-4"
            >
              <SponsorLogo sponsor={sponsor} />
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        {sponsors.length} aliados comerciales · {officialCount} con logo oficial · Gracias por su confianza y respaldo
        al congreso
      </p>
    </section>
  );
}
