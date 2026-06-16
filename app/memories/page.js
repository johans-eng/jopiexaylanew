"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { subscribeToForegroundMessages } from "@/lib/firebase-messaging";

export default function Memories() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState(null);

  // 🗑️ delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const longPressTimer = useRef(null);

  const latestCreatedAtRef = useRef(null);

  useEffect(() => {
    signInAnonymously(auth).then((res) => setUser(res.user));
  }, []);

  useEffect(() => {
    if (!user) return;

    let unsub = () => {};

    subscribeToForegroundMessages((payload) => {
      setNotification(payload.notification?.title || "📸 New memory ❤️");
      setTimeout(() => setNotification(null), 3000);
    }).then((u) => (unsub = u));

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

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
  };

  // 🗑️ delete logic
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteDoc(doc(db, "memories", deleteTarget.id));
    setDeleteTarget(null);
  };

  // 🖐️ long press handlers
  const handlePressStart = (item) => {
    longPressTimer.current = setTimeout(() => {
      setDeleteTarget(item);
    }, 600);
  };

  const handlePressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,77,109,0.9)",
            padding: "10px 16px",
            borderRadius: 999,
            zIndex: 9999,
          }}
        >
          {notification}
        </div>
      )}

      {/* header */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "calc(12px + env(safe-area-inset-top))",
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link href="/">
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 16,
            }}
          >
            ← Home
          </button>
        </Link>

        <div style={{ fontWeight: 600 }}>Memories</div>

        <div />
      </div>

      {/* GRID */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 10,
          paddingBottom: 120,
        }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            onMouseDown={() => handlePressStart(p)}
            onMouseUp={handlePressEnd}
            onTouchStart={() => handlePressStart(p)}
            onTouchEnd={handlePressEnd}
            onClick={() => setSelectedImage(p.image)}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              height: 160,
              background: "#111",
              cursor: "pointer",
            }}
          >
            <img
              src={p.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* FLOATING UPLOAD */}
      <label
        style={{
          position: "fixed",
          bottom: 25,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,77,109,0.95)",
          color: "white",
          padding: "12px 18px",
          borderRadius: 999,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      >
        + Upload Memory
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          style={{ display: "none" }}
        />
      </label>

      {/* FULLSCREEN VIEW */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
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
            }}
          />
        </div>
      )}

      {/* 🗑️ DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: 20,
              borderRadius: 16,
              width: 280,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              Delete this memory?
            </div>

            <img
              src={deleteTarget.image}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 15,
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "none",
                  background: "#333",
                  color: "white",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "none",
                  background: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}