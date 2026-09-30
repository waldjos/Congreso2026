import fs from 'node:fs';

const cover = new URL('../public/og-congreso-2026-v14.png', import.meta.url);

if (!fs.existsSync(cover)) {
  throw new Error('Missing static social preview: public/og-congreso-2026-v14.png');
}

const { size } = fs.statSync(cover);
console.log('Using static social preview supplied by user:', size, 'bytes');
