import { create } from 'zustand';
import { db, type Task } from '../db';

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
}

function scheduleReminder(task: Task) {
  if (!task.dueAt || !('serviceWorker' in navigator)) {
    return;
  }

  if (Notification.permission === 'default') {
    void Notification.requestPermission();
  }

  navigator.serviceWorker.ready
    .then((reg) => {
      reg.active?.postMessage({ type: 'SCHEDULE', task });
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
}));
