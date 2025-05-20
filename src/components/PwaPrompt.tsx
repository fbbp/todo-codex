import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaPrompt() {
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShowInstall(false);
  };

  return (
    <>
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 shadow p-2 flex gap-2">
          {offlineReady && <span>Offline ready</span>}
          {needRefresh && (
            <button type="button" onClick={() => updateServiceWorker(true)} className="underline">
              Update
            </button>
          )}
        </div>
      )}
      {showInstall && (
        <button
          type="button"
          className="fixed bottom-4 left-4 bg-primary text-white px-3 py-1 rounded"
          onClick={install}
        >
          Install App
        </button>
      )}
    </>
  );
}
