import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../db';

describe('TaskCard', () => {
  it('renders task title', () => {
    const task: Task = {
      id: '1',
      title: 'hello',
      dueAt: null,
      durationMin: null,
      categoryId: null,
      status: 'pending',
      checklist: [],
      repeatRule: null,
      createdAt: 0,
      updatedAt: 0,
    };
    const html = renderToString(<TaskCard task={task} />);
    expect(html).toContain('hello');
  });
});
