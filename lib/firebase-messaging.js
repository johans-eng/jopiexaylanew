import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "./firebase";

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

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BFGBEabavQHMTD2M7B3Pq60gRX0JjSojLFRCdw0K0HSI3045r4R30SLJaGrbeikwWIOMbx3zYjMFrKd0ykmJmaA",
    });

    return token;
  }
};
