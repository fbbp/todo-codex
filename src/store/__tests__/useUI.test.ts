import { describe, it, expect, beforeEach } from 'vitest';
import { useUI } from '../useUI';

describe('useUI store', () => {
  beforeEach(() => {
    useUI.setState({ menuOpen: false });
  });

  it('toggles menu', () => {
    useUI.getState().toggleMenu();
    expect(useUI.getState().menuOpen).toBe(true);
  });

  it('opens and closes menu', () => {
    useUI.getState().openMenu();
    expect(useUI.getState().menuOpen).toBe(true);
    useUI.getState().closeMenu();
    expect(useUI.getState().menuOpen).toBe(false);
  });
});
