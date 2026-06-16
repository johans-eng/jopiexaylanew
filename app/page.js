"use client";

import Link from "next/link";

export default function Home() {
  const relationshipStart = new Date("2024-02-13");
  const now = new Date();

  const diffMs = now - relationshipStart;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 25,
          padding: 40,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ fontSize: 70 }}>❤️</div>

        <h1
          style={{
            marginTop: 10,
            marginBottom: 5,
            fontSize: 36,
          }}
        >
          Jopie & Ayla
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          Together since 13 February 2024
        </p>

        <div
          style={{
            background: "#fff0f4",
            borderRadius: 20,
            padding: 25,
            marginBottom: 25,
          }}
        >
          <div style={{ fontSize: 18, color: "#888" }}>
            Together for
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: "bold",
              color: "#ff4d6d",
              marginTop: 10,
            }}
          >
            {totalDays}
          </div>

          <div style={{ fontSize: 20, color: "#555" }}>
            days ❤️
          </div>

          <div
            style={{
              marginTop: 15,
              color: "#777",
            }}
          >
            {years} year{years !== 1 ? "s" : ""} & {remainingDays} days
          </div>
        </div>

        {/* CHAT BUTTON */}
        <Link href="/chat">
          <button
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 15,
              background: "#ff4d6d",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            💬 Open Chat
          </button>
        </Link>

        {/* MEMORIES BUTTON */}
        <Link href="/memories">
          <button
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 15,
              background: "#ff7eb3",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📸 Memories
          </button>
        </Link>

        <div
          style={{
            marginTop: 25,
            color: "#999",
            fontSize: 14,
          }}
        >
          Every moment with you is my favorite ❤️
        </div>
      </div>
    </div>
  );
}