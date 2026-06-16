"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const router = useRouter();

  const correctPin = "13022024";

  const [pin, setPin] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/home-bg.png";
  }, []);

  const addDigit = (digit) => {
    if (pin.length >= 8 || showHeart) return;

    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 8) {
      setTimeout(() => {
        if (newPin === correctPin) {
          setShowHeart(true);

          setTimeout(() => {
            setFadeOut(true);
          }, 900);

          setTimeout(() => {
            router.push("/memories");
          }, 1500);
        } else {
          setShake(true);

          setTimeout(() => {
            setShake(false);
            setPin("");
          }, 500);
        }
      }, 150);
    }
  };

  const removeDigit = () => {
    if (showHeart) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const Key = ({ number }) => (
    <button
      onClick={() => addDigit(number)}
      style={{
        width: 78,
        height: 78,
        borderRadius: "50%",
        border: "none",
        background: "rgba(255,255,255,0.15)",
        color: "white",
        fontSize: 32,
        fontWeight: 300,
        cursor: "pointer",
        backdropFilter: "blur(8px)",
      }}
    >
      {number}
    </button>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity .6s ease",
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
          transform: "scale(1.05)",
        }}
      />

      {/* overlay */}
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
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            marginBottom: 30,
          }}
        >
          Datum?
        </div>

        {/* PIN dots */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            animation: shake ? "shake .45s ease" : "none",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background:
                  i < pin.length
                    ? "white"
                    : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 78px)",
            gap: 16,
          }}
        >
          <Key number="1" />
          <Key number="2" />
          <Key number="3" />

          <Key number="4" />
          <Key number="5" />
          <Key number="6" />

          <Key number="7" />
          <Key number="8" />
          <Key number="9" />

          <div />

          <Key number="0" />

          <button
            onClick={removeDigit}
            style={{
              width: 78,
              height: 78,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ⌫
          </button>
        </div>
      </div>

      {/* heart unlock animation */}
      {showHeart && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              fontSize: 90,
              animation: "unlockHeart 1.5s ease-out forwards",
            }}
          >
            ❤️
          </div>
        </div>
      )}

      <style>{`
        @keyframes unlockHeart {
          0% {
            opacity: 0;
            transform: scale(0.2);
          }

          30% {
            opacity: 1;
            transform: scale(1);
          }

          70% {
            opacity: 1;
            transform: scale(2.5);
            filter: drop-shadow(0 0 30px rgba(255,255,255,.8));
          }

          100% {
            opacity: 0;
            transform: scale(4);
            filter: drop-shadow(0 0 60px rgba(255,255,255,1));
          }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}