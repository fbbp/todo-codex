import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskForm } from '../TaskForm';
import type { Category } from '../../db';

vi.mock('../../store/useCategories', () => ({
  useCategories: (
    sel?: (s: { categories: Category[]; load: () => void }) => unknown,
  ) => {
    const state = { categories: [] as Category[], load: vi.fn() };
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
