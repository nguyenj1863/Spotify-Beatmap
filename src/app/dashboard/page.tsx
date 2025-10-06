'use client'

import { useState } from "react";

type Track = { id: string, name: string, artist: { name: string }[] };

function DashboardPage() {
    const [tracks, setTracks] = useState<Track[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGetTopTracks() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/spotify/top-tracks', { cache: 'no-store' });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                throw new Error(json?.error || `Request failed: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            console.log(data);
            setTracks(data.items ?? data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleGetTopTracks} disabled={loading}>
                {loading ? 'Loading...' : 'Get Top Tracks'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {tracks && (
                <ol>
                    {tracks.map(track => (
                        <li key={track.id}>
                            <img src={track.album?.images?.[0]?.url} alt={track.name} width={64} height={64} />
                            {track.name} - {track.artists?.map(a => a.name).join(', ')}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default DashboardPage;