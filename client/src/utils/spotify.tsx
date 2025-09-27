export async function getSpotifyAuthLink() {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);

    const res = await fetch(`http://127.20.10.3:5000/api/spotify/auth?code_verifier=${encodeURIComponent(codeVerifier)}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    });
    const authLink = await res.json();
    return authLink.authLink;
}

export function redirectToSpotifyAuth(authLink: string) {
    window.location.href = authLink;
}

export function generateCodeVerifier(length: number = 128): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
        codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return codeVerifier;
}
