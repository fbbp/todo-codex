import { create } from 'zustand';
import { db, type Task } from '../db';
import { getNextDueAt } from '../lib/rrule';
import { useSettings } from './useSettings';

export interface TaskDraft {
  title: string;
  dueAt: number | null;
  durationMin: number | null;
  categoryId: string | null;
  checklist: { id: string; text: string; checked: boolean }[];
  repeatRule: string | null;
}

export interface TaskStore {
  tasks: Task[];
  load: () => Promise<void>;
  add: (draft: TaskDraft) => Promise<string>;
  update: (id: string, patch: Partial<TaskDraft>) => Promise<void>;
  complete: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function scheduleReminder(task: Task) {
  if (!task.dueAt || !('serviceWorker' in navigator)) {
    return;
  }

  const { notifyBeforeMin, snoozeMin } = useSettings.getState().settings;
  const remindAt = task.dueAt - notifyBeforeMin * 60 * 1000;

  if (Notification.permission === 'default') {
    void Notification.requestPermission();
  }

  navigator.serviceWorker.ready
    .then((reg) => {
      reg.active?.postMessage({
        type: 'SCHEDULE',
        task: { id: task.id, title: task.title, dueAt: remindAt, snoozeMin },
      });
    })
    .catch(() => {
      // noop
    });
}

export const useTasks = create<TaskStore>((set, get) => ({
  tasks: [],
  async load() {
    const all = await db.tasks.toArray();
    set({ tasks: all });
  },
  async add(draft) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const task: Task = {
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      ...draft,
    };
    await db.tasks.add(task);
    set({ tasks: [...get().tasks, task] });
    scheduleReminder(task);
    return id;
  },

  async update(id, patch) {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    const updated: Task = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
    };
    await db.tasks.put(updated);
    set({
      tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
    });
    scheduleReminder(updated);
  },

  async complete(id: string) {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    const now = Date.now();
    const done = { ...current, status: 'done' as Task['status'], updatedAt: now };
    await db.tasks.put(done);
    set({ tasks: get().tasks.map((t) => (t.id === id ? done : t)) });
    if (current.repeatRule && current.dueAt) {
      const nextDue = getNextDueAt(current.repeatRule, current.dueAt);
      const next: Task = {
        ...current,
        id: crypto.randomUUID(),
        status: 'pending',
        dueAt: nextDue,
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(next);
      set({ tasks: [...get().tasks, next] });
      scheduleReminder(next);
    }
  },

  async remove(id) {
    await db.tasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },
}));
