import { useEffect } from 'react';
import { useTasks } from '../store/useTasks';
import { TimelineBar } from './TimelineBar';

interface Props {
  tasks?: ReturnType<typeof useTasks.getState>['tasks'];
}

export function TodayTimeline({ tasks: override }: Props = {}) {
  const storeTasks = useTasks((s) => s.tasks);
  const load = useTasks((s) => s.load);
  const complete = useTasks((s) => s.complete);
  const tasks = override ?? storeTasks;

  useEffect(() => {
    void load();
  }, [load]);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + 24 * 60 * 60 * 1000;

  const today = tasks
    .filter((t) => t.dueAt !== null && t.dueAt >= start && t.dueAt < end)
    .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));

  return (
    <div className="space-y-4">
      <TimelineBar />
      <ul className="space-y-2">
        {today.map((t) => (
          <li key={t.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={t.status === 'done'}
              onChange={() => complete(t.id)}
              aria-label="complete"
            />
            <span className={t.status === 'done' ? 'line-through text-slate-500' : ''}>
              {t.title}
            </span>
            {t.dueAt && (
              <time
                dateTime={new Date(t.dueAt).toISOString()}
                className="text-sm text-slate-500 ml-auto"
              >
                {new Date(t.dueAt).toLocaleTimeString()}
              </time>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
