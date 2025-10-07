"use client";
import Image from 'next/image'

type LoginButtonProps = {
  onClick: () => void | Promise<void>;
  isLoading: boolean;
};

export default function LoginButton({ onClick, isLoading }: LoginButtonProps) {
  return (
    <button
      id="loginButton"
      onClick={onClick}
      disabled={isLoading}
      className={`spotify-button w-full flex items-center justify-center gap-3 
                  bg-[#1db954] text-white font-bold py-3 px-6 rounded-full shadow-lg 
                  focus:outline-none focus:ring-4 focus:ring-[#1db954]/50
                  ${
                    isLoading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <Image 
            src='/spotify-logo.svg'
            alt='Spotify Logo'
            width={30}
            height={30}
            className="brightness-0 invert"
        />
      )}
      <span>{isLoading ? "Connecting..." : "Log in with Spotify"}</span>
    </button>
  );
}
