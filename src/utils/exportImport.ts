import { db, type Task, type Category, type Setting } from '../db';

export interface ExportData {
  tasks: Task[];
  categories: Category[];
  settings: Setting[];
}

export async function exportData(): Promise<ExportData> {
  const [tasks, categories, settings] = await Promise.all([
    db.tasks.toArray(),
    db.categories.toArray(),
    db.settings.toArray(),
  ]);
  return { tasks, categories, settings };
}

export async function importData(data: ExportData): Promise<void> {
  await db.transaction('rw', db.tasks, db.categories, db.settings, async () => {
    await db.tasks.clear();
    await db.categories.clear();
    await db.settings.clear();
    if (data.tasks.length) await db.tasks.bulkAdd(data.tasks);
    if (data.categories.length) await db.categories.bulkAdd(data.categories);
    if (data.settings.length) await db.settings.bulkAdd(data.settings);
  });
}
