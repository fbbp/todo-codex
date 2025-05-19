import { describe, it, expect } from 'vitest';
import { db } from '../index';

describe('database schema', () => {
  it('provides task, category and setting tables', () => {
    const names = db.tables.map((t) => t.name).sort();
    expect(names).toEqual(['categories', 'settings', 'tasks']);
  });
});
