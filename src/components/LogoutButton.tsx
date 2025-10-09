"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
	onSuccess?: () => void;
	onError?: (msg: string) => void;
	label?: string;
	className?: string;
	redirectTo?: string;
};

export default function LogoutButton({
	onSuccess,
	onError,
	label = "Log out",
	className = "",
	redirectTo = "/",
}: Props) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [clicking, setClicking] = useState(false);
	const isBusy = pending || clicking;

	const handleLogout = async () => {
		try {
			setClicking(true);
			const res = await fetch("/api/spotify/logout", { method: "POST" });
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || "Logout failed");
			}

			onSuccess?.();
			startTransition(() => {
				router.replace(redirectTo);
				router.refresh();
			});
		} catch (err: any) {
			onError?.(err?.message ?? "Logout failed");
		} finally {
			setClicking(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isBusy}
			aria-busy={isBusy || undefined}
			className={`
				white-glow
				rounded-full border border-white/15 bg-white/10 
				px-4 py-2 text-sm font-semibold text-white
				disabled:opacity-60 disabled:cursor-not-allowed
				focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20
				${className}
			`}
			style={{ minWidth: "6.5rem" }}
		>
			{isBusy ? "Logging out…" : label}
		</button>
	);
}
