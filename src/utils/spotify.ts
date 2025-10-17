// utils/spotify.ts
export const SHOW_ARTISTS = 8;
export const SHOW_TRACKS = 12;
export const SHOW_RECENT = 5;

export const TIME_RANGE_LABEL: Record<"short_term"|"medium_term"|"long_term", string> = {
  short_term: "Last 4 Weeks",
  medium_term: "Last 6 Months",
  long_term: "All Time",
};

export const msToHours = (ms: number): number =>
  Math.round((ms / 3_600_000) * 10) / 10;

/** Safely pick a Spotify image closest to target size */
export function getSpotifyImage(
  images?: Array<{ url: string; width?: number | null; height?: number | null }>,
  target = 64
): string | null {
  if (!images?.length) return null;
  const withScore = images.map(img => {
    const w = img.width ?? target;
    const h = img.height ?? target;
    return { url: img.url, score: Math.abs(w - target) + Math.abs(h - target) };
  });
  withScore.sort((a, b) => a.score - b.score);
  return withScore[0]?.url ?? images[0].url ?? null;
}
