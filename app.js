// This file is used to register the service worker and subscribe the user to push notifications

// VAPID public key
const vapidPublicKey = "BHCcmFLtKZGN2TknfgzqZT9g6jsszvSYPKT5BTMpFYONcEMphSqCCXtZvMAyMnr8q6hdMDTWeKz3So42lDg7ngc";

// Check for service worker support
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  registerServiceWorker();
} else {
  console.log('Service Worker is not supported');
}

// Register the service worker
function registerServiceWorker() {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service worker registration successful with scope: ', registration.scope);

      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.log('Push messaging is not supported');
        return;
      }

      // Request permission to receive push notifications
      registration.pushManager.subscribe({
        userVisibleOnly: true, // Always show notification when received
        applicationServerKey: vapidPublicKey
      })
        .then((subscription) => {
          console.log('Push messaging subscription successful: ', subscription);

          // Pass the subscription object to the server to be used for sending push notifications
          sendSubscriptionToServer(subscription);
        })
        .catch((error) => {
          console.log('Push messaging subscription failed: ', error);

          // if a different applicationServerKey is used then unsubscribe the user
          registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) {
              subscription.unsubscribe();
            }
          });
        });
    })
    .catch((error) => {
      console.log('Service worker registration failed: ', error);
    });
}


function sendSubscriptionToServer(subscription) {
  // Send the subscription object to the server using fetch() or another HTTP client
  fetch('https://test-pwa-mgvqbg4dp-pasan-nadeeja-dev.vercel.app/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}