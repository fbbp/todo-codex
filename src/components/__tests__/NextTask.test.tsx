import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { NextTask } from '../NextTask';

// simple mock for tasks state
describe('NextTask', () => {
  it('renders the nearest upcoming task', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    const tasks = [
      {
        id: '1',
        title: 'first',
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
        id: '2',
        title: 'later',
        dueAt: Date.now() + 2 * 60 * 60 * 1000,
        durationMin: null,
        categoryId: null,
        status: 'pending' as const,
        checklist: [],
        repeatRule: null,
        createdAt: 0,
        updatedAt: 0,
      },
    ];
    const html = renderToString(<NextTask tasks={tasks} />);
    expect(html).toContain('first');
    vi.useRealTimers();
  });
});
