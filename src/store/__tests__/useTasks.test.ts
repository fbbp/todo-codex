import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTasks } from '../useTasks';
import type { Task } from '../../db';

const tasks: Task[] = [];

vi.mock('../../db', () => ({
  db: {
    tasks: {
      toArray: () => Promise.resolve([...tasks]),
      add: (task: Task) => {
        tasks.push(task);
        return Promise.resolve();
      },
    },
  },
}));

describe('useTasks store', () => {
  beforeEach(() => {
    tasks.length = 0;
  });

  it('adds a task', async () => {
    const draft = {
      title: 'test',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      checklist: [],
      repeatRule: null,
    };
    const id = await useTasks.getState().add(draft);
    expect(id).toBeDefined();
    expect(useTasks.getState().tasks).toHaveLength(1);
    expect(useTasks.getState().tasks[0].title).toBe('test');
  });

  it('loads tasks', async () => {
    tasks.push({
      id: '1',
      title: 'loaded',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      status: 'pending',
      checklist: [],
      repeatRule: null,
      createdAt: 0,
      updatedAt: 0,
    });
    await useTasks.getState().load();
    expect(useTasks.getState().tasks).toHaveLength(1);
    expect(useTasks.getState().tasks[0].title).toBe('loaded');
  });
});
