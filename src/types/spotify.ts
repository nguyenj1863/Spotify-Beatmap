/** Generic image object used across Spotify entities */
export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

/** Followers metadata (often used on Users/Artists) */
export interface SpotifyFollowers {
  href?: string | null;
  total: number;
}

/** External links (we mostly care about the Spotify link) */
export interface SpotifyExternalUrls {
  spotify?: string;
}

/** Minimal Artist shape used by track listings */
export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls?: SpotifyExternalUrls;
}

/** Minimal Album shape used by track listings */
export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: SpotifyImage[];
  release_date?: string; // ISO date string e.g. "2020-05-01"
  total_tracks?: number;
  external_urls?: SpotifyExternalUrls;
}

/** User profile (what /me returns) */
export interface SpotifyUser {
  id: string;
  display_name?: string;
  followers?: SpotifyFollowers;
  images?: SpotifyImage[];
}

/** Track shape for "top tracks" and similar lists */
export interface SpotifyTrack {
  id: string;
  name: string;
  album?: SpotifyAlbum;
  artists?: SpotifyArtist[];
  external_urls?: SpotifyExternalUrls;
  duration_ms?: number;
  preview_url?: string | null;
}

/** Standard Spotify paging wrapper */
export interface Paging<T> {
  href?: string;
  items: T[];
  limit?: number;
  next?: string | null;
  offset?: number;
  previous?: string | null;
  total?: number;
}

/** Response shape for /me/top/tracks */
export type TopTracksResponse = Paging<SpotifyTrack>;
