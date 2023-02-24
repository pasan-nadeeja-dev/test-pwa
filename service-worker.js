self.addEventListener('push', (event) => {
  const notification = event.data.json();

  const title = notification.title;
  const options = {
    title: notification.title,
    body: notification.message,
    icon: 'images/smashtaps-favicon.png',
    badge: 'images/smashtaps-logo.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});