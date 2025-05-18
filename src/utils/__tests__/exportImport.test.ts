import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportData, importData, type ExportData } from '../exportImport';
import type { Task, Category, Setting } from '../../db';

const tasks: Task[] = [];
const categories: Category[] = [];
const settings: Setting[] = [];

vi.mock('../../db', () => ({
  db: {
    tasks: {
      toArray: () => Promise.resolve([...tasks]),
      clear: () => {
        tasks.length = 0;
        return Promise.resolve();
      },
      bulkAdd: (items: Task[]) => {
        tasks.push(...items);
        return Promise.resolve();
      },
    },
    categories: {
      toArray: () => Promise.resolve([...categories]),
      clear: () => {
        categories.length = 0;
        return Promise.resolve();
      },
      bulkAdd: (items: Category[]) => {
        categories.push(...items);
        return Promise.resolve();
      },
    },
    settings: {
      toArray: () => Promise.resolve([...settings]),
      clear: () => {
        settings.length = 0;
        return Promise.resolve();
      },
      bulkAdd: (items: Setting[]) => {
        settings.push(...items);
        return Promise.resolve();
      },
    },
    transaction: (_mode: string, _t1: unknown, _t2: unknown, _t3: unknown, cb: () => Promise<void>) => cb(),
  },
}));

beforeEach(() => {
  tasks.length = 0;
  categories.length = 0;
  settings.length = 0;
});

describe('export/import data', () => {
  it('exports current db contents', async () => {
    tasks.push({
      id: 't',
      title: 'task',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      status: 'pending',
      checklist: [],
      repeatRule: null,
      createdAt: 0,
      updatedAt: 0,
    });
    const data = await exportData();
    expect(data.tasks).toHaveLength(1);
    expect(data.categories).toHaveLength(0);
  });

  it('imports data by replacing existing records', async () => {
    tasks.push({
      id: 'old',
      title: 'old',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      status: 'pending',
      checklist: [],
      repeatRule: null,
      createdAt: 0,
      updatedAt: 0,
    });
    const data: ExportData = {
      tasks: [
        {
          id: 'new',
          title: 'new',
          dueAt: null,
          durationMin: null,
          categoryId: null,
          status: 'pending',
          checklist: [],
          repeatRule: null,
          createdAt: 0,
          updatedAt: 0,
        },
      ],
      categories: [],
      settings: [],
    };
    await importData(data);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('new');
  });
});
