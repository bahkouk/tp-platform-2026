"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Firefly {
  id: number;
  size: number;
  left: number;
  top: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function HomePage() {
  const router = useRouter();
  const [isOff, setIsOff] = useState(true);
  const [isPulling, setIsPulling] = useState(false);
  const [isFlicking, setIsFlicking] = useState(false);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const generated = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 6 + Math.random() * 8,
      delay: -(Math.random() * 8),
    }));
    setFireflies(generated);
  }, []);

  const toggleLamp = () => {
    setIsPulling(false);
    setTimeout(() => setIsPulling(true), 10);

    setIsOff(false);
    setIsFlicking(true);
    
    // غير تشعل اللامپا، كينتقل لصفحة اللوجين التانية أوتوماتيكياً
    setTimeout(() => {
      router.push("/login");
    }, 900);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>) => {
    startYRef.current = e.clientY;
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (startYRef.current === null) return;
    const dy = Math.max(0, Math.min(40, e.clientY - startYRef.current));
    setDragY(dy);
  };

  const handlePointerUp = () => {
    if (startYRef.current === null) return;
    startYRef.current = null;
    setDragY(0);
    toggleLamp();
  };

  return (
    <div className={`lamp-wrapper ${isOff ? "off" : ""}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div id="fireflies">
        {fireflies.map((ff) => (
          <i
            key={ff.id}
            className="ff"
            style={{
              width: `${ff.size}px`,
              height: `${ff.size}px`,
              left: `${ff.left}%`,
              top: `${ff.top}%`,
              opacity: ff.opacity,
              animationDuration: `${ff.duration}s`,
              animationDelay: `${ff.delay}s`,
            }}
          />
        ))}
      </div>

      <div className={`lamp ${isFlicking ? "flick" : ""}`}>
        <svg viewBox="0 0 380 600">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff1a0" stopOpacity=".85" />
              <stop offset=".25" stopColor="#ffd60a" stopOpacity=".5" />
              <stop offset="1" stopColor="#ffc400" stopOpacity=".05" />
            </linearGradient>
            <radialGradient id="pool">
              <stop offset="0" stopColor="#ffd60a" stopOpacity=".6" />
              <stop offset=".6" stopColor="#ffd60a" stopOpacity=".18" />
              <stop offset="1" stopColor="#ffd60a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pole" x1="0" x2="1">
              <stop offset="0" stopColor="#050505" />
              <stop offset=".3" stopColor="#5c5c58" />
              <stop offset=".45" stopColor="#2a2a28" />
              <stop offset="1" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="head" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a4a44" />
              <stop offset=".5" stopColor="#262623" />
              <stop offset="1" stopColor="#0f0f0e" />
            </linearGradient>
            <radialGradient id="brass" cx=".35" cy=".3">
              <stop offset="0" stopColor="#fff0b0" />
              <stop offset=".5" stopColor="#c9a24a" />
              <stop offset="1" stopColor="#6b5420" />
            </radialGradient>
            <filter id="b6" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <ellipse cx="190" cy="562" rx="190" ry="30" fill="url(#pool)" className="glow" />
          <polygon points="150,104 230,104 372,562 8,562" fill="url(#cg)" filter="url(#b6)" className="cone" />
          
          <rect x="184" y="104" width="12" height="436" fill="url(#pole)" />
          <path d="M160 556 Q160 534 190 534 Q220 534 220 556 Z" fill="url(#head)" />
          <path d="M112 86 Q112 16 190 16 Q268 16 268 86 Z" fill="url(#head)" />
          <rect x="114" y="82" width="152" height="10" rx="5" fill="#0d0d0c" />

          <g className="sway">
            <g
              id="cord"
              className={isPulling ? "pull" : ""}
              style={{ transform: dragY ? `translateY(${dragY}px)` : undefined }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                startYRef.current = null;
                setDragY(0);
              }}
            >
              <line x1="252" y1="90" x2="252" y2="272" stroke="#b8a15a" strokeWidth="2.6" strokeDasharray="1.6 2.6" strokeLinecap="round" />
              <circle cx="252" cy="90" r="3" fill="#6b5420" />
              <ellipse cx="252" cy="288" rx="8" ry="14" fill="url(#brass)" />
              <rect x="230" y="60" width="44" height="250" fill="transparent" />
            </g>
          </g>
        </svg>
        <div className="lamp-hint">pull the chain ↓</div>
      </div>
    </div>
  );
}