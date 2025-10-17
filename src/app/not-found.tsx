import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | BeatMap",
  description:
    "Looks like this BeatMap page wandered off the playlist! Explore your top tracks, artists, and recent jams back on the dashboard.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-white text-center px-6">
      <h1 className="text-7xl font-extrabold text-[#1db954] mb-4 drop-shadow-[0_0_20px_rgba(29,185,84,0.5)]">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 max-w-lg">
        Whoa! This page decided to dance to its own beat and wandered off!
      </h2>

      <p className="text-neutral-400 mb-10 leading-relaxed max-w-md">
        Don't hit pause just yet, the next track's waiting for you! <br />
        <span className="text-white font-medium">
          Let's find your rhythm again!
        </span>
      </p>

      <p className="text-3xl mb-10 animate-bounce">٩(•̤̀ᵕ•̤́๑)ᵎᵎᵎᵎ</p>

      <a
        href="/"
        className="spotify-button inline-block rounded-full bg-[#1db954] px-6 py-3 font-semibold text-white shadow-md shadow-[#1db954]/30 transition-all duration-300 hover:bg-green-600 hover:shadow-[0_0_25px_rgba(29,185,84,0.6)] hover:scale-105"
      >
        Back to the Music
      </a>
    </div>
  );
}
