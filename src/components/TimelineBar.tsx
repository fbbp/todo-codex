import { useState, useEffect } from 'react';

export function TimelineBar() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const date = new Date(now);
  const minutes = date.getHours() * 60 + date.getMinutes();
  const percent = (minutes / 1440) * 100;

  return (
    <div className="relative h-2 rounded bg-slate-200">
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-accent"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
