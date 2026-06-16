"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const startY = useRef(null);

  const [leaving, setLeaving] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [time, setTime] = useState("");

  // clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };

    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const handleStart = (e) => {
    if (leaving) return;
    startY.current = e.touches[0].clientY;
  };

  const handleMove = (e) => {
    if (startY.current === null || leaving) return;

    const diff = startY.current - e.touches[0].clientY;
    if (diff > 0) setTranslateY(-diff);
  };

  const handleEnd = () => {
    if (leaving) return;

    if (translateY < -120) {
      setLeaving(true);
      setTranslateY(-window.innerHeight);

      setTimeout(() => {
        router.push("/password");
      }, 250);
    } else {
      setTranslateY(0);
    }

    startY.current = null;
  };

  return (
    <div
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black", // 🔥 prevents white flash
        overflow: "hidden",
      }}
    >
      {/* background image layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/home-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* blur overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          transform: `translateY(${translateY}px)`,
          transition: leaving ? "transform 0.25s ease-out" : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 300 }}>{time}</div>

        <div style={{ opacity: 0.8, marginTop: 10 }}>
          Swipe up to unlock
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: 60,
            height: 5,
            borderRadius: 10,
            background: "white",
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
}