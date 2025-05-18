import { describe, it, expect } from 'vitest';
import { getNextDueAt } from '../rrule';

describe('getNextDueAt', () => {
  it('handles daily rule', () => {
    const start = Date.UTC(2024, 0, 1); // 2024-01-01
    const next = getNextDueAt('FREQ=DAILY;INTERVAL=1', start);
    expect(new Date(next).getUTCDate()).toBe(2);
  });

  it('handles weekly rule', () => {
    const start = Date.UTC(2024, 0, 1); // Monday
    const next = getNextDueAt('FREQ=WEEKLY;INTERVAL=2', start);
    expect(new Date(next).getUTCDate()).toBe(15);
  });
});
