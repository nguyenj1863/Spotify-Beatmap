"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useDataFetcher } from "@/hooks/useDataFetcher";
import { formatTime } from "@/utils/formatters";
import { SpotifyService } from "@/lib/spotifyClient";
import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  RecentlyPlayedResponse,
} from "@/types/spotify";
import Logo from "@/components/Logo";
import { BarChartIcon, CalendarIcon, ClockIcon, ExternalLinkIcon, MicIcon, MusicIcon, PlaceholderIcon, PlayIcon, RefreshIcon, TrendUpIcon, UserCircleIcon } from "@/components/icons";
import { Skeleton, LineSkeleton, CardSkeleton } from "@/components/ui/skeletons";
import { SHOW_ARTISTS, SHOW_TRACKS, SHOW_RECENT, msToHours, getSpotifyImage } from "@/utils/spotify";

/* --------------------------------- Page ---------------------------------- */

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("short_term");

  /* Fetchers */
  const profileFetcher = useCallback(() => SpotifyService.getUser(), []);
  const tracksFetcher = useCallback(
    () => SpotifyService.getTopTracks({ limit: SHOW_TRACKS, time_range: timeRange }),
    [timeRange]
  );
  const artistsFetcher = useCallback(
    () => SpotifyService.getTopArtists({ limit: SHOW_ARTISTS, time_range: timeRange }),
    [timeRange]
  );
  const recentFetcher = useCallback(
    () => SpotifyService.getRecentlyPlayed({ limit: 50 }),
    []
  );

  const {
    data: user,
    isLoading: loadingProfile,
    executeFetch: fetchProfile,
  } = useDataFetcher<SpotifyUser | null>(profileFetcher, null);

  const {
    data: topTracks,
    isLoading: loadingTracks,
    error: tracksError,
    executeFetch: fetchTopTracks,
  } = useDataFetcher<SpotifyTrack[]>(tracksFetcher, []);

  const {
    data: topArtists,
    isLoading: loadingArtists,
    error: artistsError,
    executeFetch: fetchTopArtists,
  } = useDataFetcher<SpotifyArtist[]>(artistsFetcher, []);

  const {
    data: recent,
    isLoading: loadingRecent,
    executeFetch: fetchRecent,
  } = useDataFetcher<RecentlyPlayedResponse | null>(recentFetcher, null);

  const [lastProfileFetch, setLastProfileFetch] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* Initial load */
  useEffect(() => {
    const load = async () => {
      const prof = await fetchProfile();
      if (prof) setLastProfileFetch(new Date());
      fetchTopTracks();
      fetchTopArtists();
      fetchRecent?.().catch(() => {});
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Refetch when time range changes */
  useEffect(() => {
    fetchTopTracks();
    fetchTopArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  /* Gentle profile auto-refresh */
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    const tick = () =>
      fetchProfile().then((res) => {
        if (res) setLastProfileFetch(new Date());
      });

    timerRef.current = window.setInterval(() => {
      if (!document.hidden) tick();
    }, 30_000);

    const onVis = () => !document.hidden && tick();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchProfile]);

  /* Manual refresh handler */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchProfile(),
      fetchTopTracks(),
      fetchTopArtists(),
      fetchRecent?.().catch(() => {}),
    ]);
    setLastProfileFetch(new Date());
    setIsRefreshing(false);
  };

  /* ---------- Derived Essentials (from these endpoints only) --------------- */

  // Listening time from last 50 plays
  const totalRecentHours = useMemo(() => {
    if (!recent?.items?.length) return null;
    const ms = recent.items.reduce((acc, it) => acc + (it.track?.duration_ms ?? 0), 0);
    return msToHours(ms);
  }, [recent]);

  // Unique artists from recently played
  const uniqueArtistsCount = useMemo(() => {
    if (!recent?.items?.length) return null;
    const artistIds = new Set<string>();
    recent.items.forEach((item) => {
      item.track?.artists?.forEach((artist) => artistIds.add(artist.id));
    });
    return artistIds.size;
  }, [recent]);

  // Top rank #1
  const topArtist = useMemo(() => topArtists?.[0] ?? null, [topArtists]);
  const topTrack = useMemo(() => topTracks?.[0] ?? null, [topTracks]);

  // Top genre (mode) from top artists
  type ArtistWithGenres = SpotifyArtist & { genres?: string[] };
  const topGenre = useMemo(() => {
    if (!topArtists?.length) return null;
    const counts = new Map<string, number>();
    for (const a of topArtists as ArtistWithGenres[]) {
      (a.genres ?? []).forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1));
    }
    let best: string | null = null;
    let max = -1;
    counts.forEach((n, g) => {
      if (n > max) {
        max = n;
        best = g;
      }
    });
    return best;
  }, [topArtists]);

  // Displayed counts (to keep badges accurate)
  const shownArtists = Math.min(topArtists.length, SHOW_ARTISTS);
  const shownTracks = Math.min(topTracks.length, SHOW_TRACKS);

  /* --------------------------------- UI ----------------------------------- */

  const profileMetaText = useMemo(() => {
    if (!lastProfileFetch) return null;
    return formatTime(lastProfileFetch);
  }, [lastProfileFetch]);

  const timeRangeLabel =
    {
      short_term: "Last 4 Weeks",
      medium_term: "Last 6 Months",
      long_term: "All Time",
    }[timeRange] ?? "Last 4 Weeks";

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:p-6 md:p-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div>
                <Logo
                  className="h-14 w-14"
                  primary="#1DB954"
                  secondary="#191414"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  BeatMap Dashboard
                </h1>
                <p className="mt-1 text-sm text-neutral-400">Your music at a glance</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={clsx(
                  "inline-flex items-center rounded-md border px-3 py-1.5 text-sm",
                  "border-white/10 bg-white/5 hover:bg-white/10 transition",
                  isRefreshing && "cursor-wait opacity-75"
                )}
              >
                <RefreshIcon className={clsx("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </button>

              {loadingProfile && !user ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <LineSkeleton width="w-32" />
                    <LineSkeleton width="w-20" />
                  </div>
                </div>
              ) : user ? (
                <UserChip user={user} />
              ) : null}
            </div>
          </div>

          {profileMetaText && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ClockIcon className="h-3 w-3" />
              <span>Last updated {profileMetaText}</span>
            </div>
          )}
        </header>

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <BarChartIcon className="h-5 w-5 text-[#1db954]" />
            <h2 className="font-semibold">Quick Stats</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Listening Time"
              icon={<ClockIcon className="h-5 w-5 text-white/70" />}
              value={
                totalRecentHours !== null && !Number.isNaN(totalRecentHours) ? (
                  <>
                    {totalRecentHours}
                    <span className="ml-1 text-lg text-neutral-400">hrs</span>
                  </>
                ) : loadingRecent ? (
                  <SkeletonLine />
                ) : (
                  <span className="text-neutral-500">—</span>
                )
              }
              sub="From last 50 plays"
            />

            <StatCard
              label="Top Genre"
              icon={<TrendUpIcon className="h-5 w-5 text-white/70" />}
              value={
                loadingArtists ? (
                  <SkeletonLine />
                ) : topGenre ? (
                  <span className="capitalize">{topGenre}</span>
                ) : (
                  <span className="text-neutral-500">—</span>
                )
              }
              sub={timeRangeLabel}
            />

            <StatCard
              label="Top Artist"
              icon={<MicIcon className="h-5 w-5 text-white/70" />}
              value={
                loadingArtists ? (
                  <SkeletonLine />
                ) : topArtist ? (
                  <span className="truncate inline-block max-w-[12ch] md:max-w-[16ch]" title={topArtist.name}>
                    {topArtist.name}
                  </span>
                ) : (
                  <span className="text-neutral-500">—</span>
                )
              }
              sub={timeRangeLabel}
            />

            <StatCard
              label="Unique Artists"
              icon={<MusicIcon className="h-5 w-5 text-white/70" />}
              value={
                loadingRecent ? (
                  <SkeletonLine />
                ) : uniqueArtistsCount !== null ? (
                  <>{uniqueArtistsCount}</>
                ) : (
                  <span className="text-neutral-500">—</span>
                )
              }
              sub="From last 50 plays"
            />
          </div>
        </section>

        {/* Time Range Selector (no UI libs) */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#1db954]" />
            <h2 className="font-semibold">Time Period</h2>
          </div>
          <div className="inline-flex overflow-hidden rounded-md border border-white/10">
            {(["short_term", "medium_term", "long_term"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setTimeRange(v)}
                className={clsx(
                  "px-3 py-1.5 text-sm transition",
                  "bg-white/5 hover:bg-white/10",
                  timeRange === v && "bg-[#1db954] text-black font-semibold"
                )}
              >
                {v === "short_term" ? "4 Weeks" : v === "medium_term" ? "6 Months" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top Artists */}
          <section className="lg:col-span-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <header className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MicIcon className="h-5 w-5 text-[#1db954]" />
                <h3 className="text-base font-semibold">Top Artists</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                {shownArtists}
              </span>
            </header>
            <div className="p-4 sm:p-5">
              {loadingArtists && topArtists.length === 0 ? (
                <ul className="space-y-3">
                  {Array.from({ length: SHOW_ARTISTS }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
                        <div className="h-2 w-20 rounded bg-white/10 animate-pulse" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : shownArtists > 0 ? (
                <ol className="space-y-2">
                  {topArtists.slice(0, SHOW_ARTISTS).map((a, idx) => {
                    const img = getSpotifyImage(a.images, 48);
                    const artistUrl = (a.external_urls as { spotify?: string } | undefined)?.spotify;
                    return (
                      <li
                        key={a.id}
                        className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
                      >
                        <div className="flex h-6 w-6 items-center justify-center text-xs font-semibold text-neutral-500">
                          {idx + 1}
                        </div>
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 flex-shrink-0">
                          {img ? (
                            <Image
                              src={img}
                              alt={a.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center">
                              <PlaceholderIcon className="h-5 w-5 text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.name}</p>
                          {(a as ArtistWithGenres).genres?.length ? (
                            <p className="truncate text-xs text-neutral-400 capitalize">
                              {(a as ArtistWithGenres).genres!.slice(0, 2).join(", ")}
                            </p>
                          ) : null}
                        </div>
                        {artistUrl ? (
                          <a
                            href={artistUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition"
                            aria-label={`Open ${a.name} on Spotify`}
                          >
                            <ExternalLinkIcon className="h-4 w-4 text-neutral-500" />
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="py-8 text-center">
                  <MicIcon className="mx-auto h-12 w-12 text-neutral-700 mb-3" />
                  <p className="text-sm text-neutral-400">
                    {artistsError || "No top artists available"}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Top Tracks */}
          <section className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <header className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MusicIcon className="h-5 w-5 text-[#1db954]" />
                <h3 className="text-base font-semibold">Top Tracks</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                {shownTracks}
              </span>
            </header>
            <div className="p-4 sm:p-5">
              {loadingTracks && topTracks.length === 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: SHOW_TRACKS }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : shownTracks > 0 ? (
                <ol className="grid gap-3 sm:grid-cols-2">
                  {topTracks.slice(0, SHOW_TRACKS).map((t, idx) => {
                    const trackUrl = (t.external_urls as { spotify?: string } | undefined)?.spotify;
                    return (
                      <li
                        key={t.id}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 hover:border-white/20"
                      >
                        <div className="relative">
                          {t.album?.images?.[0]?.url ? (
                            <Image
                              src={t.album.images[0].url}
                              alt={t.name}
                              width={56}
                              height={56}
                              className="rounded-md object-cover flex-shrink-0"
                              unoptimized
                            />
                          ) : (
                            <div
                              className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-md bg-white/10"
                              aria-label="No album art"
                            >
                              <PlaceholderIcon className="h-5 w-5 text-white/50" />
                            </div>
                          )}
                          <div className="absolute inset-0 grid place-items-center rounded-md bg-black/50 opacity-0 transition group-hover:opacity-100">
                            <PlayIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-neutral-500 mt-0.5">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{t.name}</p>
                              <p className="truncate text-xs text-neutral-400">
                                {(t.artists || []).map((a) => a.name).join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                        {trackUrl ? (
                          <a
                            href={trackUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition"
                            aria-label={`Open ${t.name} on Spotify`}
                          >
                            <ExternalLinkIcon className="h-4 w-4 text-neutral-500" />
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="py-8 text-center">
                  <MusicIcon className="mx-auto h-12 w-12 text-neutral-700 mb-3" />
                  <p className="text-sm text-neutral-400">
                    {tracksError || "No top tracks available"}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recently Played */}
        {recent?.items && recent.items.length > 0 && (
          <section className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <header className="flex items-center gap-2 p-4 sm:p-5 border-b border-white/10">
              <ClockIcon className="h-5 w-5 text-[#1db954]" />
              <h3 className="text-base font-semibold">Recently Played</h3>
            </header>
            <div className="p-4 sm:p-5">
              <div className="space-y-3">
                {recent.items.slice(0, SHOW_RECENT).map((item, idx) => {
                  const track = item.track;
                  if (!track) return null;
                  const playedAt = new Date(item.played_at);
                  const timeAgo = formatTime(playedAt);
                  const url = (track.external_urls as { spotify?: string } | undefined)?.spotify;

                  return (
                    <div
                      key={`${track.id}-${item.played_at}-${idx}`}
                      className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                    >
                      {track.album?.images?.[0]?.url ? (
                        <Image
                          src={track.album.images[0].url}
                          alt={track.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover flex-shrink-0"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-white/10">
                          <PlaceholderIcon className="h-5 w-5 text-white/50" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{track.name}</p>
                        <p className="truncate text-xs text-neutral-400">
                          {(track.artists || []).map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-xs text-neutral-500">{timeAgo}</p>
                        {url ? (
                          <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${track.name} on Spotify`}>
                            <ExternalLinkIcon className="h-4 w-4 text-neutral-500" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="my-8 h-px bg-white/10" />

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>Not affiliated with Spotify AB. For personal use only.</p>
          <nav className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-neutral-300 transition">Privacy</a>
            <a href="/terms" className="hover:text-neutral-300 transition">Terms</a>
            <a href="/support" className="hover:text-neutral-300 transition">Support</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}

/* ---------------------------- Small UI bits ------------------------------- */

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  gradient?: string;
}) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 transition hover:border-white/20")}
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-medium text-neutral-400">{label}</div>
          <div className="opacity-70">{icon}</div>
        </div>
        <div className="mb-1 text-3xl font-bold">{value}</div>
        {sub ? <div className="text-xs text-neutral-500">{sub}</div> : null}
      </div>
    </div>
  );
}

function SkeletonLine() {
  return (
    <span className="inline-block h-7 w-24 rounded bg-white/10 animate-pulse align-middle" />
  );
}

/* ------------------------------- User Chip -------------------------------- */

function UserChip({ user }: { user: SpotifyUser }) {
  const avatar = getSpotifyImage(user.images, 40);
  const followers = (user.followers as { total?: number } | undefined)?.total;
  const profileUrl = (user.external_urls as { spotify?: string } | undefined)?.spotify;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10 ring-2 ring-[#1db954]/20 flex-shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={user.display_name || "User avatar"}
            fill
            className="object-cover"
            sizes="40px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <UserCircleIcon className="h-5 w-5 text-white/60" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {user.display_name || user.id}
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0 text-[10px] font-semibold text-emerald-300">
            Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          {typeof followers === "number" ? (
            <span>{Intl.NumberFormat().format(followers)} followers</span>
          ) : null}
          {profileUrl ? (
            <>
              <span aria-hidden>•</span>
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-neutral-300 transition"
              >
                Profile
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
