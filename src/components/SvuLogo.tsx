export const SVU_LOGO_SRC = '/logo-svu.png';
export const SVU_LOGO_FALLBACK = '/logo-svu.svg';

type SvuLogoProps = {
  className?: string;
  variant?: 'nav' | 'hero' | 'card' | 'footer';
};

const heightClass: Record<NonNullable<SvuLogoProps['variant']>, string> = {
  nav: 'h-9 w-auto sm:h-10',
  hero: 'h-14 w-auto sm:h-16',
  card: 'h-11 w-auto',
  footer: 'h-12 w-auto',
};

export function SvuLogo({ className = '', variant = 'nav' }: SvuLogoProps) {
  return (
    <img
      src={SVU_LOGO_SRC}
      alt="Sociedad Venezolana de Urología"
      className={`object-contain object-left ${heightClass[variant]} ${className}`}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith('.svg')) return;
        img.src = SVU_LOGO_FALLBACK;
      }}
    />
  );
}
