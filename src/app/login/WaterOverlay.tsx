"use client";

import { useEffect, useRef, useState } from "react";

interface WaterOverlayProps {
  onFinish?: () => void;
}

export default function WaterOverlay({ onFinish }: WaterOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const renderFrame = () => {
      if (video.paused || video.ended) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (g > 110 && g > r * 1.3 && g > b * 1.3) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const handlePlay = () => renderFrame();
    const handleEnded = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFinished(true);
      if (onFinish) onFinish();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);

    video.play().catch(() => {
      setFinished(true);
      if (onFinish) onFinish();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onFinish]);

  if (finished) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <video
        ref={videoRef}
        src="/v1.mp4"
        muted
        playsInline
        preload="auto"
        style={{ display: "none" }}
      />
    </>
  );
}