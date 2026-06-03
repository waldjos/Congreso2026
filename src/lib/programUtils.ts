export type ProgramItem = {
  time?: string;
  title: string;
  details?: string;
  venue?: string;
  price?: string;
  kind?: string;
};

export type ProgramVenue = {
  name: string;
  items: ProgramItem[];
};

export type ProgramDay = {
  day: string;
  description?: string;
  venues?: ProgramVenue[];
  items?: (ProgramItem | string)[];
  timeline?: ProgramItem[];
};

export type EventKind = 'break' | 'lunch' | 'symposium' | 'course' | 'social' | 'keynote' | 'section' | 'talk';

const KIND_RULES: { kind: EventKind; pattern: RegExp }[] = [
  { kind: 'break', pattern: /\breceso\b/i },
  { kind: 'lunch', pattern: /\balmuerzo\b/i },
  { kind: 'social', pattern: /\b(fiesta|white party|acto inaugural|brindis|premiaci[oó]n|juramentaci[oó]n|asamblea)\b/i },
  { kind: 'keynote', pattern: /\bmiembro em[eé]rito\b/i },
  { kind: 'course', pattern: /\b(curso|taller|masterclass|master en)\b/i },
  { kind: 'symposium', pattern: /\b(simposio|debate|mesa redonda|panel)\b/i },
  { kind: 'section', pattern: /\b(secci[oó]n|programa de)\b/i },
];

export function classifyEvent(title: string, details = ''): EventKind {
  const blob = `${title} ${details}`;
  for (const rule of KIND_RULES) {
    if (rule.pattern.test(blob)) return rule.kind;
  }
  return 'talk';
}

export function formatDayLabel(day: string): { short: string; full: string; date: string } {
  const match = day.match(
    /(MI[EÉ]RCOLES|JUEVES|VIERNES|S[AÁ]BADO|DOMINGO|LUNES|MARTES)\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
  );
  if (!match) return { short: day, full: day, date: '' };

  const names: Record<string, string> = {
    MIERCOLES: 'Miércoles',
    MIÉRCOLES: 'Miércoles',
    JUEVES: 'Jueves',
    VIERNES: 'Viernes',
    SABADO: 'Sábado',
    SÁBADO: 'Sábado',
  };
  const key = match[1].toUpperCase().replace('Á', 'A').replace('É', 'E');
  const name = names[key] || match[1];
  const date = `${match[2]}/${match[3]}/${match[4]}`;

  return {
    short: name,
    full: `${name} ${match[2]} de julio`,
    date,
  };
}

export function normalizeTitle(title: string): string {
  let t = title.trim();
  if (t.startsWith('. ')) t = t.slice(2);
  else if (t.startsWith('.')) t = t.replace(/^\.\s*/, '');
  if (t.startsWith(': ')) t = t.slice(2);
  return t.trim();
}

export function parseDetailLines(details?: string): string[] {
  if (!details?.trim()) return [];
  return details
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function venueLabel(name: string): { label: string; icon: 'hospital' | 'hotel' | 'beach' | 'hall' } {
  const lower = name.toLowerCase();
  if (lower.includes('hospital') || lower.includes('clínicas') || lower.includes('clinicas')) {
    return { label: name, icon: 'hospital' };
  }
  if (lower.includes('margarita') || lower.includes('beach') || lower.includes('downtown')) {
    return { label: name, icon: 'beach' };
  }
  if (lower.includes('tibisay') || lower.includes('hotel')) {
    return { label: name, icon: 'hotel' };
  }
  return { label: name, icon: 'hall' };
}

export const kindStyles: Record<
  EventKind,
  { badge: string; card: string; dot: string; label: string }
> = {
  break: {
    badge: 'bg-slate-500/20 text-slate-300',
    card: 'border-dashed border-slate-500/30 bg-slate-900/40',
    dot: 'bg-slate-500',
    label: 'Receso',
  },
  lunch: {
    badge: 'bg-amber-500/15 text-amber-200',
    card: 'border-amber-400/25 bg-amber-950/30',
    dot: 'bg-amber-400',
    label: 'Almuerzo',
  },
  symposium: {
    badge: 'bg-gold/20 text-gold',
    card: 'border-gold/35 bg-gradient-to-br from-slate-950/90 to-deep/80 shadow-[0_0_40px_-12px_rgba(201,163,78,0.35)]',
    dot: 'bg-gold',
    label: 'Simposio',
  },
  course: {
    badge: 'bg-sky-500/20 text-sky-200',
    card: 'border-sky-400/30 bg-sky-950/25',
    dot: 'bg-sky-400',
    label: 'Curso / Taller',
  },
  social: {
    badge: 'bg-violet-500/20 text-violet-200',
    card: 'border-violet-400/30 bg-violet-950/25',
    dot: 'bg-violet-400',
    label: 'Evento',
  },
  keynote: {
    badge: 'bg-rose-500/20 text-rose-200',
    card: 'border-rose-400/25 bg-rose-950/20',
    dot: 'bg-rose-400',
    label: 'Conferencia',
  },
  section: {
    badge: 'bg-white/10 text-slate-200',
    card: 'border-white/20 bg-white/5',
    dot: 'bg-white/60',
    label: 'Bloque',
  },
  talk: {
    badge: 'bg-white/8 text-slate-300',
    card: 'border-white/10 bg-slate-950/60 hover:border-gold/25',
    dot: 'bg-gold/70',
    label: 'Sesión',
  },
};
