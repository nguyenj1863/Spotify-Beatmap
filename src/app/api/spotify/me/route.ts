import { NextResponse } from "next/server";
import { COOKIE_NAMES, getCookie, setCookie } from "@/lib/cookies";
import { isExpired, refreshAccessToken, spotifyFetch } from "@/lib/spotify";

export async function GET() {
  const noCache = { "Cache-Control": "private, no-store, max-age=0" };

  const raw = await getCookie(COOKIE_NAMES.session);
  if (!raw) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401, headers: noCache });
  }

  let session: any;
  try {
    session = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400, headers: noCache });
  }

  try {
    if (isExpired(session) && session.refresh_token) {
      session = await refreshAccessToken(session.refresh_token);
      await setCookie(COOKIE_NAMES.session, JSON.stringify(session), session.expires_in);
    }
  } catch (e) {
    return NextResponse.json({ error: "Session expired" }, { status: 401, headers: noCache });
  }

  try {
    const me = await spotifyFetch("me", session.access_token);
    return new NextResponse(JSON.stringify(me), {
      status: 200,
      headers: { "Content-Type": "application/json", ...noCache },
    });
  } catch (err: any) {
    const status = err?.status ?? 500;

    if (status === 401 && session.refresh_token) {
      try {
        session = await refreshAccessToken(session.refresh_token);
        await setCookie(COOKIE_NAMES.session, JSON.stringify(session), session.expires_in);
        const me = await spotifyFetch("me", session.access_token);
        return new NextResponse(JSON.stringify(me), {
          status: 200,
          headers: { "Content-Type": "application/json", ...noCache },
        });
      } catch {
        return NextResponse.json({ error: "Session expired" }, { status: 401, headers: noCache });
      }
    }

    if (status === 429) {
      return NextResponse.json(
        { error: "Rate limited by Spotify—please try again shortly." },
        { status, headers: noCache }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch profile from Spotify" },
      { status, headers: noCache }
    );
  }
}
