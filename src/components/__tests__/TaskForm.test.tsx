import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
  it('renders due date field', () => {
    const html = renderToString(<TaskForm />);
    expect(html).toContain('datetime-local');
  });
});
