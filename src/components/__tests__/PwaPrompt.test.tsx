import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import PwaPrompt from '../PwaPrompt';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [true, vi.fn()],
    needRefresh: [true, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

describe('PwaPrompt', () => {
  it('renders offline and update notices', () => {
    const html = renderToString(<PwaPrompt />);
    expect(html).toContain('Offline ready');
    expect(html).toContain('Update');
  });
});
