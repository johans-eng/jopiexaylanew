"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Invite() {
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  // Create invite code (YOU)
  const createCouple = async () => {
    const newCode = generateCode();

    await setDoc(doc(db, "couples", newCode), {
      users: [auth.currentUser.uid],
      createdAt: new Date()
    });

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      coupleCode: newCode
    });

    setCode(newCode);
  };

  // Join invite code (GIRLFRIEND)
  const joinCouple = async () => {
    const ref = doc(db, "couples", inputCode);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Invalid code");
      return;
    }

    await updateDoc(ref, {
      users: arrayUnion(auth.currentUser.uid)
    });

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      coupleCode: inputCode
    });

    alert("Connected ❤️");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Couple Invite</h2>

        <button onClick={createCouple} style={styles.button}>
          Create Invite Code
        </button>

        {code && (
          <p style={styles.code}>
            Share this code: <b>{code}</b>
          </p>
        )}

        <hr />

        <input
          placeholder="Enter code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          style={styles.input}
        />

        <button onClick={joinCouple} style={styles.button}>
          Join Couple
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
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc"
  },
  button: {
    padding: 10,
    borderRadius: 10,
    background: "#ff4d6d",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  code: {
    textAlign: "center",
    fontSize: 18
  }
};