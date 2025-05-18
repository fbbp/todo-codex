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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Notification = {
      permission: 'granted',
      requestPermission: vi.fn(() => Promise.resolve('granted')),
    };
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      configurable: true,
    });
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

  it('schedules reminder via service worker', async () => {
    const postMessage = vi.fn();
    const ready = Promise.resolve({ active: { postMessage } });
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: { ready },
      configurable: true,
    });

    const draft = {
      title: 'due task',
      dueAt: Date.now() + 1000,
      durationMin: null,
      categoryId: null,
      checklist: [],
      repeatRule: null,
    };

    await useTasks.getState().add(draft);
    await ready;
    expect(postMessage).toHaveBeenCalledWith({ type: 'SCHEDULE', task: expect.any(Object) });
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
