import { useEffect, useState, type FormEvent } from 'react';
import { useTasks } from '../store/useTasks';
import { useCategories } from '../store/useCategories';
import { textColor } from '../lib/color';
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
  const [category, setCategory] = useState(task?.categoryId ?? '');
  const [checklist, setChecklist] = useState(
    task?.checklist ?? []
  );
  const [repeat, setRepeat] = useState(task?.repeatRule ?? '');
  const [subText, setSubText] = useState('');

  const categories = useCategories((s) => s.categories);
  const loadCategories = useCategories((s) => s.load);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const draft = {
      title: trimmed,
      dueAt: due ? new Date(due).getTime() : null,
      durationMin: null,
      categoryId: category || null,
      checklist,
      repeatRule: repeat || null,
    } as const;
    if (task) {
      await update(task.id, draft);
    } else {
      await add(draft);
      setTitle('');
      setDue('');
      setChecklist([]);
      setCategory('');
      setRepeat('');
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
        placeholder="タスク名"
        className="w-full border rounded px-2 py-1 focus-ring"
      />
      <input
        type="datetime-local"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="w-full border rounded px-2 py-1 focus-ring"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded px-2 py-1 focus-ring"
      >
        <option value="">カテゴリーなし</option>
        {categories.map((c) => (
          <option
            key={c.id}
            value={c.id}
            style={{
              backgroundColor: c.color,
              color: textColor(c.color) === 'text-white' ? '#fff' : '#000',
            }}
          >
            {c.name}
          </option>
        ))}
      </select>
      <input
        value={repeat}
        onChange={(e) => setRepeat(e.target.value)}
        placeholder="RRULE 例: FREQ=DAILY;INTERVAL=1"
        className="w-full border rounded px-2 py-1 focus-ring"
      />
      {checklist.length > 0 && (
        <ul className="space-y-1">
          {checklist.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.checked}
                onChange={() => toggleSubtask(c.id)}
                className="focus-ring"
              />
              <span className={c.checked ? 'line-through text-slate-500' : ''}>{c.text}</span>
              <button
                type="button"
                onClick={() => removeSubtask(c.id)}
                className="text-danger text-sm focus-ring"
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
          placeholder="サブタスクを追加"
          className="flex-1 border rounded px-2 py-1 focus-ring"
        />
        <button
          type="button"
          onClick={addSubtask}
          className="rounded-full shadow px-4 py-1 font-semibold bg-primary text-white focus-ring"
        >
          追加
        </button>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white focus-ring"
        >
          保存
        </button>
      </div>
    </form>
  );
}
