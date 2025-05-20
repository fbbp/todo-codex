import { describe, it, expect, vi } from 'vitest';
import { registerShortcuts } from '../shortcuts';

describe('registerShortcuts', () => {
  it('calls callback on n key', () => {
    const cb = vi.fn();
    const events: Record<string, (e: KeyboardEvent) => void> = {};
    const win: Pick<Window, 'addEventListener' | 'removeEventListener'> = {
      addEventListener: vi.fn((t: string, h: (e: KeyboardEvent) => void) => {
        events[t] = h;
      }),
      removeEventListener: vi.fn(),
    };
    const cleanup = registerShortcuts(cb, win);
    events['keydown']?.({
      key: 'n',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      target: { tagName: 'DIV' },
    } as unknown as KeyboardEvent);
    expect(cb).toHaveBeenCalled();
    cleanup();
    expect(win.removeEventListener).toHaveBeenCalled();
  });

  it('ignores events from input', () => {
    const cb = vi.fn();
    const events: Record<string, (e: KeyboardEvent) => void> = {};
    const win: Pick<Window, 'addEventListener' | 'removeEventListener'> = {
      addEventListener: vi.fn((t: string, h: (e: KeyboardEvent) => void) => {
        events[t] = h;
      }),
      removeEventListener: vi.fn(),
    };
    registerShortcuts(cb, win);
    events['keydown']?.({
      key: 'n',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      target: { tagName: 'INPUT' },
    } as unknown as KeyboardEvent);
    expect(cb).not.toHaveBeenCalled();
  });
});
