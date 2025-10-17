// types/spotify.ts

/** ============================================================================
 * Common primitives
 * ============================================================================
 */

/** A timestamp string like "2025-01-31T12:34:56.789Z" or a date like "2025-01-31". */
export type ISO8601String = string;

/** A generic image object used across Spotify entities. */
export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

/** Followers metadata used on users and artists. */
export interface SpotifyFollowers {
  href?: string | null;
  total: number;
}

/** External links. Typically, only the Spotify link is relevant. */
export interface SpotifyExternalUrls {
  spotify?: string;
}

/** A generic key/value bag for external IDs (for example, ISRC, EAN, or UPC). */
export interface SpotifyExternalIds {
  [key: string]: string | undefined;
}

/** ============================================================================
 * Core entities: Artists / Albums / Tracks
 * ============================================================================
 */

/** A full artist. Spotify sometimes returns a simplified artist in lists. */
export interface SpotifyArtist {
  id: string;
  name: string;
  href?: string;
  uri?: string;
  external_urls?: SpotifyExternalUrls;
  images?: SpotifyImage[];
}

/** A simplified artist. Common in list payloads and lacks images/followers. */
export interface SpotifySimplifiedArtist {
  id: string;
  name: string;
  href?: string;
  uri?: string;
  external_urls?: SpotifyExternalUrls;
}

/** A minimal album shape used by track listings. */
export interface SpotifyAlbum {
  id: string;
  name: string;
  /** The album type (for example, "album", "single", or "compilation"). */
  album_type?: string;
  /** The release date. May be "YYYY-MM-DD", "YYYY-MM", or "YYYY". */
  release_date?: ISO8601String;
  /** The precision of the release date (for example, "year", "month", or "day"). */
  release_date_precision?: 'year' | 'month' | 'day';
  total_tracks?: number;
  href?: string;
  uri?: string;
  images?: SpotifyImage[];
  external_urls?: SpotifyExternalUrls;
  available_markets?: string[];
  /** Artists credited on the album when included in track payloads. */
  artists?: SpotifySimplifiedArtist[];
}

/** A full track used in many endpoints, including top tracks. */
export interface SpotifyTrack {
  id: string;
  name: string;
  album?: SpotifyAlbum;
  artists?: (SpotifySimplifiedArtist | SpotifyArtist)[];
  duration_ms?: number;
  explicit?: boolean;
  track_number?: number;
  popularity?: number;
  is_local?: boolean;

  href?: string;
  uri?: string;
  external_urls?: SpotifyExternalUrls;
  /** A preview URL. This may be null and is deprecated in some contexts. */
  preview_url?: string | null;
  available_markets?: string[];
  external_ids?: SpotifyExternalIds;
}

/** A simplified track, common in list payloads such as play history. */
export interface SpotifySimplifiedTrack {
  id: string;
  name: string;
  album?: SpotifyAlbum;
  artists?: SpotifySimplifiedArtist[];
  duration_ms?: number;
  explicit?: boolean;
  track_number?: number;
  is_local?: boolean;

  href?: string;
  uri?: string;
  external_urls?: SpotifyExternalUrls;
  /** A preview URL. This may be null and is deprecated in some contexts. */
  preview_url?: string | null;
  available_markets?: string[];
  external_ids?: SpotifyExternalIds;
}

/** ============================================================================
 * Users
 * ============================================================================
 */

/** A Spotify user profile as returned by /me and related endpoints. */
export interface SpotifyUser {
  id: string;
  display_name?: string;
  images?: SpotifyImage[];
  followers?: SpotifyFollowers;

  href?: string;
  uri?: string;
  external_urls?: SpotifyExternalUrls;
}

/** ============================================================================
 * Paging
 * ============================================================================
 */

/** An offset-based paging wrapper used by many list endpoints. */
export interface Paging<T> {
  href?: string;
  items: T[];
  limit?: number;
  next?: string | null;
  offset?: number;
  previous?: string | null;
  total?: number;
}

/** A cursor object used for cursor-based paging (for example, recently played). */
export interface CursorObject {
  after?: string;
  before?: string;
}

/** A cursor-based paging wrapper used by /me/player/recently-played. */
export interface CursorPaging<T> {
  href?: string;
  limit?: number;
  next?: string | null;
  cursors?: CursorObject;
  total?: number;
  items?: T[];
}

/** ============================================================================
 * User Profile (GET /me)
 * ============================================================================
 * Docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 * - Returns the current user's Spotify profile.
 * - May require scopes such as user-read-email or user-read-private for additional fields.
 */

/* The SpotifyUser interface above represents the /me response shape. */

/** ============================================================================
 * Top Items (GET /me/top/{type})
 * ============================================================================
 * Docs: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 * - Uses offset-based paging (limit, offset).
 * - Valid types are "artists" and "tracks".
 * - Requires the "user-top-read" scope.
 */

/** A response shape for /me/top/tracks. */
export type TopTracksResponse = Paging<SpotifyTrack>;
/** A response shape for /me/top/artists. */
export type TopArtistsResponse = Paging<SpotifyArtist>;
/** A generic response shape for /me/top/{type}. */
export type TopItemsResponse<T extends SpotifyArtist | SpotifyTrack> = Paging<T>;

/** Valid time ranges for top items. */
export const TIME_RANGES = ['long_term', 'medium_term', 'short_term'] as const;
/** A union of valid time ranges for top items. */
export type TimeRange = (typeof TIME_RANGES)[number];

/** Valid item types for top endpoints. */
export const TOP_ITEM_TYPES = ['artists', 'tracks'] as const;
/** A union of valid item types for top endpoints. */
export type TopItemType = (typeof TOP_ITEM_TYPES)[number];

/** Query options for /me/top/{type}. */
export interface TopItemsOptions {
  /** The maximum number of items to return. Valid range is 1–50. Default is 20. */
  limit?: number;
  /** The index of the first item to return. Must be >= 0. Default is 0. */
  offset?: number;
  /** The time range to consider. Default is "medium_term". */
  time_range?: TimeRange;
}

/** ============================================================================
 * Playback (GET /me/player/currently-playing)
 * ============================================================================
 * Docs: https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
 * - Returns the current playback state.
 * - May return null if no track is playing.
 * - Requires the "user-read-currently-playing" scope.
 */

/** Actions that are permitted in the current playback state. */
export interface SpotifyPlaybackActions {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_repeat_track?: boolean;
  toggling_shuffle?: boolean;
  transferring_playback?: boolean;
}

/** The source of playback, such as an album, artist, playlist, or show. */
export interface SpotifyContext {
  /** The context type (for example, "artist", "playlist", "album", or "show"). */
  type?: string;
  href?: string;
  external_urls?: SpotifyExternalUrls;
  uri?: string;
}

/** A device that is playing back content. */
export interface SpotifyDevice {
  id?: string;
  is_active?: boolean;
  is_private_session?: boolean;
  is_restricted?: boolean;
  name?: string;
  /** The device type (for example, "Computer", "Smartphone", or "Speaker"). */
  type?: string;
  volume_percent?: number;
  supports_volume?: boolean;
}

/** A playback state for /me/player/currently-playing. */
export interface SpotifyCurrentlyPlaying {
  device?: SpotifyDevice;
  /** The repeat state: "off", "track", or "context". */
  repeat_state?: 'off' | 'track' | 'context' | string;
  shuffle_state?: boolean;
  context?: SpotifyContext;
  /** The server timestamp in milliseconds. */
  timestamp?: number;
  /** The progress into the currently playing item in milliseconds. */
  progress_ms?: number;
  /** Whether playback is currently active. */
  is_playing: boolean;
  /** The currently playing track, or null if nothing is playing. */
  item: SpotifyTrack | null;
  /** The type of the currently playing item. */
  currently_playing_type: 'track' | 'episode' | 'ad' | string;
  actions?: SpotifyPlaybackActions;
}

/** ============================================================================
 * Recently Played (GET /me/player/recently-played)
 * ============================================================================
 * Docs: https://developer.spotify.com/documentation/web-api/reference/get-recently-played
 * - Uses cursor-based paging (cursors.after / cursors.before).
 * - Returns PlayHistoryObject items with { track, played_at, context }.
 * - Requires the "user-read-recently-played" scope.
 */

/** One item in the user’s play history (PlayHistoryObject). */
export interface PlayHistoryObject {
  /** The track that was played. Spotify may return a full or simplified track. */
  track?: SpotifySimplifiedTrack | SpotifyTrack;
  /** When the track was played (ISO-8601 timestamp). */
  played_at: ISO8601String;
  /** Where the play originated (for example, album, artist, or playlist). */
  context?: SpotifyContext;
}

/** A response for GET /me/player/recently-played. */
export type RecentlyPlayedResponse = CursorPaging<PlayHistoryObject>;

/** Query options for GET /me/player/recently-played. */
export interface RecentlyPlayedItemsOptions {
  /**
   * The maximum number of items to return.
   * Valid range is 1–50. Default is 20.
   * Example: limit=10.
   */
  limit?: number;

  /**
   * A Unix timestamp in milliseconds.
   * Returns all items after (but not including) this cursor position.
   * If `after` is specified, `before` must not be specified.
   * Example: after=1484811043508.
   */
  after?: number;

  /**
   * A Unix timestamp in milliseconds.
   * Returns all items before (but not including) this cursor position.
   * If `before` is specified, `after` must not be specified.
   * Example: before=1484811043508.
   */
  before?: number;
}