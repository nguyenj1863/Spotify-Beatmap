import { NextResponse } from "next/server";
import { makePkcePair } from "@/lib/pkce";
import { COOKIE_NAMES, setCookie } from "@/lib/cookies";
import { AUTH_URL } from "@/lib/spotify";

export async function GET() {
  const { codeVerifier, codeChallenge } = await makePkcePair();
  const state = crypto.randomUUID();

  await setCookie(COOKIE_NAMES.pkceVerifier, codeVerifier, 600);
  await setCookie(COOKIE_NAMES.oauthState, state, 600);

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = process.env.SPOTIFY_SCOPES ?? "user-read-email";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    state,
    scope: scopes,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  });

  const url = `${AUTH_URL}?${params.toString()}`;
  return NextResponse.redirect(url);
}
