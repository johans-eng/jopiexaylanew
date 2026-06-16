"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const startY = useRef(null);
  const [leaving, setLeaving] = useState(false);
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
    startY.current = e.touches[0].clientY;
  };

  const handleEnd = async (e) => {
    if (startY.current === null || leaving) return;

    const diff = startY.current - e.changedTouches[0].clientY;

    if (diff > 80) {
      setLeaving(true);

      // small delay prevents white flash
      setTimeout(() => {
        router.push("/password");
      }, 180);
    }

    startY.current = null;
  };

  return (
    <div
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/home-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* blur overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />

      {/* fade out layer during swipe */}
      {leaving && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "black",
            opacity: 0.4,
          }}
        />
      )}

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
        <div style={{ fontSize: 80, fontWeight: 300 }}>{time}</div>
        <div style={{ opacity: 0.8 }}>Swipe up to unlock</div>

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