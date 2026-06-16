"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const correctPassword = "13-02-2024";

  // preload background instantly (prevents flash)
  useEffect(() => {
    const img = new Image();
    img.src = "/home-bg.png";
  }, []);

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
      }}
    >
      {/* dark overlay only */}
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
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 26 }}>Datum?</div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="13-02-2024"
          style={{
            marginTop: 20,
            padding: 12,
            fontSize: 18,
            borderRadius: 10,
            textAlign: "center",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 15,
            padding: "10px 20px",
            borderRadius: 10,
            background: "white",
            border: "none",
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}