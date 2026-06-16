"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const controls = useAnimation();
  const startY = useRef(null);

  const [time, setTime] = useState("");

  // live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleEnd = async (e) => {
    if (startY.current === null) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    // swipe UP (iPhone unlock style)
    if (diff > 80) {
      await controls.start({
        y: "-100%",
        opacity: 0,
        transition: { duration: 0.5 },
      });

      router.push("/password");
    }

    startY.current = null;
  };

  return (
    <motion.div
      animate={controls}
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
      {/* blur overlay like iPhone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />

      {/* clock */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: "300" }}>{time}</div>

        <div style={{ fontSize: 16, opacity: 0.8, marginTop: 10 }}>
          Swipe up to unlock
        </div>

        {/* little swipe indicator */}
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
    </motion.div>
  );
}