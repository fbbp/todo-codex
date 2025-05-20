import { useEffect } from 'react';
import { useTasks } from '../store/useTasks';

interface Props {
  tasks?: ReturnType<typeof useTasks.getState>['tasks'];
}
export function NextTask({ tasks: override }: Props = {}) {
  const storeTasks = useTasks((s) => s.tasks);
  const tasks = override ?? storeTasks;
  const load = useTasks((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  const now = Date.now();
  const next = tasks
    .filter((t) => t.status === 'pending' && t.dueAt && t.dueAt >= now)
    .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0))[0];

  if (!next) {
    return <div className="text-slate-500">今後のタスクはありません</div>;
  }

  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white dark:bg-slate-800 space-y-1">
      <div className="text-xl font-semibold">{next.title}</div>
      {next.dueAt && (
        <time
          dateTime={new Date(next.dueAt).toISOString()}
          className="text-sm text-slate-500"
        >
          {new Date(next.dueAt).toLocaleTimeString()}
        </time>
      )}
    </div>
  );
}
