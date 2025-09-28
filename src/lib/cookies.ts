import { cookies as nextCookies } from "next/headers";

export const COOKIE_NAMES = {
    pkceVerifier: 'sp_pkce_verifier',
    oauthState: 'sp_oauth_state',
    session: 'sp_session',
} as const;


export const baseOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
}

export async function setCookie(name: string, value: string, maxAgeSec?: number) {
    const store = await nextCookies();
    store.set({
        name,
        value,
        ...baseOpts,
        ...(maxAgeSec ? { maxAge: maxAgeSec } : {})
    })
}

export async function getCookie(name: string) {
    const store = await nextCookies();
    return store.get(name)?.value;
}

export async function deleteCookie(name: string) {
    const store = await nextCookies();
    store.delete(name);
}