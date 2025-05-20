import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import PwaPrompt from './PwaPrompt';
import OfflineIndicator from './OfflineIndicator';
import { useKeyboardShortcuts } from '../lib/shortcuts';

export default function Layout() {
  const navigate = useNavigate();
  useKeyboardShortcuts(() => navigate('/task'));
  return (
    <div className="min-h-screen">
      <Navbar />
      <OfflineIndicator />
      <main className="p-4 mx-auto max-w-screen-md">
        <Outlet />
      </main>
      <PwaPrompt />
    </div>
  );
}
