"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import LoginButton from "@components/LoginButton";
import Logo from '@components/Logo';

type MsgType = "info" | "success" | "error";
type Message = { text: string; type: MsgType } | null;

export default function Page() {
  const [message, setMessage] = useState<Message>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  const showMessage = useCallback((text: string, type: MsgType) => {
    setMessage({ text, type });
  }, []);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "login_failed") {
      showMessage("Failed to sign in. Please try again.", "error");

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, showMessage]);

  const simulateLogin = useCallback(async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    window.location.href = "/api/spotify/login";
  }, [isLoggingIn]);

  const getMessageColorClass = (type: MsgType): string =>
    type === "error"
      ? "text-red-400"
      : type === "success"
      ? "text-green-400"
      : "text-blue-400";

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-xl text-white">
      <header className="text-center mb-10">
        <Logo />
        <h1 className="text-3xl font-bold mt-4 text-[#1db954]">Spotify BeatMap</h1>
        <p className="text-gray-300 mt-2">
          Discover your listening habits and future favorites.
        </p>
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center text-gray-100">
          Unlock Your Music Data
        </h2>
        <p className="text-sm text-gray-400 text-center">
          We use your Spotify listening history to generate personalized trends,
          stats, and song predictions.
        </p>

        <LoginButton onClick={simulateLogin} isLoading={isLoggingIn} />
      </div>

      <footer className="mt-8 pt-4 border-t border-white/20 text-center">
        <p className="text-xs text-gray-400">
          This application requires read-only access to your top artists, tracks,
          and saved content.
        </p>

        <div
          className={`mt-4 text-sm font-medium transition-all duration-300 overflow-hidden ${
            message ? "opacity-100 h-auto p-2" : "opacity-0 h-0 p-0"
          }`}
        >
          {message && (
            <p className={getMessageColorClass(message.type)}>{message.text}</p>
          )}
        </div>
      </footer>
    </div>
  );
}
