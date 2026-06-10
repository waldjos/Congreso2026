export type Sponsor = {
  id: string;
  name: string;
  logo: string;
};

/** Patrocinadores oficiales — logos en /public/sponsors */
export const sponsors: Sponsor[] = [
  { id: 'adium', name: 'Adium', logo: '/sponsors/adium.png' },
  { id: 'calox', name: 'Calox International', logo: '/sponsors/calox.png' },
  { id: 'eurofarma', name: 'Eurofarma', logo: '/sponsors/eurofarma.png' },
  { id: 'leti', name: 'Leti', logo: '/sponsors/leti.png' },
  { id: 'urogastrol', name: 'Urogastrol', logo: '/sponsors/urogastrol.png' },
  { id: 'cuevas', name: 'Cuevas', logo: '/sponsors/cuevas.svg' },
  { id: 'bnh', name: 'BNH Medical', logo: '/sponsors/bnh.png' },
  { id: 'lasermed', name: 'Lasermed', logo: '/sponsors/lasermed.png' },
  { id: 'angelus', name: 'Angelus Health', logo: '/sponsors/angelus.png' },
  { id: 'clinicalar', name: 'Clinicalar', logo: '/sponsors/clinicalar.png' },
  { id: 'dermaskin', name: 'Dermaskin', logo: '/sponsors/dermaskin.png' },
  { id: 'cdd', name: 'CDD', logo: '/sponsors/cdd.svg' },
  { id: 'hospitalar', name: 'Hospitalar', logo: '/sponsors/hospitalar.svg' },
  { id: 'evrp', name: 'EVRP', logo: '/sponsors/evrp.svg' },
  { id: 'meditec', name: 'Meditec', logo: '/sponsors/meditec.svg' },
  { id: 'seguros', name: 'Seguros', logo: '/sponsors/seguros.svg' },
  { id: 'gurve', name: 'Gurve', logo: '/sponsors/gurve.png' },
  { id: 'agpr', name: 'AGPR', logo: '/sponsors/agpr.svg' },
  { id: 'baptista-hospital', name: 'Baptista Hospital', logo: '/sponsors/baptista-hospital.svg' },
  { id: 'profimedical', name: 'Profimedical', logo: '/sponsors/profimedical.svg' },
  { id: 'omnimedical', name: 'Omnimedical', logo: '/sponsors/omnimedical.svg' },
  { id: 'urolatam', name: 'Urolatam', logo: '/sponsors/urolatam.jpg' },
  { id: 'marmarket', name: 'Marmarket', logo: '/sponsors/marmarket.svg' },
  { id: 'plusandex', name: 'Plusandex', logo: '/sponsors/plusandex.png' },
  { id: 'endo-master', name: 'Endo Master', logo: '/sponsors/endo-master.svg' },
  { id: 'exxux', name: 'Exxux', logo: '/sponsors/exxux.svg' },
  { id: 'nirvalab', name: 'Nirvalab', logo: '/sponsors/nirvalab.png' },
  { id: 'farma', name: 'Farma', logo: '/sponsors/farma.svg' },
  { id: 'valmorca', name: 'Valmorca', logo: '/sponsors/valmorca.png' },
  { id: 'quirutex', name: 'Quirutex', logo: '/sponsors/quirutex.png' },
  { id: 'almed', name: 'Almed', logo: '/sponsors/allmed.png' },
  { id: 'markmed', name: 'MarKmed', logo: '/sponsors/markmed.jpg' },
  { id: 'badam', name: 'Badam', logo: '/sponsors/badam.svg' },
  { id: 'imaye', name: 'Imayé', logo: '/sponsors/imaye.svg' },
  { id: 'fc-pharma', name: 'FC Pharma Laboratorios', logo: '/sponsors/fc-pharma.png' },
  { id: 'hygea', name: 'Hygea', logo: '/sponsors/hygea.svg' },
  { id: 'dalmed', name: 'Dalmed', logo: '/sponsors/dalmed.svg' },
  { id: 'zoriak', name: 'ZORIAK', logo: '/sponsors/zoriak.png' },
  { id: 'mds', name: 'MDS', logo: '/sponsors/mds.svg' },
  { id: 'dinamet', name: 'Dinamet', logo: '/sponsors/dinamet.svg' },
  { id: 'herbaplant', name: 'Herbaplant', logo: '/sponsors/herbaplant.png' },
  { id: 'aless', name: 'Aless', logo: '/sponsors/aless.svg' },
  { id: 'lasante', name: 'Lasante', logo: '/sponsors/lasante.png' },
  { id: 'tiares', name: 'Tiares', logo: '/sponsors/tiares.png' },
];

export function isOfficialSponsorLogo(logo: string): boolean {
  return /\.(png|jpe?g|webp)$/i.test(logo);
}

/** Logos claros que requieren fondo oscuro en tarjeta blanca */
export const LIGHT_LOGO_IDS = new Set(['adium']);
