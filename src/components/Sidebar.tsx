"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./LogoutButton";
import { NAV_ITEMS } from "@/config/dashboard";

const baseStyles = {
  shell:
    "z-40 flex min-h-dvh flex-col p-4 border-r border-white/10 bg-black/70 backdrop-blur-lg",
  linkBase:
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden",
          {
            "opacity-100 pointer-events-auto": open,
            "opacity-0 pointer-events-none": !open,
          }
        )}
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />

      {/* Sidebar Drawer */}
      <aside
        id="sidebar"
        className={clsx(
          "fixed left-0 top-0 h-dvh w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          baseStyles.shell,
          {
            "translate-x-0": open,
            "-translate-x-full": !open,
          }
        )}
        aria-hidden={!open && typeof window !== "undefined" && window.innerWidth < 1024}
      >
        {/* Header (Logo & Close Button) */}
        <div className="mb-6 flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-extrabold tracking-tight text-[#1db954]">
            BeatMap
          </div>
          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-md px-2 py-1 text-sm text-neutral-300 hover:bg-white/10"
            aria-label="Close navigation sidebar"
          >
            &times;
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1" aria-label="Main dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(baseStyles.linkBase, {
                  "bg-white/10 text-white": isActive,
                  "text-neutral-400 hover:bg-white/10 hover:text-white":
                    !isActive,
                })}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="mt-auto" role="separator" />

        {/* Footer: Logout */}
        <div className="border-t border-white/10 pt-4">
          <LogoutButton redirectTo="/" />
        </div>
      </aside>
    </>
  );
}