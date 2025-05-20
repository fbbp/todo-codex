import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { BackupControls } from '../BackupControls';

vi.mock('../../utils/exportImport', () => ({
  exportData: vi.fn().mockResolvedValue({ tasks: [], categories: [], settings: [] }),
  importData: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../store/useTasks', () => ({
  useTasks: () => ({ load: vi.fn() }),
}));
vi.mock('../../store/useCategories', () => ({
  useCategories: () => ({ load: vi.fn() }),
}));
vi.mock('../../store/useSettings', () => ({
  useSettings: () => ({ load: vi.fn() }),
}));

describe('BackupControls', () => {
  it('renders export and import controls', () => {
    const html = renderToString(<BackupControls />);
    expect(html).toContain('JSONをエクスポート');
    expect(html).toContain('JSONをインポート');
  });
});
