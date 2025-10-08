"use client";

import { useCallback, useState } from "react";

type ImageObj = { url: string; width?: number; height?: number };
type Album = { images?: ImageObj[] };
type Artist = { id?: string; name: string };
type Track = { id: string; name: string; album?: Album; artists?: Artist[] };
type TopTracksResponse = { items?: Track[] } | Track[];

export default function DashboardPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTopTracks = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/spotify/top-tracks", { cache: "no-store" });

      // Handle common auth failure -> bounce back to login with an error flag if you want
      if (res.status === 401) {
        setError("Your session expired. Please sign in again.");
        // optional: window.location.href = "/?error=login_failed";
        return;
      }

      const data: TopTracksResponse = await res.json().catch(() => ({ items: [] }));

      if (!res.ok) {
        const msg = (data as any)?.error || `Request failed: ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      const items = Array.isArray(data) ? data : data.items ?? [];
      setTracks(items);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unexpected error fetching tracks.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleGetTopTracks} disabled={loading} className="white-glow">
        {loading ? "Loading..." : "Get Top Tracks"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {tracks.length > 0 && (
        <ol>
          {tracks.map((track) => {
            const img = track.album?.images?.[0]?.url;
            const artists = track.artists?.map((a) => a.name).join(", ") ?? "";
            return (
              <li key={track.id} style={{ display: "flex", gap: 8, margin: "8px 0" }}>
                {img && (
                  <img
                    src={img}
                    alt={`${track.name} cover art`}
                    width={64}
                    height={64}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                )}
                <span>
                  <strong>{track.name}</strong>
                  {artists ? ` — ${artists}` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
