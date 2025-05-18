
import { exportData, importData } from '../utils/exportImport';
import { useTasks } from '../store/useTasks';
import { useCategories } from '../store/useCategories';
import { useSettings } from '../store/useSettings';

export default function SettingsPage() {
  const reload = async () => {
    await Promise.all([
      useTasks.getState().load(),
      useCategories.getState().load(),
      useSettings.getState().load(),
    ]);
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importData(JSON.parse(text));
    await reload();
  };

  return (
    <div className="p-4 space-y-4">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white"
      >
        Export
      </button>
      <label className="block">
        <span className="mr-2">Import</span>
        <input type="file" accept="application/json" onChange={handleImport} />
      </label>
    </div>
  );
}
