import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskModal from '../TaskModal';

vi.mock('../../store/useCategories', () => ({
  useCategories: (
    sel?: (s: { load: () => void; categories: [] }) => unknown,
  ) => {
    const state = { load: vi.fn(), categories: [] };
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
    expect(html).toContain('Save');
  });
});
