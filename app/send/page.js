"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Send() {
  const [text, setText] = useState("");

  const send = async () => {
    if (!text) return;

    await addDoc(collection(db, "messages"), {
      text,
      from: auth.currentUser.uid,
      createdAt: new Date()
    });

    setText("");
    alert("Sent ❤️");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>💌 Send Love</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something sweet..."
          style={styles.input}
        />

        <button onClick={send} style={styles.button}>
          Send ❤️
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffe4ec"
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 15,
    width: 300,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  input: {
    height: 100,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc"
  },
  button: {
    padding: 12,
    borderRadius: 10,
    background: "#ff4d6d",
    color: "white",
    border: "none"
  }
};