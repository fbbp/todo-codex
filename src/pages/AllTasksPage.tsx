import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { CategoryBadge } from '../components/CategoryBadge';
import { useTasks } from '../store/useTasks';
import { useCategories } from '../store/useCategories';
import { useEffect, useState } from 'react';

export default function AllTasksPage() {
  const tasks = useTasks((s) => s.tasks);
  const load = useTasks((s) => s.load);
  const categories = useCategories((s) => s.categories);
  const loadCategories = useCategories((s) => s.load);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    void load();
    void loadCategories();
  }, [load, loadCategories]);

  return (
    <div className="space-y-4">
      <TaskForm />
      <div className="flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`px-2 py-1 rounded-full text-sm ${filter === null ? 'bg-primary text-white' : 'bg-slate-200'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <CategoryBadge
            key={c.id}
            category={c}
            selected={filter === c.id}
            onClick={() => setFilter(c.id)}
          />
        ))}
      </div>
      <div className="space-y-2">
        {tasks
          .filter((t) => !filter || t.categoryId === filter)
          .map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              category={categories.find((c) => c.id === t.categoryId)}
            />
          ))}
      </div>
    </div>
  );
}
