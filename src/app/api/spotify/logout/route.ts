import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({ message: "Spotify session cleared"});

        res.cookies.set("spotify_access_token", "", {
            path: "/",
            expires: new Date(0),
        });

        res.cookies.set('spotify_refresh_token', '', {
            path: '/',
            expires: new Date(0),
        });

        return res;
    } catch (err) {
        console.error("Error during Spotify logout:", err);
        return NextResponse.json(
            { error: "failed to log out from Spotify" },
            { status: 500 }
        );
    }
}