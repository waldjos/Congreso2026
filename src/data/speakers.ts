export type FeaturedSpeaker = {
  name: string;
  country: string;
  /** Países adicionales cuando el ponente representa más de una nacionalidad */
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

/** Ponentes internacionales con perfil destacado (foto) */
export const featuredSpeakers: FeaturedSpeaker[] = [
  {
    name: 'Dr. René Sotelo',
    country: 'Venezuela',
    countries: ['Venezuela', 'Estados Unidos'],
    specialty: 'Cirugía robótica y uro-oncología · pionero venezolano',
    sessions: ['Cirugía robótica postradioterapia', 'Cáncer de próstata de alto riesgo'],
    image: 'https://doctorsotelo.com/profile/dr-rene-sotelo.jpg',
  },
  {
    name: 'Dr. Joan Palou',
    country: 'España',
    specialty: 'Oncología urológica',
    sessions: ['NMIBC resistente a BCG', 'Cistectomía mínimamente invasiva', 'Cirugía laparoscópica y robótica'],
    image: 'https://static.emedevents.com/uploads/speakers/200/79282bf1f8c7a312e8d6b838b607e4cc.png',
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
    sessions: ['Incontinencia post-prostatectomía', 'Vejiga hiperactiva', 'Simposio de urología funcional'],
    image: 'https://objects-es.cdn-topdoctors.com/provider/1084885/image/profile/medium/prof_10221_20210719162910.png?width=648&format=png',
  },
  {
    name: 'Dr. Paul Ernesto Escovar',
    country: 'Venezuela',
    countries: ['Venezuela', 'Chile'],
    specialty: 'Uro-oncología',
    sessions: ['Conferencia desayuno ADIUM'],
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
    sessions: ['Taller de urodinamia', 'Simposio de urología funcional', 'Vejiga hiperactiva'],
    image: 'https://www.ama.com.co/wp-content/uploads/2022/02/julian-6-Julian-Azuero-768x1024.jpeg',
  },
];

/**
 * Facultad internacional adicional del programa oficial
 * (sin foto en sitio; mencionados por su rol en simposios y cursos)
 */
export const internationalFaculty: FacultySpeaker[] = [
  {
    name: 'Dr. Hugo de La Rosa',
    country: 'México',
    role: 'Ponente · Curso HoLEP',
    topics: ['Master internacional en HoLEP'],
  },
  {
    name: 'Dr. Javier Hernández',
    country: 'España',
    role: 'Coordinador · Masterclass',
    topics: ['Cáncer de vejiga', 'Terapia trimodal'],
  },
  {
    name: 'Dra. Carmen González',
    country: 'España',
    role: 'Coordinadora · AEU',
    topics: ['Cirugía laparoscópica y robótica', 'Urología funcional'],
  },
  {
    name: 'Dr. Alberto Budia',
    country: 'España',
    role: 'Moderador · AEU',
    topics: ['Simposio de cirugía laparoscópica y robótica'],
  },
  {
    name: 'Dr. José Luis Álvarez Ossorio',
    country: 'España',
    role: 'Ponente',
    topics: ['Nefrectomía parcial'],
  },
  {
    name: 'Dr. Mario Álvarez Maestro',
    country: 'España',
    role: 'Ponente',
    topics: ['Prostatectomía radical'],
  },
  {
    name: 'Dra. Begoña Balletas',
    country: 'España',
    role: 'Ponente · EAU',
    topics: ['Miniaturización en litiasis (NLPC)'],
  },
  {
    name: 'Dr. Miguel Cancini',
    country: 'Venezuela',
    countries: ['Venezuela', 'España'],
    role: 'Ponente',
    topics: ['RIRS · Estenosis uretral', 'Almuerzo-conferencia ELUTAX'],
  },
  {
    name: 'Dr. Alejandro Carvajal',
    country: 'Colombia',
    role: 'Ponente',
    topics: ['Cirugía de Peyronie', 'Andrología'],
  },
  {
    name: 'Dr. Andrés Díaz',
    country: 'Colombia',
    role: 'Ponente · SCU',
    topics: ['HoLEP, ThuLEP y láser de fibra de tulio (HPB)'],
  },
  {
    name: 'Dra. Verónica Tobar',
    country: 'Colombia',
    role: 'Ponente · SCU',
    topics: ['Manejo quirúrgico de HPB', 'RTUP vs enucleación'],
  },
  {
    name: 'Dr. Carlos Andrade',
    country: 'Colombia',
    role: 'Moderador · SCU',
    topics: ['Debate HPB médico vs quirúrgico', 'Terapias mínimamente invasivas'],
  },
  {
    name: 'Dr. Luis Wadskier',
    country: 'Colombia',
    role: 'Panelista · SCU',
    topics: ['HPB con preservación de eyaculación', 'Cirugía de HPB en Latinoamérica'],
  },
  {
    name: 'Dr. Edgar Beltrán',
    country: 'México',
    role: 'Ponente · CAU',
    topics: ['Acceso percutáneo en litiasis'],
  },
  {
    name: 'Dr. Alvaro Ochoa',
    country: 'Colombia',
    role: 'Ponente · ALAPP',
    topics: ['Simposio de piso pélvico'],
  },
  {
    name: 'Dr. Paulo Palma',
    country: 'Brasil',
    role: 'Ponente · ALAPP',
    topics: ['Simposio de piso pélvico'],
  },
  {
    name: 'Dr. Giovanni Scala Marchini',
    country: 'Brasil',
    role: 'Ponente · EAU',
    topics: ['TFL vs holmio de alta potencia'],
  },
];
