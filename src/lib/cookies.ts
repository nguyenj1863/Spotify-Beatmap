import { cookies } from "next/headers";

export const COOKIE_NAMES = {
    pkceVerifier: 'sp_pkce_verifier',
    oauthState: 'sp_oauth_state',
    session: 'sp_session',
} as const;


export const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
}

export function setCookie(name: string, value: string, maxAgeSec?: number) {
    cookies().set({
        name,
        value,
        ...cookieOpts,
        ...(maxAgeSec ? { maxAge: maxAgeSec } : {}),
    });
}

export function getCookie(name: string) {
    return cookies().get(name)?.value;
}

export function deleteCookie(name: string) {
    cookies().delete(name);
}