import { ChangeEvent } from 'react';
import { exportData, importData } from '../utils/exportImport';
import { useTasks } from '../store/useTasks';
import { useCategories } from '../store/useCategories';
import { useSettings } from '../store/useSettings';

export function BackupControls() {
  const loadTasks = useTasks((s) => s.load);
  const loadCategories = useCategories((s) => s.load);
  const loadSettings = useSettings((s) => s.load);

  async function handleExport() {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importData(JSON.parse(text));
    await Promise.all([loadTasks(), loadCategories(), loadSettings()]);
    e.target.value = '';
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white focus-ring"
      >
        JSONをエクスポート
      </button>
      <label className="block space-y-1">
        <span>JSONをインポート</span>
        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="block focus-ring"
        />
      </label>
    </div>
  );
}
