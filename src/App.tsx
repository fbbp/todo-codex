import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { router } from './routes';
import { useSettings } from './store/useSettings';

export default function App() {
  const theme = useSettings((s) => s.settings.theme);
  const load = useSettings((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return <RouterProvider router={router} />;
}
