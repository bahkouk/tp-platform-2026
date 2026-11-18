"use client";

import React, { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";

const CARD_CSS = `
        /* The card is revealed like water spreading from the splash point */
        .login-card {
          opacity: 0;
          transform: translateY(28px) scale(.94);
          filter: blur(10px);
          clip-path: circle(0% at 22% 100%);
          transition:
            clip-path 1100ms cubic-bezier(.22,1,.36,1),
            transform 1000ms cubic-bezier(.22,1,.36,1),
            filter 800ms ease-out,
            opacity 350ms ease-out;
          will-change: clip-path, transform, filter, opacity;
        }
        .login-card.is-in {
          opacity: 1;
          transform: none;
          filter: blur(0);
          clip-path: circle(150% at 22% 100%);
        }
        /* content follows, one piece after another */
        .login-card > *, .login-card form > * {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 600ms ease-out, transform 700ms cubic-bezier(.22,1,.36,1);
        }
        .login-card.is-in > *, .login-card.is-in form > * { opacity: 1; transform: none; }
        .login-card.is-in > :nth-child(1) { transition-delay: 250ms; }
        .login-card.is-in > :nth-child(2) { transition-delay: 330ms; }
        .login-card.is-in > :nth-child(3) { transition-delay: 0ms; }
        .login-card.is-in form > :nth-child(1) { transition-delay: 420ms; }
        .login-card.is-in form > :nth-child(2) { transition-delay: 500ms; }
        .login-card.is-in form > :nth-child(3) { transition-delay: 580ms; }
        .login-card.is-in form > :nth-child(4) { transition-delay: 660ms; }
        .login-card.is-in > :nth-child(4) { transition-delay: 740ms; }
        .login-card.is-in > :nth-child(5) { transition-delay: 820ms; }
        @media (prefers-reduced-motion: reduce) {
          .login-card, .login-card > *, .login-card form > * { transition-duration: 1ms !important; transition-delay: 0ms !important; }
        }
      `;

export default function LoginPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [showCard, setShowCard] = useState(false);
  const [hideBoy, setHideBoy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const W = 960;
    const H = 540;
    canvas.width = W;
    canvas.height = H;

    let animationFrameId = 0;
    let finished = false;
    let last = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(animationFrameId);
      setHideBoy(true);
      setShowCard(true);
    };

    const renderFrame = (now: number) => {
      if (finished) return;
      animationFrameId = requestAnimationFrame(renderFrame);
      if (now - last < 33) return;
      last = now;

      if (video.readyState < 2) return;

      ctx.drawImage(video, 0, 0, W, H);
      try {
        const frame = ctx.getImageData(0, 0, W, H);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (g > 160 && g > r * 1.4 && g > b * 1.4 && g - Math.max(r, b) > 35) {
            data[i + 3] = 0;
          } else if (g > r && g > b) {
            data[i + 1] = Math.max(r, b);
          }
        }

        ctx.putImageData(frame, 0, 0);
      } catch (e) {
        console.error("Canvas error:", e);
      }
    };

    const SPLASH_AT = 1.7;
    const onTime = () => {
      if (video.currentTime >= SPLASH_AT) {
        setShowCard(true);
        video.removeEventListener("timeupdate", onTime);
      }
    };
    video.addEventListener("timeupdate", onTime);

    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    video
      .play()
      .then(() => {
        animationFrameId = requestAnimationFrame(renderFrame);
      })
      .catch(() => {
        finish();
      });

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", { username, email, password });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/v1.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        className="absolute w-px h-px opacity-0 pointer-events-none"
      />

      <div
        className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-700 ease-out ${
          hideBoy ? "opacity-0" : "opacity-100"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-[780px] max-w-[98vw] h-auto object-contain translate-y-[165px]"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />

      <div
        className={`login-card relative z-10 w-[410px] max-w-[92vw] px-8 py-10 rounded-[28px] bg-[#3d3518]/90 backdrop-blur-md text-white shadow-[0_25px_60px_rgba(0,0,0,0.35)] ${
          showCard ? "is-in" : "pointer-events-none"
        }`}
      >
        <h2 className="text-[32px] font-black tracking-tight text-center text-white mb-1">
          Welcome Back
        </h2>
        <p className="text-[13px] text-[#b8b39e] text-center mb-8">
          Enter your details to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <svg
              className="w-4 h-4 text-[#8c8a80] absolute left-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1c1c1a] text-sm text-white placeholder-[#8c8a80] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
            />
          </div>

          <div className="relative flex items-center">
            <svg
              className="w-4 h-4 text-[#8c8a80] absolute left-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#1c1c1a] text-sm text-white placeholder-[#8c8a80] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
            />
          </div>

          <div className="relative flex items-center">
            <svg
              className="w-4 h-4 text-[#8c8a80] absolute left-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#1c1c1a] text-sm text-white placeholder-[#8c8a80] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[#8c8a80] hover:text-white transition cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl bg-[#FFD700] hover:bg-[#f0ca00] text-black font-bold text-sm shadow-[0_0_25px_rgba(255,215,0,0.35)] transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[10px] text-[#9e9984] uppercase tracking-[0.15em]">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span>Or continue with</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="flex gap-3">
          {/* زر Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/modules" })}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2.5 text-xs font-semibold text-white transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 20.4 7.4 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* زر GitHub */}
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/modules" })}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2.5 text-xs font-semibold text-white transition cursor-pointer"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}