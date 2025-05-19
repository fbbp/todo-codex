import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskCard } from '../TaskCard';
import type { Task, Category } from '../../db';

describe('TaskCard', () => {
  it('renders subtasks and category', () => {
    const task: Task = {
      id: '1',
      title: 'hello',
      dueAt: 0,
      durationMin: null,
      categoryId: 'cat1',
      status: 'pending',
      checklist: [{ id: 'c1', text: 'sub', checked: false }],
      repeatRule: null,
      createdAt: 0,
      updatedAt: 0,
    };
    const category: Category = { id: 'cat1', name: 'Work', color: '#ff0', order: 0 };
    const html = renderToString(<TaskCard task={task} category={category} />);
    expect(html).toContain('sub');
    expect(html).toContain('Work');
  });
});
