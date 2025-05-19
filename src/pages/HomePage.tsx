
import { TimelineBar } from '../components/TimelineBar';
import { NextTask } from '../components/NextTask';

export default function HomePage() {
  return (
    <div className="space-y-4 p-4">
      <TimelineBar />
      <NextTask />
    </div>
  );
}
