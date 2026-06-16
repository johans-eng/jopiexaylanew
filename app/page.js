"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { signInAnonymously } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).then((res) => {
      setUser(res.user);
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>❤️ Couple App</h1>

        {user && (
          <p style={styles.subtitle}>
            Your ID: {user.uid.slice(0, 10)}...
          </p>
        )}

        <div style={styles.buttonContainer}>
          <Link style={styles.button} href="/send">
            💌 Send Love
          </Link>

          <Link href="/invite">🔐 Couple Setup</Link>

          <Link style={styles.button} href="/messages">
            📩 Messages
          </Link>
        </div>
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
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)"
  },
  card: {
    background: "white",
    padding: 30,
    borderRadius: 20,
    textAlign: "center",
    width: 300,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: 28,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    color: "gray"
  },
  buttonContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  button: {
    padding: 12,
    borderRadius: 10,
    background: "#ff4d6d",
    color: "white",
    textDecoration: "none",
    textAlign: "center"
  }
};