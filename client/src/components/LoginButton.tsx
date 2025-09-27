import { getSpotifyAuthLink, redirectToSpotifyAuth } from '../utils/spotify'

function LoginButton() {
    async function handleLogin() {
        const authLink = "http://127.20.10.3:5000/api/spotify/auth"
        redirectToSpotifyAuth(authLink);
    };
    return (
        <button onClick={handleLogin}>Login with Spotify</button>
    )
}

export default LoginButton