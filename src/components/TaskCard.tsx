import type { Task } from '../db';

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white space-y-2">
      <div className="flex justify-between items-start">
        <div className="text-xl font-semibold">{task.title}</div>
        {task.dueAt && (
          <time
            dateTime={new Date(task.dueAt).toISOString()}
            className="text-sm text-slate-500"
          >
            {new Date(task.dueAt).toLocaleString()}
          </time>
        )}
      </div>
      {task.checklist.length > 0 && (
        <ul className="space-y-1 pl-4">
          {task.checklist.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <input type="checkbox" checked={c.checked} readOnly />
              <span className={c.checked ? 'line-through text-slate-500' : ''}>
                {c.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
