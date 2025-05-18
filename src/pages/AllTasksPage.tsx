import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../store/useTasks';
import { useEffect } from 'react';

export default function AllTasksPage() {
  const tasks = useTasks((s) => s.tasks);
  const load = useTasks((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <TaskForm />
      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
