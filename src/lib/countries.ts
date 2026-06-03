/** Códigos ISO / programa → nombre en español */
export const COUNTRY_NAMES: Record<string, string> = {
  USA: 'Estados Unidos',
  ESP: 'España',
  ITA: 'Italia',
  COL: 'Colombia',
  PER: 'Perú',
  ARG: 'Argentina',
  MEX: 'México',
  Mex: 'México',
  BRA: 'Brasil',
};

/** Nombre en español → código ISO 3166-1 alpha-2 (minúsculas) */
export const COUNTRY_ISO: Record<string, string> = {
  'Estados Unidos': 'us',
  España: 'es',
  Italia: 'it',
  Colombia: 'co',
  Perú: 'pe',
  Argentina: 'ar',
  México: 'mx',
  Brasil: 'br',
};

export function getCountryFlagUrl(country: string, width = 40): string {
  const iso = COUNTRY_ISO[country];
  return iso ? `https://flagcdn.com/w${width}/${iso}.png` : '';
}

export function getCountryName(country: string): string {
  return country;
}

export function countryFromCode(code: string): string {
  const key = code.trim().toUpperCase();
  return COUNTRY_NAMES[key] ?? COUNTRY_NAMES[code] ?? code;
}
