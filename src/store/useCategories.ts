import { create } from 'zustand';
import { db, type Category } from '../db';

export interface CategoryDraft {
  name: string;
  color: string;
}

export interface CategoriesStore {
  categories: Category[];
  load: () => Promise<void>;
  add: (draft: CategoryDraft) => Promise<string>;
  update: (id: string, patch: Partial<CategoryDraft>) => Promise<void>;
  reorder: (ids: string[]) => Promise<void>;
}

export const useCategories = create<CategoriesStore>((set, get) => ({
  categories: [],
  async load() {
    const all = await db.categories.orderBy('order').toArray();
    set({ categories: all });
  },
  async add(draft) {
    const id = crypto.randomUUID();
    const order = get().categories.length;
    const category: Category = { id, order, ...draft };
    await db.categories.add(category);
    set({ categories: [...get().categories, category] });
    return id;
  },
  async update(id, patch) {
    const current = get().categories.find((c) => c.id === id);
    if (!current) return;
    const updated: Category = { ...current, ...patch };
    await db.categories.put(updated);
    set({
      categories: get().categories.map((c) => (c.id === id ? updated : c)),
    });
  },
  async reorder(ids) {
    const updates: Category[] = [];
    const current = get().categories;
    const map = new Map(current.map((c) => [c.id, c]));
    ids.forEach((id, index) => {
      const cat = map.get(id);
      if (cat && cat.order !== index) {
        const updated = { ...cat, order: index };
        updates.push(updated);
      }
    });
    await db.transaction('rw', db.categories, async () => {
      for (const cat of updates) {
        await db.categories.put(cat);
      }
    });
    const reordered = ids
      .map((id, index) => {
        const cat = map.get(id)!;
        return { ...cat, order: index };
      });
    set({ categories: reordered });
  },
}));
