import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders navigation links', () => {
    const html = renderToString(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(html).toContain('ホーム');
    expect(html).toContain('カテゴリ');
  });
});
