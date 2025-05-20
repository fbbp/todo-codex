import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskModal from '../TaskModal';
import type { Category } from '../../db';

vi.mock('../../store/useCategories', () => ({
  useCategories: (
    sel?: (s: { load: () => void; categories: Category[] }) => unknown,
  ) => {
    const state = { load: vi.fn(), categories: [] as Category[] };
    return sel ? sel(state) : state;
  },
}));

describe('TaskModal', () => {
  it('renders save button', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/task"]}>
        <Routes>
          <Route path="/task" element={<TaskModal />} />
        </Routes>
      </MemoryRouter>
    );
    expect(html).toContain('保存');
  });
});
