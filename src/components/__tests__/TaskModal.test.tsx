import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskModal from '../TaskModal';

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
