import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import PwaPrompt from './PwaPrompt';
import OfflineIndicator from './OfflineIndicator';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <OfflineIndicator />
      <main className="p-4">
        <Outlet />
      </main>
      <PwaPrompt />
    </div>
  );
}
