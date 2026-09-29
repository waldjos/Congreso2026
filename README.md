# Congreso Urología 2026

Micrositio del **XXXVI Congreso Nacional de Urología - Dr. Nelson Medero**, organizado por la Sociedad Venezolana de Urología.

## Fechas actualizadas

**4 al 7 de noviembre de 2026 · Hotel Tibisay · Isla de Margarita**

El evento fue reprogramado y el sitio utiliza el programa científico actualizado de noviembre de 2026.

## Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion

## Estructura principal

- `src/App.tsx` — página principal, información del evento, sedes, inscripciones y evento social.
- `src/components/ProgramSchedule.tsx` — agenda interactiva por día y sede.
- `public/program.json` — fuente estructurada del programa científico actualizado.
- `src/data/speakers.ts` — ponentes destacados y facultad internacional.
- `src/components/SponsorsSection.tsx` — patrocinadores.
- `src/lib/programUtils.ts` — normalización de fechas, sedes y tipos de actividad.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

Vercel despliega automáticamente la rama `main`.

## Estado

- Programa científico interactivo: actualizado a noviembre 2026.
- Contador: actualizado al 4 de noviembre de 2026.
- White Party: sábado 7 de noviembre de 2026.
- SEO y datos estructurados del evento: actualizados.
- El PDF anterior de julio debe permanecer fuera de circulación; la descarga se habilita únicamente con el documento actualizado.
