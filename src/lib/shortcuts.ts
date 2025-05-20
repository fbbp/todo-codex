import { useEffect } from 'react';

export function registerShortcuts(
  onNew: () => void,
  win: Pick<Window, 'addEventListener' | 'removeEventListener'> = window,
) {
  function handler(e: KeyboardEvent) {
    if (e.key !== 'n' || e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    onNew();
  }
  win.addEventListener('keydown', handler);
  return () => win.removeEventListener('keydown', handler);
}

export function useKeyboardShortcuts(onNew: () => void) {
  useEffect(() => registerShortcuts(onNew), [onNew]);
}
