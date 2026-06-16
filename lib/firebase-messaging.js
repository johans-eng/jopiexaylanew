import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "./firebase";

const VAPID_KEY =
  "BFGBEabavQHMTD2M7B3Pq60gRX0JjSojLFRCdw0K0HSI3045r4R30SLJaGrbeikwWIOMbx3zYjMFrKd0ykmJmaA";

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );
  await navigator.serviceWorker.ready;
  return registration;
}

async function getMessagingInstance() {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
}

export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  const registration = await getServiceWorkerRegistration();
  if (!registration) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token || null;
};

export async function subscribeToForegroundMessages(callback) {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, callback);
}
