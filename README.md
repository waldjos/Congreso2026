# Congreso Urología 2026

Micrositio premium para el XXXVI Congreso Venezolano de Urología 2026, construido con React, Vite y TailwindCSS.

## Instalación

1. Abre la carpeta del proyecto:
   ```bash
   cd "c:\Users\Usuario\OneDrive\Desktop\Congreso2026"
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el sitio en desarrollo:
   ```bash
   npm run dev
   ```

## Producción

Para generar el sitio listo para deploy:
```bash
npm run build
```

## Despliegue en Vercel

1. Conecta el repositorio `https://github.com/waldjos/Congreso2026` en Vercel.
2. Selecciona la rama `main`.
3. Vercel detectará automáticamente el framework y usará `npm run build`.
4. Si prefieres deploy manual, puedes usar:
   ```bash
   npx vercel --prod
   ```

## Estructura principal

- `src/App.tsx` — Página principal y todas las secciones del micrositio
- `src/index.css` — Estilos globales y configuración Tailwind
- `vite.config.ts` — Configuración de Vite
- `tailwind.config.js` — Configuración de TailwindCSS

## Siguiente paso sugerido

1. Ajustar copy y fotos reales para cada ponente.
2. Añadir formulario de inscripción y pagos.
3. Integrar PDF descargable desde la sección de programa.
4. Desplegar en Vercel con dominio personalizado.
