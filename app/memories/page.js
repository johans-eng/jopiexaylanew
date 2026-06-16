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
    signInAnonymously(auth).then((res) => setUser(res.user));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPushStatus(Notification.permission);
  }, []);

  const enablePushNotifications = async () => {
    if (!user) return;

    try {
      const token = await requestNotificationPermission();

      if (token) {
        await setDoc(doc(db, "tokens", user.uid), {
          token,
          user: user.uid,
        });
        setPushStatus("granted");
      } else {
        setPushStatus(Notification.permission);
      }
    } catch (err) {
      console.error(err);
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
        payload.notification?.title || "📸 New memory ❤️"
      );
      setTimeout(() => setNotification(null), 3000);
    }).then((unsub) => (unsubscribe = unsub));

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const newest = data[0]?.createdAt;

      if (
        latestCreatedAtRef.current !== null &&
        newest !== latestCreatedAtRef.current
      ) {
        setNotification("📸 New memory added ❤️");
        setTimeout(() => setNotification(null), 3000);
      }

      latestCreatedAtRef.current = newest;
      setPhotos(data);
    });

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
        { method: "POST", body: formData }
      );

      const data = await res.json();

      await addDoc(collection(db, "memories"), {
        image: data.secure_url,
        createdAt: Date.now(),
        sender: user.uid,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "white",
        padding: 20,
        background:
          "linear-gradient(180deg, #0b0b0f 0%, #141421 100%)",
      }}
    >
      {/* 🔔 NOTIFICATION */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,77,109,0.9)",
            backdropFilter: "blur(10px)",
            color: "white",
            padding: "12px 18px",
            borderRadius: 999,
            zIndex: 9999,
            fontWeight: 500,
          }}
        >
          {notification}
        </div>
      )}

      {/* HEADER (glass style) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          marginBottom: 12,
        }}
      >
        <Link href="/">
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ← Home
          </button>
        </Link>

        <div style={{ fontWeight: 600 }}>📸 Memories</div>

        <div style={{ width: 60 }} />
      </div>

      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        Our shared moments ❤️
      </p>

      {/* PUSH BUTTON */}
      {pushStatus !== "granted" && (
        <button
          onClick={enablePushNotifications}
          style={{
            marginBottom: 15,
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "rgba(255,77,109,0.9)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Enable notifications 🔔
        </button>
      )}

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        style={{
          marginBottom: 20,
          padding: 10,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
        }}
      />

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedImage(p.image)}
            style={{
              borderRadius: 18,
              overflow: "hidden",
              height: 160,
              cursor: "pointer",
              position: "relative",
              transform: "scale(1)",
              transition: "transform .2s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onMouseUp={(e) =>
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

            {/* soft gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
              }}
            />
          </div>
        ))}
      </div>

      {/* FULLSCREEN VIEWER */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <img
            src={selectedImage}
            style={{
              maxWidth: "92%",
              maxHeight: "92%",
              borderRadius: 16,
              transform: "scale(1)",
              animation: "pop .25s ease",
            }}
          />

          <style>{`
            @keyframes pop {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}