/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown };

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.skipWaiting();
clientsClaim();

// precache assets injected by Vite PWA
precacheAndRoute(self.__WB_MANIFEST);

// offline fallback for navigation requests
registerRoute(
  ({ request }: { request: Request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'pages' }),
);

sw.addEventListener('message', (e) => {
  if (e.data?.type === 'SCHEDULE') {
    schedule(e.data.task);
  }
});

function schedule(task: { id: string; title: string; dueAt: number; snoozeMin: number }) {
  const diff = task.dueAt - Date.now();
  setTimeout(() => {
    sw.registration.showNotification(
      task.title,
      {
        body: '期限です',
        tag: task.id,
        actions: [{ action: 'snooze', title: '後で' }],
        data: task,
      } as NotificationOptions & { actions: { action: string; title: string }[] }
    );
  }, diff);
}

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  const notification = event.notification;
  const task = notification.data;
  if (event.action === 'snooze') {
    notification.close();
    schedule({ ...task, dueAt: Date.now() + task.snoozeMin * 60 * 1000 });
    return;
  }
  event.waitUntil(sw.clients.openWindow('/'));
  notification.close();
});

