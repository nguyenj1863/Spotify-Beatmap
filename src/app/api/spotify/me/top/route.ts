// app/api/spotify/me/top/route.ts
import { NextResponse } from "next/server";
import { COOKIE_NAMES, getCookie, setCookie } from "@/lib/cookies";
import { isExpired, refreshAccessToken, spotifyFetch } from "@/lib/spotify";
import {
  TIME_RANGES,
  TOP_ITEM_TYPES,
  type TopItemType,
  type TimeRange,
} from "@/types/spotify";

const DEFAULTS = {
  type: "tracks" as TopItemType,
  time_range: "medium_term" as TimeRange,
  limit: 20,
  offset: 0,
} as const;

const TYPE_SET = new Set<TopItemType>(TOP_ITEM_TYPES);
const RANGE_SET = new Set<TimeRange>(TIME_RANGES);

export async function GET(req: Request) {
  // --- Auth/session ---
  const raw = await getCookie(COOKIE_NAMES.session);
  if (!raw) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let session = JSON.parse(raw);
  if (isExpired(session) && session.refresh_token) {
    session = await refreshAccessToken(session.refresh_token);
    await setCookie(COOKIE_NAMES.session, JSON.stringify(session), session.expires_in);
  }

  // --- Query parsing & validation ---
  const { searchParams } = new URL(req.url);

  const type = (searchParams.get("type") ?? DEFAULTS.type) as TopItemType;
  if (!TYPE_SET.has(type)) {
    return NextResponse.json(
      { error: 'Invalid "type". Allowed: "artists", "tracks".' },
      { status: 400 }
    );
  }

  const time_range = (searchParams.get("time_range") ?? DEFAULTS.time_range) as TimeRange;
  if (!RANGE_SET.has(time_range)) {
    return NextResponse.json(
      { error: 'Invalid "time_range". Allowed: "long_term", "medium_term", "short_term".' },
      { status: 400 }
    );
  }

  const limitStr = searchParams.get("limit");
  const limit = limitStr == null ? DEFAULTS.limit : Math.trunc(Number(limitStr));
  if (Number.isNaN(limit) || limit < 1 || limit > 50) {
    return NextResponse.json(
      { error: 'Invalid "limit". Must be an integer between 1 and 50.' },
      { status: 400 }
    );
  }

  const offsetStr = searchParams.get("offset");
  const offset = offsetStr == null ? DEFAULTS.offset : Math.trunc(Number(offsetStr));
  if (Number.isNaN(offset) || offset < 0) {
    return NextResponse.json(
      { error: 'Invalid "offset". Must be an integer >= 0.' },
      { status: 400 }
    );
  }

  // --- Build Spotify request ---
  const qs = new URLSearchParams({
    time_range,
    limit: String(limit),
    offset: String(offset),
  });

  const endpoint = `me/top/${type}?${qs.toString()}`;

  // --- Call Spotify ---
  const data = await spotifyFetch(endpoint, session.access_token);
  return NextResponse.json(data);
}