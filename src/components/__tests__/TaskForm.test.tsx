import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
  it('renders input field', () => {
    const html = renderToString(<TaskForm />);
    expect(html).toContain('placeholder="Add task"');
  });
});
