"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const startX = useRef(null);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    // swipe right
    if (diff > 80) {
      router.push("/password");
    }

    startX.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/home-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontSize: 18,
          opacity: 0.8,
        }}
      >
        Swipe right →
      </div>
    </div>
  );
}