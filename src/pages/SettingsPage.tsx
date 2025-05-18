
import { useEffect } from 'react';
import { useSettings } from '../store/useSettings';

export default function SettingsPage() {
  const settings = useSettings((s) => s.settings);
  const load = useSettings((s) => s.load);
  const update = useSettings((s) => s.update);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <form className="space-y-4">
      <label className="block space-y-1">
        <span>Notify minutes before</span>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={settings.notifyBeforeMin}
          onChange={(e) => update('notifyBeforeMin', Number(e.target.value))}
        />
      </label>
      <label className="block space-y-1">
        <span>Theme</span>
        <select
          className="border rounded px-2 py-1 w-full"
          value={settings.theme}
          onChange={(e) =>
            update('theme', e.target.value as 'light' | 'dark')
          }
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span>Snooze minutes</span>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={settings.snoozeMin}
          onChange={(e) => update('snoozeMin', Number(e.target.value))}
        />
      </label>
    </form>
  );
}
