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
      put: (task: Task) => {
        const idx = tasks.findIndex((t) => t.id === task.id);
        if (idx >= 0) tasks[idx] = task;
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
    Object.defineProperty(globalThis, 'navigator', { value: {},      writable: true, configurable: true });
    useTasks.setState({ tasks: [] });
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


  it('updates a task', async () => {
    const draft = {
      title: 'update me',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      checklist: [],
      repeatRule: null,
    };
    const id = await useTasks.getState().add(draft);
    await useTasks.getState().update(id, { title: 'updated' });
    expect(useTasks.getState().tasks[0].title).toBe('updated');
  });
    
  it('completes recurring task and creates next one', async () => {
    const now = Date.UTC(2024, 0, 1);
    const draft = {
      title: 'recurring',
      dueAt: now,
      durationMin: null,
      categoryId: null,
      checklist: [],
      repeatRule: 'FREQ=DAILY;INTERVAL=1',
    };
    const id = await useTasks.getState().add(draft);
    await useTasks.getState().complete(id);
    expect(useTasks.getState().tasks).toHaveLength(2);
    const next = useTasks.getState().tasks.find((t) => t.id !== id)!;
    expect(next.dueAt).toBe(now + 24 * 60 * 60 * 1000);
  });
});
