import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import OfflineIndicator from '../OfflineIndicator';

// jsdom is not used; create minimal window object
beforeEach(() => {
  Object.defineProperty(globalThis, 'navigator', {
    value: { onLine: true },
    configurable: true,
  });
  (globalThis as any).window = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    navigator: globalThis.navigator,
  };
});

function setOnline(value: boolean) {
  (window.navigator as any).onLine = value;
}

describe('OfflineIndicator', () => {
  it('renders banner when offline', () => {
    setOnline(false);
    const html = renderToString(<OfflineIndicator />);
    expect(html).toContain('Offline');
  });

  it('hides when online', () => {
    setOnline(true);
    const html = renderToString(<OfflineIndicator />);
    expect(html).not.toContain('Offline');
  });
});
