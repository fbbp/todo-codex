/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown };

const sw = self as unknown as ServiceWorkerGlobalScope;

// precache assets injected by Vite PWA
precacheAndRoute(self.__WB_MANIFEST);

sw.addEventListener('message', (e) => {
  if (e.data?.type === 'SCHEDULE') {
    schedule(e.data.task);
  }
});

function schedule(task: { id: string; title: string; dueAt: number }) {
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
    schedule({ ...task, dueAt: Date.now() + 5 * 60 * 1000 });
    return;
  }
  event.waitUntil(sw.clients.openWindow('/'));
  notification.close();
});

