import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettings } from '../useSettings';

const settings: Record<string, unknown> = {};

vi.mock('../../db', () => ({
  db: {
    settings: {
      toArray: () =>
        Promise.resolve(
          Object.entries(settings).map(([key, value]) => ({ key, value })),
        ),
      put: ({ key, value }: { key: string; value: unknown }) => {
        settings[key] = value;
        return Promise.resolve();
      },
    },
  },
}));

describe('useSettings store', () => {
  beforeEach(() => {
    for (const k of Object.keys(settings)) delete settings[k];
    useSettings.setState({
      settings: {
        notifyBeforeMin: 10,
        theme: 'light',
        snoozeMin: 5,
      },
    });
  });

  it('loads settings', async () => {
    settings.theme = 'dark';
    await useSettings.getState().load();
    expect(useSettings.getState().settings.theme).toBe('dark');
  });

  it('updates setting', async () => {
    await useSettings.getState().update('notifyBeforeMin', 15);
    expect(settings.notifyBeforeMin).toBe(15);
    expect(useSettings.getState().settings.notifyBeforeMin).toBe(15);
  });
});
