import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskForm } from '../TaskForm';

vi.mock('../../store/useCategories', () => ({
  useCategories: (sel?: (s: { categories: []; load: () => void }) => unknown) => {
    const state = { categories: [], load: vi.fn() };
    return sel ? sel(state) : state;
  },
}));

describe('TaskForm', () => {
  it('renders form fields', () => {
    const html = renderToString(<TaskForm />);
    expect(html).toContain('datetime-local');
    expect(html).toContain('<select');
    expect(html).toContain('RRULE');
  });
});
