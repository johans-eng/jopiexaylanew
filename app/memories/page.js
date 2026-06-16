"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";

import {
  requestNotificationPermission,
  subscribeToForegroundMessages,
} from "@/lib/firebase-messaging";

export default function Memories() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pushStatus, setPushStatus] = useState("default");
  const latestCreatedAtRef = useRef(null);

  useEffect(() => {
    signInAnonymously(auth).then((res) => {
      setUser(res.user);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPushStatus(Notification.permission);
  }, []);

  const enablePushNotifications = async () => {
    if (!user) return;

    try {
      const token = await requestNotificationPermission();

      if (token) {
        await setDoc(
          doc(db, "tokens", user.uid),
          { token, user: user.uid },
          { merge: true }
        );
        setPushStatus("granted");
        console.log("FCM token saved");
      } else {
        setPushStatus(Notification.permission);
      }
    } catch (err) {
      console.error("Push setup failed:", err);
    }
  };

  useEffect(() => {
    if (!user || Notification.permission !== "granted") return;
    enablePushNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};

    subscribeToForegroundMessages((payload) => {
      setNotification(
        payload.notification?.title || "📸 New memory added ❤️"
      );
      setTimeout(() => setNotification(null), 3000);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "memories"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const newestCreatedAt = data[0]?.createdAt;
        if (
          latestCreatedAtRef.current !== null &&
          newestCreatedAt !== latestCreatedAtRef.current
        ) {
          setNotification("📸 New memory added ❤️");
          setTimeout(() => setNotification(null), 3000);
        }
        latestCreatedAtRef.current = newestCreatedAt;

        setPhotos(data);
      },
      (err) => {
        console.error("Memories listener error:", err);
      }
    );

    return () => unsub();
  }, [user]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jopiexayla");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvwppqrah/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      await addDoc(collection(db, "memories"), {
        image: data.secure_url,
        createdAt: Date.now(),
        sender: user.uid,
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>

      {/* 🔔 NOTIFICATION */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff4d6d",
            color: "white",
            padding: "12px 20px",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/">
          <button>← Home</button>
        </Link>

        <h1>📸 Memories</h1>

        <div style={{ width: 60 }} />
      </div>

      <p style={{ color: "#666", marginBottom: 15 }}>
        Our shared moments ❤️
      </p>

      {pushStatus !== "granted" && (
        <button
          onClick={enablePushNotifications}
          style={{
            marginBottom: 15,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "#ff4d6d",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {pushStatus === "denied"
            ? "Notifications blocked — enable in browser settings"
            : "Enable notifications 🔔"}
        </button>
      )}

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        style={{ marginBottom: 20 }}
      />

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedImage(p.image)}
            style={{
              cursor: "pointer",
              borderRadius: 15,
              overflow: "hidden",
              height: 150,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <img
              src={p.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* FULLSCREEN */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <img
            src={selectedImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}