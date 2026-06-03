/** Logo oficial horizontal SVU (fondo negro). Versión en query para evitar caché antigua en deploy. */
export const SVU_LOGO_SRC = '/logo-svu.png?v=official';

type SvuLogoProps = {
  className?: string;
  variant?: 'nav' | 'hero' | 'card' | 'footer';
};

const sizeClass: Record<NonNullable<SvuLogoProps['variant']>, string> = {
  nav: 'h-9 w-auto max-w-[11rem] sm:h-10 sm:max-w-[13rem]',
  hero: 'h-12 w-auto max-w-[16rem] sm:h-14 sm:max-w-[20rem]',
  card: 'h-10 w-auto max-w-[12rem]',
  footer: 'h-11 w-auto max-w-[14rem]',
};

export function SvuLogo({ className = '', variant = 'nav' }: SvuLogoProps) {
  return (
    <img
      src={SVU_LOGO_SRC}
      alt="Sociedad Venezolana de Urología"
      width={430}
      height={130}
      className={`object-contain object-left ${sizeClass[variant]} ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
