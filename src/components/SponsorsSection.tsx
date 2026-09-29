import { motion } from 'framer-motion';
import { LIGHT_LOGO_IDS, sponsors } from '../data/sponsors';

function SponsorLogo({ sponsor }: { sponsor: (typeof sponsors)[0] }) {
  const needsDarkBg = LIGHT_LOGO_IDS.has(sponsor.id);
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-xl p-3 ${needsDarkBg ? 'bg-deep' : 'bg-white'}`}>
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        loading="lazy"
        decoding="async"
        className="max-h-20 w-auto max-w-[88%] object-contain object-center sm:max-h-24"
      />
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section id="patrocinadores" className="scroll-mt-24 border-t border-white/10 py-14 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Patrocinadores y aliados</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Aliados estratégicos del congreso</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Laboratorios, casas comerciales y aliados del sector salud que respaldan el XXXVI Congreso Nacional de Urología.
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-4 sm:p-6">
        <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-15px' }}
              transition={{ duration: 0.22, delay: Math.min(index * 0.012, 0.25) }}
              title={sponsor.name}
              className="group flex min-h-[6.6rem] items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg hover:shadow-black/10 sm:min-h-[7.5rem]"
            >
              <SponsorLogo sponsor={sponsor} />
            </motion.div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        {sponsors.length} aliados comerciales confirmados
      </p>
    </section>
  );
}
