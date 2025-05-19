import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TodayTimeline } from '../TodayTimeline';

// minimal mock tasks to test ordering

describe('TodayTimeline', () => {
  it('sorts and filters todays tasks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    const tasks = [
      {
        id: '1',
        title: 'later',
        dueAt: Date.now() + 3 * 60 * 60 * 1000,
        durationMin: null,
        categoryId: null,
        status: 'pending' as const,
        checklist: [],
        repeatRule: null,
        createdAt: 0,
        updatedAt: 0,
      },
      {
        id: '2',
        title: 'early',
        dueAt: Date.now() + 60 * 60 * 1000,
        durationMin: null,
        categoryId: null,
        status: 'pending' as const,
        checklist: [],
        repeatRule: null,
        createdAt: 0,
        updatedAt: 0,
      },
      {
        id: '3',
        title: 'tomorrow',
        dueAt: Date.now() + 25 * 60 * 60 * 1000,
        durationMin: null,
        categoryId: null,
        status: 'pending' as const,
        checklist: [],
        repeatRule: null,
        createdAt: 0,
        updatedAt: 0,
      },
    ];
    const html = renderToString(<TodayTimeline tasks={tasks} />);
    const earlyIndex = html.indexOf('early');
    const laterIndex = html.indexOf('later');
    expect(earlyIndex).toBeGreaterThan(-1);
    expect(laterIndex).toBeGreaterThan(-1);
    expect(earlyIndex).toBeLessThan(laterIndex);
    expect(html).not.toContain('tomorrow');
    vi.useRealTimers();
  });
});
