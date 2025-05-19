
import { TodayTimeline } from '../components/TodayTimeline';
import { NextTask } from '../components/NextTask';

export default function HomePage() {
  return (
    <div className="space-y-4 p-4">
      <TodayTimeline />
      <NextTask />
    </div>
  );
}
