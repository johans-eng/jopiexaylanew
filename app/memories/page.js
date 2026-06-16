"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { requestNotificationPermission } from "@/lib/firebase-messaging";

export default function Memories() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).then((res) => {
      setUser(res.user);
    });
  }, []);

  useEffect(() => {
    const setup = async () => {
      const token = await requestNotificationPermission();

      if (token) {
        console.log("FCM token:", token);

        await addDoc(collection(db, "tokens"), {
          token,
          user: auth.currentUser?.uid,
        });
      }
    };

    setup();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "memories"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // detect new upload
      if (photos.length > 0 && data[0]?.createdAt !== photos[0]?.createdAt) {
        setNotification("📸 New memory added ❤️");

        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }

      setPhotos(data);
    });

    return () => unsub();
  }, [photos]);

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