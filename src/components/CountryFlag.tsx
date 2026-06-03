import { getCountryFlagUrl, getCountryName } from '../lib/countries';

type CountryFlagProps = {
  country: string;
  size?: 'sm' | 'md';
  showName?: boolean;
  className?: string;
};

const flagSize: Record<NonNullable<CountryFlagProps['size']>, { w: number; h: string }> = {
  sm: { w: 40, h: 'h-3.5 w-5' },
  md: { w: 48, h: 'h-4 w-6' },
};

export function CountryFlag({ country, size = 'sm', showName = true, className = '' }: CountryFlagProps) {
  const url = getCountryFlagUrl(country, flagSize[size].w);
  const name = getCountryName(country);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {url ? (
        <img
          src={url}
          srcSet={`${getCountryFlagUrl(country, flagSize[size].w * 2)} 2x`}
          alt=""
          width={flagSize[size].w}
          height={Math.round(flagSize[size].w * 0.75)}
          className={`${flagSize[size].h} shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-white/10`}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {showName ? <span>{name}</span> : null}
    </span>
  );
}
