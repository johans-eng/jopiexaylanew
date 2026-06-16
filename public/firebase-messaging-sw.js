importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBuJdTBjT7WrnZMb6bn3AwJFsn37fx9tFo",
  authDomain: "jopiexayla.firebaseapp.com",
  projectId: "jopiexayla",
  storageBucket: "jopiexayla.firebasestorage.app",
  messagingSenderId: "541183366451",
  appId: "1:541183366451:web:0a21605e75dc5140301a46",
});

const messaging = firebase.messaging();

// 🔥 THIS is what makes background notifications work
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  self.registration.showNotification(
    payload.notification?.title || "New message",
    {
      body: payload.notification?.body,
      icon: "/icon.png",
    }
  );
});