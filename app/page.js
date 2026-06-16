"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const startY = useRef(null);

  const [leaving, setLeaving] = useState(false);
  const [translateY, setTranslateY] = useState(0);

  const [time, setTime] = useState("");

  // ❤️ counter + heart
  const startDate = new Date("2024-02-13");
  const [daysTogether, setDaysTogether] = useState(0);
  const [yearsDays, setYearsDays] = useState("");
  const [showHeart, setShowHeart] = useState(false);

  // clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };

    updateClock();
    const i = setInterval(updateClock, 1000);
    return () => clearInterval(i);
  }, []);

  // ❤️ animate number
  const animateNumber = (start, end, duration, setter) => {
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (end - start) * eased);

      setter(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // ❤️ trigger heart when finished
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1200);
      }
    };

    requestAnimationFrame(step);
  };

  // ❤️ days together (start from 0 every load)
  useEffect(() => {
    const updateDays = () => {
      const now = new Date();

      const diffTime = now - startDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      setDaysTogether(0);
      animateNumber(0, diffDays, 1200, setDaysTogether);

      const years = Math.floor(diffDays / 365);
      const days = diffDays % 365;

      if (years > 0) {
        setYearsDays(`${years} jaar en ${days} dagen`);
      } else {
        setYearsDays(`${days} dagen`);
      }
    };

    updateDays();
  }, []);

  // swipe start
  const handleStart = (e) => {
    if (leaving) return;
    startY.current = e.touches[0].clientY;
  };

  // swipe move
  const handleMove = (e) => {
    if (startY.current === null || leaving) return;

    const diff = startY.current - e.touches[0].clientY;
    if (diff > 0) setTranslateY(-diff);
  };

  // swipe end
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
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      {/* background */}
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
        {/* ❤️ COUNTER */}
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>
            Dagen samen
          </div>

          <div style={{ fontSize: 42, fontWeight: 600 }}>
            {daysTogether}
          </div>

          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 6 }}>
            {yearsDays}
          </div>
        </div>

        {/* CLOCK */}
        <div style={{ fontSize: 80, fontWeight: 300 }}>{time}</div>

        <div style={{ opacity: 0.8, marginTop: 10 }}>
          Swipe up to unlock
        </div>

        {/* swipe bar */}
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

      {/* ❤️ HEART ANIMATION */}
      {showHeart && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              fontSize: 60,
              animation: "heartFloat 1.2s ease-out forwards",
            }}
          >
            ❤️
          </div>

          <style>{`
            @keyframes heartFloat {
              0% {
                transform: scale(0.5) translateY(40px);
                opacity: 0;
              }
              40% {
                opacity: 1;
              }
              100% {
                transform: scale(2.2) translateY(-120px);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}