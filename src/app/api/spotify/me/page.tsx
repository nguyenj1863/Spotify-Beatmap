async function SpotifyMePage() {
    const res = await fetch(`${process.env.BASE_URL}/api/spotify/me`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user data");
    }

    const me = await res.json();

    return (
        <div>
            <h1>Spotify User Info</h1>
            <pre>{JSON.stringify(me, null, 2)}</pre>
        </div>
    );
}

export default SpotifyMePage;