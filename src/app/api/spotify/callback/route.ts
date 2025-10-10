import { NextResponse } from "next/server";
import { COOKIE_NAMES, getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { exchangeCodeForToken } from "@/lib/spotify";

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const err = searchParams.get("error");

    const base = process.env.BASE_URL

    if (err) return NextResponse.redirect(new URL(`${base}/?error=login_failed`));

    const storedState = await getCookie(COOKIE_NAMES.oauthState);
    const verifier = await getCookie(COOKIE_NAMES.pkceVerifier);

    if (!code || !state || !storedState || state !== storedState || !verifier) return NextResponse.redirect(new URL(`${base}/?error=login_failed`));

    await deleteCookie(COOKIE_NAMES.oauthState);
    await deleteCookie(COOKIE_NAMES.pkceVerifier);

    const tokens = await exchangeCodeForToken(code, verifier);

    await setCookie(COOKIE_NAMES.session, JSON.stringify(tokens), tokens.expires_in);


    const url = new URL(`${base}/dashboard/overview`);
    return NextResponse.redirect(url);
}