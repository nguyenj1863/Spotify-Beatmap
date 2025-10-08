"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { formatTime } from "@/utils/formatters";
import { SpotifyService } from "@/lib/spotifyClient";
import type { SpotifyUser, SpotifyTrack } from "@/types/spotify";
import type { BannerState } from "@/types/ui";
import { AvatarSkeleton, LineSkeleton, CardSkeleton } from "@/components/ui/skeleton";

/* ------------------------------ Inline Banner ----------------------------- */
const DashboardBanner: React.FC<{ banner: BannerState | null }> = ({ banner }) => {
  if (!banner) return null;

  const base = "glass-card mb-6 rounded-xl border p-3 text-sm transition-colors";
  const tone =
    banner.type === "error"
      ? "border-red-500/30 text-red-300 bg-red-500/5"
      : banner.type === "success"
      ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/5"
      : "border-blue-500/30 text-blue-300 bg-blue-500/5";

  return (
    <div role="status" aria-live="polite" className={`${base} ${tone}`}>
      {banner.text}
    </div>
  );
};

/* ---------------------------------- Page ---------------------------------- */
const DashboardPage: React.FC = () => {
  // Fetchers (stable)
  const profileFetcher = useCallback(() => SpotifyService.getUser(), []);
  const tracksFetcher = useCallback(() => SpotifyService.getTopTracks(), []);

  const {
    data: user,
    isLoading: loadingProfile,
    error: profileError,
    executeFetch: fetchProfile,
  } = useDataFetcher<SpotifyUser | null>(profileFetcher, null);

  const {
    data: topTracks,
    isLoading: loadingTracks,
    error: tracksError,
    executeFetch: fetchTopTracks,
  } = useDataFetcher<SpotifyTrack[]>(tracksFetcher, []);

  // Local UI state
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [lastProfileFetch, setLastProfileFetch] = useState<Date | null>(null);

  // Initial profile load
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      fetchProfile().then((res) => {
        if (!cancelled && res) setLastProfileFetch(new Date());
      });
    }
    return () => {
      cancelled = true;
    };
  }, [fetchProfile, user]);

  // Visibility-aware periodic refresh (30s)
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    const tick = () =>
      fetchProfile().then((res) => {
        if (res) setLastProfileFetch(new Date());
      });

    timerRef.current = window.setInterval(() => {
      if (!document.hidden) tick();
    }, 30_000);

    const onVis = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchProfile]);

  // Reflect profile errors in banner
  useEffect(() => {
    if (profileError) setBanner({ type: "error", text: profileError });
    else if (banner?.type === "error") setBanner(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileError]);

  // Handlers
  const handleFetchTopTracks = useCallback(async () => {
    setBanner(null);
    const result = await fetchTopTracks();
    if (!result || result.length === 0) {
      setBanner({
        type: "error",
        text: tracksError || "Top tracks not available. Try again shortly.",
      });
    }
  }, [fetchTopTracks, tracksError]);

  // Derived header copy
  const profileMeta = useMemo(() => {
    if (!lastProfileFetch) return null;
    return `Profile last updated: ${formatTime(lastProfileFetch)}${
      loadingProfile && user ? " (Updating…)" : ""
    }`;
  }, [lastProfileFetch, loadingProfile, user]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 text-white">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1db954]">BeatMap Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Your profile, top tracks & artists, playlists, and recents.
          </p>
          {profileMeta && (
            <p className="mt-1 text-xs text-neutral-500" aria-live="polite">
              {profileMeta}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleFetchTopTracks}
          disabled={loadingTracks}
          aria-busy={loadingTracks || undefined}
          className={`spotify-button rounded-full bg-[#1db954] px-4 py-2 text-sm font-semibold shadow
                      focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1db954]/50
                      ${loadingTracks ? "cursor-not-allowed opacity-60" : "hover:bg-green-600"}`}
        >
          {loadingTracks ? "Fetching Tracks…" : "Fetch Top Tracks"}
        </button>
      </header>

      <DashboardBanner banner={banner} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile */}
        <div
          className="glass-card rounded-2xl border border-white/10 p-5 xl:col-span-1"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="mb-4 text-lg font-semibold">
            Profile
          </h2>

          {loadingProfile && !user ? (
            <div className="flex items-center gap-4">
              <AvatarSkeleton size={64} />
              <div className="space-y-2">
                <LineSkeleton width="w-48" />
                <LineSkeleton width="w-28" />
                <LineSkeleton width="w-56" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.images?.[0]?.url ? (
                <Image
                  src={user.images[0].url}
                  alt={user.display_name || user.id}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <div
                  className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-white/50 text-xs"
                  aria-label="No profile image"
                >
                  N/A
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">
                  {user.display_name || user.id}
                </p>
                <p className="text-sm text-neutral-400">
                  Followers: {user.followers?.total ?? 0}
                </p>
                <p className="truncate text-xs text-neutral-500">User ID: {user.id}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">
              {profileError || "No profile loaded yet."}
            </p>
          )}
        </div>

        {/* Top Tracks */}
        <div
          className="glass-card rounded-2xl border border-white/10 p-5 xl:col-span-2"
          aria-labelledby="tracks-heading"
        >
          <h2 id="tracks-heading" className="mb-4 text-lg font-semibold">
            Top Tracks <span className="text-white/40">· {topTracks.length}</span>
          </h2>

          {loadingTracks ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <li key={i}>
                  <CardSkeleton />
                </li>
              ))}
            </ul>
          ) : topTracks.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topTracks.slice(0, 9).map((t) => (
                <li
                  key={t.id}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  {t.album?.images?.[0]?.url ? (
                    <Image
                      src={t.album.images[0].url}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div
                      className="grid h-12 w-12 place-items-center rounded-md bg-white/10 text-white/50 text-xs"
                      aria-label="No album art"
                    >
                      N/A
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">{t.name}</p>
                    <p className="truncate text-xs text-neutral-400">
                      {(t.artists || []).map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">
              {tracksError ||
                'Top tracks not loaded. Click "Fetch Top Tracks" to load the data.'}
            </p>
          )}
        </div>
      </section>

      <p className="mt-8 text-xs text-neutral-500">
        Not affiliated with Spotify AB. For personal use only.
      </p>
    </div>
  );
};

export default DashboardPage;
