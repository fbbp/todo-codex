/// <reference lib="webworker" />

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SCHEDULE') {
    schedule(e.data.task);
  }
});

function schedule(task: { id: string; title: string; dueAt: number }) {
  const diff = task.dueAt - Date.now();
  setTimeout(() => {
    self.registration.showNotification(task.title, {
      body: '期限です',
      tag: task.id,
      actions: [{ action: 'snooze', title: '後で' }],
      data: task,
    });
  }, diff);
}

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const task = notification.data;
  if (event.action === 'snooze') {
    notification.close();
    schedule({ ...task, dueAt: Date.now() + 5 * 60 * 1000 });
    return;
  }
  event.waitUntil(clients.openWindow('/'));
  notification.close();
});

