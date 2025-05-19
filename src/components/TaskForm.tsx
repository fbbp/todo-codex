import { useState, type FormEvent } from 'react';
import { useTasks } from '../store/useTasks';
import type { Task } from '../db';

interface Props {
  task?: Task;
  onSaved?: () => void;
}
export function TaskForm({ task, onSaved }: Props) {
  const add = useTasks((s) => s.add);
  const update = useTasks((s) => s.update);
  const [title, setTitle] = useState(task?.title ?? '');
  const [due, setDue] = useState(
    task?.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : ''
  );
  const [checklist, setChecklist] = useState(
    task?.checklist ?? []
  );
  const [subText, setSubText] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const draft = {
      title: trimmed,
      dueAt: due ? new Date(due).getTime() : null,
      durationMin: null,
      categoryId: null,
      checklist,
      repeatRule: null,
    } as const;
    if (task) {
      await update(task.id, draft);
    } else {
      await add(draft);
      setTitle('');
      setDue('');
      setChecklist([]);
    }
    setSubText('');
    onSaved?.();
  }

  function addSubtask() {
    const text = subText.trim();
    if (!text) return;
    setChecklist([...checklist, { id: crypto.randomUUID(), text, checked: false }]);
    setSubText('');
  }

  function removeSubtask(id: string) {
    setChecklist(checklist.filter((c) => c.id !== id));
  }

  function toggleSubtask(id: string) {
    setChecklist(
      checklist.map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      )
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full border rounded px-2 py-1"
      />
      <input
        type="datetime-local"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="w-full border rounded px-2 py-1"
      />
      {checklist.length > 0 && (
        <ul className="space-y-1">
          {checklist.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.checked}
                onChange={() => toggleSubtask(c.id)}
              />
              <span className={c.checked ? 'line-through text-slate-500' : ''}>{c.text}</span>
              <button
                type="button"
                onClick={() => removeSubtask(c.id)}
                className="text-danger text-sm"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={subText}
          onChange={(e) => setSubText(e.target.value)}
          placeholder="Add subtask"
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          type="button"
          onClick={addSubtask}
          className="rounded-full shadow px-4 py-1 font-semibold bg-primary text-white"
        >
          Add
        </button>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}
