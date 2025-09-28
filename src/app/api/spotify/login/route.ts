import { NextResponse } from "next/server";
import { makePkcePair } from "@/lib/pkce";
import { setCookie } from "@/lib/cookies";
import { AUTH_URL } from "@/lib/spotify";

export async function GET() {
  const { codeVerifier, codeChallenge } = await makePkcePair();
  const state = crypto.randomUUID();

  setCookie("sp_pkce_verifier", codeVerifier, 600);
  setCookie("sp_oauth_state", state, 600);

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = process.env.SPOTIFY_SCOPES ?? "user-read-email";

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing env vars: SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  });

  const url = `${AUTH_URL}?${params.toString()}`;
  return NextResponse.redirect(url);
}
