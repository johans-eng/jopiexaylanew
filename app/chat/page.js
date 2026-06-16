"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const login = async () => {
      try {
        const res = await signInAnonymously(auth);
        setUser(res.user);
      } catch (err) {
        console.error("Login failed:", err);
      }
    };

    login();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text,
        sender: user.uid,
        createdAt: Date.now(),
      });

      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Link href="/">
        <button
          style={{
            marginBottom: 15,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          ← Home
        </button>
      </Link>

      <h1>❤️ Jopie & Ayla</h1>

      <div
        style={{
          height: 500,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender === user?.uid ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                background:
                  msg.sender === user?.uid ? "#ff4d6d" : "#eee",
                color:
                  msg.sender === user?.uid ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 15,
                display: "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send ❤️
        </button>
      </div>
    </div>
  );
}