import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCategories } from '../useCategories';
import type { Category } from '../../db';

const categories: Category[] = [];

vi.mock('../../db', () => ({
  db: {
    categories: {
      orderBy: () => ({
        toArray: () => Promise.resolve([...categories].sort((a, b) => a.order - b.order)),
      }),
      add: (cat: Category) => {
        categories.push(cat);
        return Promise.resolve();
      },
      put: (cat: Category) => {
        const idx = categories.findIndex((c) => c.id === cat.id);
        if (idx >= 0) categories[idx] = cat;
        return Promise.resolve();
      },
    },
    transaction: (_mode: string, _table: unknown, cb: () => Promise<void>) => cb(),
  },
}));

describe('useCategories store', () => {
  beforeEach(() => {
    categories.length = 0;
    useCategories.setState({ categories: [] });
  });

  it('adds a category', async () => {
    const draft = { name: 'Work', color: '#ff0000' };
    const id = await useCategories.getState().add(draft);
    expect(id).toBeDefined();
    expect(useCategories.getState().categories).toHaveLength(1);
    expect(useCategories.getState().categories[0].name).toBe('Work');
  });

  it('loads categories sorted by order', async () => {
    categories.push(
      { id: '1', name: 'A', color: '#000', order: 1 },
      { id: '2', name: 'B', color: '#111', order: 0 },
    );
    await useCategories.getState().load();
    const loaded = useCategories.getState().categories;
    expect(loaded[0].id).toBe('2');
    expect(loaded[1].id).toBe('1');
  });

  it('reorders categories', async () => {
    categories.push(
      { id: '1', name: 'A', color: '#000', order: 0 },
      { id: '2', name: 'B', color: '#111', order: 1 },
    );
    useCategories.setState({ categories: [...categories] });
    await useCategories.getState().reorder(['2', '1']);
    expect(categories[0].order).toBe(1);
    expect(categories[1].order).toBe(0);
    const local = useCategories.getState().categories;
    expect(local[0].id).toBe('2');
    expect(local[1].id).toBe('1');
  });
});
