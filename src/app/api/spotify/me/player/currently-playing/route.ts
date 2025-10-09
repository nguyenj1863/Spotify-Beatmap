import { NextResponse } from 'next/server';
import { COOKIE_NAMES, getCookie, setCookie } from '@/lib/cookies';
import { isExpired, refreshAccessToken, spotifyFetch } from '@/lib/spotify';

export async function GET() {
    const raw = await getCookie(COOKIE_NAMES.session)
    if (!raw) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let session = JSON.parse(raw);

    if(isExpired(session) && session.refresh_token) {
        session =await refreshAccessToken(session.refresh_token);
        await setCookie(COOKIE_NAMES.session, JSON.stringify(session), session.expires_in);
    }

    const data = await spotifyFetch('me/player/currently-playing', session.access_token);
    return NextResponse.json(data);
}