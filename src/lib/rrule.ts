export interface RRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  interval: number;
}

export function parseRRule(rule: string): RRule | null {
  const parts = rule.split(';');
  let freq: RRule['freq'] | null = null;
  let interval = 1;
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k === 'FREQ' && (v === 'DAILY' || v === 'WEEKLY' || v === 'MONTHLY')) {
      freq = v;
    } else if (k === 'INTERVAL') {
      interval = Number(v);
    }
  }
  if (!freq) return null;
  return { freq, interval: interval || 1 };
}

export function getNextDueAt(rule: string, from: number): number {
  const parsed = parseRRule(rule);
  if (!parsed) return from;
  const { freq, interval } = parsed;
  const date = new Date(from);
  switch (freq) {
    case 'DAILY':
      date.setUTCDate(date.getUTCDate() + interval);
      break;
    case 'WEEKLY':
      date.setUTCDate(date.getUTCDate() + interval * 7);
      break;
    case 'MONTHLY':
      date.setUTCMonth(date.getUTCMonth() + interval);
      break;
  }
  return date.getTime();
}
