import { describe, it, expect, vi } from 'vitest';
import { registerShortcuts } from '../shortcuts';

describe('registerShortcuts', () => {
  it('calls callback on n key', () => {
    const cb = vi.fn();
    const events: Record<string, (e: KeyboardEvent) => void> = {};
    const add = vi.fn<(t: string, h: (e: KeyboardEvent) => void) => void>((t, h) => {
      events[t] = h;
    });
    const remove = vi.fn();
    const win = {
      addEventListener: add as unknown as Window['addEventListener'],
      removeEventListener: remove as unknown as Window['removeEventListener'],
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
    const add = vi.fn<(t: string, h: (e: KeyboardEvent) => void) => void>((t, h) => {
      events[t] = h;
    });
    const remove = vi.fn();
    const win = {
      addEventListener: add as unknown as Window['addEventListener'],
      removeEventListener: remove as unknown as Window['removeEventListener'],
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
