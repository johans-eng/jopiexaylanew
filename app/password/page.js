"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const correctPassword = "13-02-2024";

  const handleSubmit = () => {
    if (input === correctPassword) {
      router.push("/memories");
    } else {
      alert("Wrong");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/home-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* dark overlay (NOT blur) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          color: "white",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 400 }}>Datum?</h1>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="DD-MM-YYYY"
          style={{
            marginTop: 20,
            padding: 12,
            fontSize: 18,
            borderRadius: 10,
            border: "none",
            textAlign: "center",
            outline: "none",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 15,
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "white",
            color: "black",
            fontWeight: 500,
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}