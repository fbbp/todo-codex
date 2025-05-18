import type { Task } from '../db';

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white">
      <div className="text-xl font-semibold">{task.title}</div>
    </div>
  );
}
