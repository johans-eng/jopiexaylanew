"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const correctPassword = "13022024"; // change this

  const handleSubmit = () => {
    if (password === correctPassword) {
      router.push("/memories");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
        color: "white",
      }}
    >
      <h2>Enter Password</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: 12,
          fontSize: 18,
          marginTop: 20,
          borderRadius: 8,
          border: "none",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          borderRadius: 8,
          backgroundColor: "white",
          color: "black",
          border: "none",
        }}
      >
        Unlock
      </button>
    </div>
  );
}