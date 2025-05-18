import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../store/useTasks';

export default function TaskModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tasks = useTasks((s) => s.tasks);
  const load = useTasks((s) => s.load);
  const add = useTasks((s) => s.add);
  const update = useTasks((s) => s.update);

  const [title, setTitle] = useState('');

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (id) {
      const t = tasks.find((task) => task.id === id);
      if (t) setTitle(t.title);
    }
  }, [id, tasks]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    if (id) {
      await update(id, { title: trimmed });
    } else {
      await add({
        title: trimmed,
        dueAt: null,
        durationMin: null,
        categoryId: null,
        checklist: [],
        repeatRule: null,
      });
    }
    navigate(-1);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl space-y-2 w-80">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          placeholder="Task title"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="px-3 py-1 rounded">
            Cancel
          </button>
          <button type="submit" className="rounded-full shadow px-4 py-1 font-semibold bg-primary text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
