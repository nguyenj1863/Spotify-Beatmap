export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center text-white text-center px-6">
			<h1 className="text-6xl font-extrabold text-[#1db954] mb-3 drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]">
				404
			</h1>

			<h2 className="text-2xl font-semibold mb-4">Oops! The music took a little detour...</h2>

			<p className="text-neutral-400 mb-8 leading-relaxed max-w-md">
				Looks like this page decided to{" "}
				<strong className="text-white">dance to its own beat</strong> and wandered off! Don't worry! ~ every great song
				needs a little rest. <br />
				<span className="text-white font-medium">Let's find your rhythm again!</span>
			</p>

			<p className="text-3xl mb-8">٩(•̤̀ᵕ•̤́๑)ᵎᵎᵎᵎ </p>

			<a
				href="/"
				className="spotify-button inline-block rounded-full bg-[#1db954] px-6 py-3 font-semibold text-white shadow-md shadow-[#1db954]/30 transition-all duration-300 hover:bg-green-600 hover:shadow-[0_0_25px_rgba(29,185,84,0.6)] hover:scale-105"
			>
				Back to the Music
			</a>
		</div>
	);
}
