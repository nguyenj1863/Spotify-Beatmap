'use client';

function LoginButton() {
    function handleClick() {
        window.location.href = '/api/spotify/login';
    };
    return (
        <button
            onClick={handleClick}
        >
            Login with Spotify
        </button>
    );
}

export default LoginButton;