import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import OfflineIndicator from '../OfflineIndicator';

// jsdom is not used; create minimal window object
beforeEach(() => {
  Object.defineProperty(globalThis, 'navigator', {
    value: { onLine: true },
    configurable: true,
  });
  const mockWindow: Pick<Window, 'addEventListener' | 'removeEventListener' | 'navigator'> = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    navigator: globalThis.navigator,
  };
  Object.defineProperty(globalThis, 'window', { value: mockWindow, configurable: true });
});

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true });
}

describe('OfflineIndicator', () => {
  it('renders banner when offline', () => {
    setOnline(false);
    const html = renderToString(<OfflineIndicator />);
    expect(html).toContain('オフライン');
  });

  it('hides when online', () => {
    setOnline(true);
    const html = renderToString(<OfflineIndicator />);
    expect(html).not.toContain('オフライン');
  });
});
