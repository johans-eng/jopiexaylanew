"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("coupleCode", "==", "ABC123"), // replace later dynamically
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Couple Chat</h2>

      {messages.map((m, i) => (
        <div key={i} style={{ margin: 5 }}>
          ❤️ {m.text}
        </div>
      ))}
    </div>
  );
}