import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TimelineBar } from '../TimelineBar';

describe('TimelineBar', () => {
  it('positions current time indicator', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T21:00:00'));
    const html = renderToString(<TimelineBar />);
    expect(html).toContain('left:87.5%');
    vi.useRealTimers();
  });
});
