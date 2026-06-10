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
  { id: 'cuevas', name: 'Cuevas', logo: '/sponsors/cuevas.png' },
  { id: 'bnh', name: 'BNH Medical', logo: '/sponsors/bnh.png' },
  { id: 'lasermed', name: 'Lasermed', logo: '/sponsors/lasermed.png' },
  { id: 'angelus', name: 'Angelus Health', logo: '/sponsors/angelus.png' },
  { id: 'clinicalar', name: 'Clinicalar', logo: '/sponsors/clinicalar.png' },
  { id: 'dermaskin', name: 'Dermaskin', logo: '/sponsors/dermaskin.png' },
  { id: 'gurve', name: 'Gurve', logo: '/sponsors/gurve.png' },
  { id: 'agpr', name: 'AGPR', logo: '/sponsors/agp.png' },
  { id: 'urolatam', name: 'Urolatam', logo: '/sponsors/urolatam.png' },
  { id: 'plusandex', name: 'Plusandex', logo: '/sponsors/plusandex.png' },
  { id: 'exxux', name: 'Exxux', logo: '/sponsors/exuss.png' },
  { id: 'nirvalab', name: 'Nirvalab', logo: '/sponsors/nirvalab.png' },
  { id: 'farma', name: 'Farma', logo: '/sponsors/farma.png' },
  { id: 'pharmetique', name: 'Pharmetique', logo: '/sponsors/pharmetique.png' },
  { id: 'valmorca', name: 'Valmorca', logo: '/sponsors/valmorca.png' },
  { id: 'quirutex', name: 'Quirutex', logo: '/sponsors/quirutex.png' },
  { id: 'almed', name: 'Almed', logo: '/sponsors/allmed.png' },
  { id: 'markmed', name: 'MarKmed', logo: '/sponsors/markmed.jpg' },
  { id: 'dolder', name: 'Dolder C.A.', logo: '/sponsors/dollder.png' },
  { id: 'global-care', name: 'Global Care Pharma C.A.', logo: '/sponsors/Globalcare.png' },
  { id: 'las-mercedes', name: 'Las Mercedes', logo: '/sponsors/lasmercedes.png' },
  { id: 'turmero', name: 'Especialidades Médicas Turmero', logo: '/sponsors/turmero.png' },
  { id: 'badam', name: 'Badam', logo: '/sponsors/badan.png' },
  { id: 'imaye', name: 'Imayé', logo: '/sponsors/imaye.png' },
  { id: 'fc-pharma', name: 'FC Pharma Laboratorios', logo: '/sponsors/fc-pharma.png' },
  { id: 'dalmed', name: 'Dalmed', logo: '/sponsors/dalmed.png' },
  { id: 'zoriak', name: 'ZORIAK', logo: '/sponsors/zoriak.png' },
  { id: 'mds', name: 'MDS', logo: '/sponsors/mds.png' },
  { id: 'herbaplant', name: 'Herbaplant', logo: '/sponsors/herbaplant.png' },
  { id: 'aless', name: 'Aless', logo: '/sponsors/aless.png' },
  { id: 'lasante', name: 'Lasante', logo: '/sponsors/lasante.png' },
  { id: 'tiares', name: 'Tiares', logo: '/sponsors/tiares.png' },
];

export function isOfficialSponsorLogo(logo: string): boolean {
  return /\.(png|jpe?g|webp)$/i.test(logo);
}

/** Logos claros que requieren fondo oscuro en tarjeta blanca */
export const LIGHT_LOGO_IDS = new Set(['adium']);
