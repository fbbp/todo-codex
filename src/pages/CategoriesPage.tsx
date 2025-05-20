import { useEffect, useState } from 'react';
import { useCategories } from '../store/useCategories';
import type { Category } from '../db';

interface FormProps {
  initial?: Category;
  onSave: (draft: { name: string; color: string }) => Promise<void>;
  onCancel?: () => void;
}

function CategoryForm({ initial, onSave, onCancel }: FormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? '#000000');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await onSave({ name: trimmed, color });
    if (!initial) {
      setName('');
      setColor('#000000');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="space-y-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
          className="border rounded px-2 py-1"
        />
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="border rounded w-10 h-10 p-0"
      />
      <button
        type="submit"
        className="rounded-full shadow px-4 py-2 font-semibold bg-primary text-white"
      >
        保存
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-sm"
        >
          キャンセル
        </button>
      )}
    </form>
  );
}

export default function CategoriesPage() {
  const categories = useCategories((s) => s.categories);
  const load = useCategories((s) => s.load);
  const add = useCategories((s) => s.add);
  const update = useCategories((s) => s.update);
  const reorder = useCategories((s) => s.reorder);

  const [editing, setEditing] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  function handleDrop(id: string) {
    if (!dragging || dragging === id) return;
    const ids = categories.map((c) => c.id);
    const from = ids.indexOf(dragging);
    const to = ids.indexOf(id);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    void reorder(ids);
    setDragging(null);
  }

  return (
    <div className="space-y-4">
      <CategoryForm onSave={async (draft) => { await add(draft); }} />
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            draggable
            onDragStart={() => setDragging(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(c.id)}
            className="rounded-2xl p-4 shadow-sm bg-white flex items-center gap-2"
          >
            {editing === c.id ? (
              <CategoryForm
                initial={c}
                onSave={(draft) => update(c.id, draft).then(() => setEditing(null))}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <>
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="flex-1">{c.name}</span>
                <button
                  type="button"
                  onClick={() => setEditing(c.id)}
                  className="text-sm text-primary"
                >
                  編集
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
