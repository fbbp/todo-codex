import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../store/useTasks';
import { useCategories } from '../store/useCategories';
import { TaskForm } from './TaskForm';

export default function TaskModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tasks = useTasks((s) => s.tasks);
  const loadTasks = useTasks((s) => s.load);
  const loadCategories = useCategories((s) => s.load);

  useEffect(() => {
    void loadTasks();
    void loadCategories();
  }, [loadTasks, loadCategories]);

  const task = id ? tasks.find((t) => t.id === id) : undefined;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-2xl space-y-2 w-80">
        <TaskForm task={task} onSaved={() => navigate(-1)} />
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate(-1)} className="px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
