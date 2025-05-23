// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Request notification permission
function requestNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      initMessaging();
    }
  });
}

// Initialize messaging
function initMessaging() {
  messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
    if (currentToken) {
      // Send token to server
      database.ref(`notificationTokens/${currentToken}`).set(true);
    }
  });

  // Handle incoming messages
  messaging.onMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/assets/logo-192.png',
      data: { url: payload.data.url }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(notificationTitle, notificationOptions);
      });
    } else {
      new Notification(notificationTitle, notificationOptions);
    }
  });
}

// Background notification handler (sw.js)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/admin')
  );
});