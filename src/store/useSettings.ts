import { create } from 'zustand';
import { db } from '../db';

export interface Settings {
  notifyBeforeMin: number;
  theme: 'light' | 'dark';
  snoozeMin: number;
}

export interface SettingsStore {
  settings: Settings;
  load: () => Promise<void>;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  notifyBeforeMin: 10,
  theme: 'light',
  snoozeMin: 5,
};

export const useSettings = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  async load() {
    const entries = await db.settings.toArray();
    const loaded: Settings = { ...DEFAULT_SETTINGS };
    for (const { key, value } of entries) {
      switch (key) {
        case 'notifyBeforeMin':
        case 'snoozeMin':
          loaded[key] = Number(value) as Settings[typeof key];
          break;
        case 'theme':
          loaded.theme = value === 'dark' ? 'dark' : 'light';
          break;
        default:
          break;
      }
    }
    set({ settings: loaded });
  },
  async update(key, value) {
    await db.settings.put({ key, value });
    set({ settings: { ...get().settings, [key]: value } });
  },
}));
