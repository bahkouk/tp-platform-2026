'use client';

import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleTimeUpdate = () => {
      setTime((prev) => prev + 1);
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial window size
    handleResize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    const timeInterval = setInterval(handleTimeUpdate, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearInterval(timeInterval);
    };
  }, []);

  const { width, height } = windowSize;

  const spheres = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 100,
    initialX: Math.random() * width,
    initialY: Math.random() * height,
    initialDelay: Math.random() * 10,
  }));

  const neonGlow = [
    { color: 'rgba(0, 85, 255, 0.3)', x: mousePos.x * 0.02, y: mousePos.y * 0.02 },
    { color: 'rgba(0, 189, 255, 0.2)', x: (width - mousePos.x) * 0.02, y: (height - mousePos.y) * 0.02 },
    { color: 'rgba(42, 0, 230, 0.2)', x: (mousePos.x + width) * 0.01, y: (mousePos.y + height) * 0.01 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,85,255,0.03)_1px,transparent_1px),linear-gradient(45deg,rgba(42,0,230,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Spheres */}
      {spheres.map((sphere) => (
        <div
          key={sphere.id}
          className="absolute rounded-full bg-gradient-to-br from-neon-cyan-500/20 to-neon-blue-500/20 filter blur-32 animate-pulse-glow"
          style={{
            width: sphere.size,
            height: sphere.size,
            left: sphere.initialX,
            top: sphere.initialY,
            animationDelay: `${sphere.initialDelay}s`,
            animationDuration: 8 + Math.random() * 4 + 's',
            transform: `translate(${Math.sin(time * 0.01 + sphere.id) * 20}px, ${Math.cos(time * 0.01 + sphere.id) * 20}px)`,
          }}
        />
      ))}

      {/* Mouse Follow Glow */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonGlow[0].color} 0%, transparent 70%)`,
          opacity: 0.4,
          transition: 'all 0.1s ease-out',
        }}
      />

      {/* Subtle Noise */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm98 66c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-75-36c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm35-13c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm96-64c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 40c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm56-16c.828 0 1.5.672 1.5 1.5v1c0 .828-.672 1.5-1.5 1.5h-1c-.828 0-1.5-.672-1.5-1.5v-1c0-.828.672-1.5 1.5-1.5h1zm-12 40c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm35-13c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM24 66c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm32-24c.828 0 1.5.672 1.5 1.5v1c0 .828-.672 1.5-1.5 1.5h-1c-.828 0-1.5-.672-1.5-1.5v-1c0-.828.672-1.5 1.5-1.5h1z' fill='white' fill-rule='evenodd' fill-opacity="0.03" transform="matrix(1 0 0 1 0 1)" />`
          }}
        />
      </div>
    </div>
  );
}