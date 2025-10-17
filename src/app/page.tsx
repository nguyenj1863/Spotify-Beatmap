import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "BeatMap - Spotify Listening Analytics",
  description:
    "Sign in with Spotify to explore your listening habits, top tracks, and personalized music analytics on BeatMap.",
  keywords: ["BeatMap", "Spotify", "music analytics", "top tracks", "top artists"],
};

export default function Page() {
  return <HomeClient />;
}
