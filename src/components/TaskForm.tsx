import { useState, type FormEvent } from 'react';
import { useTasks } from '../store/useTasks';

export function TaskForm() {
  const add = useTasks((s) => s.add);
  const [title, setTitle] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await add({
      title: title.trim(),
      dueAt: null,
      durationMin: null,
      categoryId: null,
      checklist: [],
      repeatRule: null,
    });
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task"
        className="flex-1 border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white"
      >
        Add
      </button>
    </form>
  );
}
