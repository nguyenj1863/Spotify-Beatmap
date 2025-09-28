import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { COOKIE_NAMES, getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { exchangeCodeForToken } from "@/lib/spotify";

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const err = searchParams.get("error");

    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const storedState = await getCookie(COOKIE_NAMES.oauthState);
    const verifier = await getCookie(COOKIE_NAMES.pkceVerifier);

    if (!code || !state || !storedState || state !== storedState || !verifier) {
        return NextResponse.json(
            { error: "Invalid state or missing verifier", code, state, storedState, verifier },
            { status: 400 }
        );
    }

    await deleteCookie(COOKIE_NAMES.oauthState);
    await deleteCookie(COOKIE_NAMES.pkceVerifier);

    const tokens = await exchangeCodeForToken(code, verifier);

    await setCookie(COOKIE_NAMES.session, JSON.stringify(tokens), tokens.expires_in);

    const h = await headers();
    const host  = h.get("x-forwarded-host") ?? h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base  = `${proto}://${host}`;

    const url = new URL(`${base}/dashboard`);
    return NextResponse.redirect(url);
}