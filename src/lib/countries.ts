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

export const COUNTRY_FLAGS: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  España: '🇪🇸',
  Italia: '🇮🇹',
  Colombia: '🇨🇴',
  Perú: '🇵🇪',
  Argentina: '🇦🇷',
  México: '🇲🇽',
  Brasil: '🇧🇷',
};

export function getCountryWithFlag(country: string): string {
  const flag = COUNTRY_FLAGS[country] ?? '';
  return flag ? `${flag} ${country}` : country;
}

export function countryFromCode(code: string): string {
  const key = code.trim().toUpperCase();
  return COUNTRY_NAMES[key] ?? COUNTRY_NAMES[code] ?? code;
}
