export type FeaturedSpeaker = {
  name: string;
  country: string;
  countries?: string[];
  specialty: string;
  sessions: string[];
  image?: string;
};

export function speakerCountries(speaker: { country: string; countries?: string[] }): string[] {
  return speaker.countries ?? [speaker.country];
}

export type FacultySpeaker = {
  name: string;
  country: string;
  countries?: string[];
  role: string;
  topics: string[];
};

/** Ponentes internacionales destacados presentes en el programa reprogramado de noviembre 2026. */
export const featuredSpeakers: FeaturedSpeaker[] = [
  {
    name: 'Dr. René Sotelo',
    country: 'Venezuela',
    countries: ['Venezuela', 'Estados Unidos'],
    specialty: 'Cirugía robótica y uro-oncología',
    sessions: ['Cirugía robótica postradioterapia y cirugía de rescate', 'Cáncer de próstata de alto riesgo'],
    image: 'https://doctorsotelo.com/profile/dr-rene-sotelo.jpg',
  },
  {
    name: 'Dr. Gabriele Antonini',
    country: 'Italia',
    specialty: 'Andrología',
    sessions: ['Enfermedad de Peyronie', 'Implantes peneanos', 'Disfunción sexual masculina'],
    image: 'https://www.duam.it/assets/img/avatar/gabriele-antonini-urologo-andrologo.jpg',
  },
  {
    name: 'Dr. Carlos Errando',
    country: 'España',
    specialty: 'Urología funcional',
    sessions: ['Incontinencia post-prostatectomía', 'Vejiga hiperactiva', 'Simposio de Urología Funcional'],
    image: 'https://objects-es.cdn-topdoctors.com/provider/1084885/image/profile/medium/prof_10221_20210719162910.png?width=648&format=png',
  },
  {
    name: 'Dr. Gustavo Villoldo',
    country: 'Argentina',
    specialty: 'Uro-oncología',
    sessions: ['Neoadyuvancia en cáncer de próstata (PROTEUS)', 'Cáncer de vejiga MIBC'],
    image: 'https://alexanderfleming.org/wp-content/uploads/2020/11/VILLOLDO-FOTO.jpeg',
  },
  {
    name: 'Dr. Edwin Reyes',
    country: 'Perú',
    specialty: 'Andrología',
    sessions: ['Terapia de reemplazo hormonal', 'Almuerzo-conferencia TRH', 'Disfunción sexual masculina'],
    image: 'https://web-auna-backend-prd-images.s3.amazonaws.com/07618347_mobile_27c67ecffd.png',
  },
  {
    name: 'Dr. Julián Azuero',
    country: 'Colombia',
    specialty: 'Urología funcional',
    sessions: ['Taller de urodinamia', 'Simposio de Urología Funcional', 'Vejiga hiperactiva'],
    image: 'https://www.ama.com.co/wp-content/uploads/2022/02/julian-6-Julian-Azuero-768x1024.jpeg',
  },
];

/** Facultad internacional adicional indicada en el programa actualizado. */
export const internationalFaculty: FacultySpeaker[] = [
  { name: 'Dr. Hugo de La Rosa', country: 'México', role: 'Ponente · Curso HoLEP', topics: ['Master internacional en HoLEP'] },
  { name: 'Dr. Javier Hernández', country: 'España', countries: ['España', 'Venezuela'], role: 'Coordinador / Ponente', topics: ['Masterclass de cáncer de vejiga', 'Terapia trimodal'] },
  { name: 'Dra. Carmen Gonzalez', country: 'España', role: 'Coordinadora / Ponente', topics: ['Cirugía laparoscópica y robótica', 'Urología funcional'] },
  { name: 'Dr. Roberto Ballesteros', country: 'España', role: 'Ponente', topics: ['Cirugía pélvica mínimamente invasiva', 'Cirugía urológica del futuro'] },
  { name: 'Dr. José Luis Alvarez Ossorio', country: 'España', role: 'Ponente', topics: ['Nefrectomía parcial'] },
  { name: 'Dr. Alejandro Carvajal', country: 'Colombia', role: 'Ponente', topics: ['Cirugía de Peyronie', 'Andrología'] },
  { name: 'Dr. Paulo Palma', country: 'Brasil', role: 'Ponente · ALAPP', topics: ['Simposio de piso pélvico'] },
  { name: 'Dr. Carlos Diaz Tamara', country: 'Colombia', role: 'Ponente · ALAPP', topics: ['Simposio de piso pélvico'] },
  { name: 'Lic. Angela Gómez', country: 'México', role: 'Ponente · ALAPP', topics: ['Simposio de piso pélvico'] },
  { name: 'Dr. Andrés Diaz', country: 'Colombia', role: 'Ponente · SCU', topics: ['HoLEP, ThuLEP y Thulium Fiber Laser'] },
  { name: 'Dra. Verónica Tobar', country: 'Colombia', role: 'Ponente · SCU', topics: ['Manejo quirúrgico de HPB', 'RTUP vs. enucleación'] },
  { name: 'Dr. Hugo López', country: 'Colombia', role: 'Moderador / Ponente · SCU', topics: ['Debate en HPB', 'Terapias mínimamente invasivas', 'Miniaturización en litiasis'] },
  { name: 'Dr. Luis Wadskier', country: 'Colombia', countries: ['Colombia', 'Venezuela'], role: 'Moderador / Ponente · SCU', topics: ['HPB con preservación de eyaculación', 'Cirugía de HPB en Latinoamérica'] },
  { name: 'Dr. Edgar Beltran', country: 'México', role: 'Ponente', topics: ['Acceso percutáneo en litiasis'] },
  { name: 'Dra. Catalina Solano', country: 'Colombia', role: 'Ponente', topics: ['TFL vs. holmio de alta potencia'] },
  { name: 'Dr. Miguel Cancini', country: 'Venezuela', countries: ['Venezuela', 'España'], role: 'Ponente', topics: ['RIRS', 'Estenosis uretral', 'Almuerzo-conferencia ELUTAX'] },
];
