import fs from 'node:fs';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const logoPath = new URL('../public/logo-svu.png', import.meta.url);
const outputPath = new URL('../public/og-congreso-2026-v14.png', import.meta.url);
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061A38"/>
      <stop offset="0.56" stop-color="#0A2851"/>
      <stop offset="1" stop-color="#0B4771"/>
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="35%" r="55%">
      <stop offset="0" stop-color="#43A8DE" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#43A8DE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F2D27E"/>
      <stop offset="1" stop-color="#CFA94C"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0A2346" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#0B315A" stop-opacity="0.80"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#020A17" flood-opacity="0.34"/>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#8BB6D9" stroke-width="1" opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <circle cx="1135" cy="62" r="295" fill="none" stroke="#D9B65F" stroke-width="2" opacity="0.38"/>
  <circle cx="1135" cy="62" r="250" fill="none" stroke="#D9B65F" stroke-width="1" opacity="0.18"/>
  <path d="M815 -20 L680 650" stroke="#D9B65F" stroke-width="3" opacity="0.75"/>
  <path d="M842 -20 L707 650" stroke="#F2D27E" stroke-width="1" opacity="0.35"/>

  <g opacity="0.22" filter="url(#soft)">
    <ellipse cx="995" cy="290" rx="180" ry="220" fill="#2D94C7"/>
  </g>

  <g transform="translate(72 58)">
    <image href="data:image/png;base64,${logoBase64}" width="255" height="88" preserveAspectRatio="xMinYMid meet"/>
  </g>

  <g transform="translate(72 174)">
    <rect x="0" y="0" width="344" height="42" rx="21" fill="#0C294E" stroke="#D9B65F" stroke-opacity="0.35"/>
    <circle cx="24" cy="21" r="5" fill="#F2D27E"/>
    <text x="42" y="27" fill="#F2D27E" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="1.3">PROGRAMA ACTUALIZADO</text>
  </g>

  <g transform="translate(72 252)">
    <text x="0" y="0" fill="#F8FAFD" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800" letter-spacing="-1.2">
      <tspan x="0" dy="0">XXXVI Congreso</tspan>
      <tspan x="0" dy="70">Nacional de Urología</tspan>
    </text>
    <text x="0" y="154" fill="url(#gold)" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="800">2026</text>
    <text x="0" y="196" fill="#B9C7DA" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500" letter-spacing="0.2">Encuentro científico nacional · Sociedad Venezolana de Urología</text>
  </g>

  <g transform="translate(72 510)" filter="url(#shadow)">
    <rect x="0" y="0" width="650" height="78" rx="18" fill="url(#panel)" stroke="#FFFFFF" stroke-opacity="0.10"/>
    <text x="28" y="33" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700">4–7 de noviembre de 2026</text>
    <text x="28" y="61" fill="#B9C7DA" font-family="Arial, Helvetica, sans-serif" font-size="17">Hotel Tibisay · Isla de Margarita</text>
  </g>

  <g transform="translate(860 168)">
    <rect x="0" y="0" width="270" height="310" rx="34" fill="#082244" fill-opacity="0.55" stroke="#FFFFFF" stroke-opacity="0.08"/>

    <!-- Anatomical-inspired kidneys, kept abstract and clean -->
    <path d="M82 60 C44 60 30 94 36 128 C42 160 61 179 88 175 C109 172 117 153 110 133 C103 112 108 89 101 74 C97 66 91 61 82 60Z"
      fill="none" stroke="#75C2E8" stroke-width="3" opacity="0.78"/>
    <path d="M188 60 C226 60 240 94 234 128 C228 160 209 179 182 175 C161 172 153 153 160 133 C167 112 162 89 169 74 C173 66 179 61 188 60Z"
      fill="none" stroke="#75C2E8" stroke-width="3" opacity="0.78"/>
    <path d="M108 142 C115 177 124 201 135 222" fill="none" stroke="#D9B65F" stroke-width="4" stroke-linecap="round"/>
    <path d="M162 142 C155 177 146 201 135 222" fill="none" stroke="#D9B65F" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="135" cy="238" rx="30" ry="23" fill="none" stroke="#75C2E8" stroke-width="3" opacity="0.78"/>
    <path d="M135 261 L135 280" stroke="#D9B65F" stroke-width="4" stroke-linecap="round"/>

    <text x="135" y="298" text-anchor="middle" fill="#F2D27E" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="1.8">CIENCIA · INNOVACIÓN</text>
  </g>

  <text x="1128" y="584" text-anchor="end" fill="#AFC1D4" font-family="Arial, Helvetica, sans-serif" font-size="15">congreso2026-azure.vercel.app</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(outputPath);

const { size } = fs.statSync(outputPath);
console.log('Generated premium social preview:', size, 'bytes');
