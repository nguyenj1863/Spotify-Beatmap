const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export const AUTH_URL = 'https://accounts.spotify.com/authorize';
export const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export type TokenSet = {
    access_token: string;
    token_type: 'Bearer';
    scope?: string;
    expires_in: number;
    refresh_token?: string;
    obtained_at: number;
}

export async function exchangeCodeForToken(
    code: string, 
    code_verifier: string
): Promise<TokenSet> { 
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier,
    });
    
    const res = await fetch(TOKEN_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Token exchange failed: ${res.status} ${res.statusText}`);
    };
    const json = await res.json();
    const tokenSet: TokenSet = {
        ...json,
        obtained_at: Date.now(),
    };
    return tokenSet;
};

