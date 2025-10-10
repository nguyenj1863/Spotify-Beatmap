"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const navItems = [
    { name: "Overview", href: "/dashboard/overview" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 ml-1">
      <div className="flex min-h-dvh flex-col p-4">
        <div className="mb-6">
          <div className="text-xl font-extrabold tracking-tight text-[#1db954]">
            BeatMap
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:bg-white/10 hover:text-white",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto" />

        <div className="border-t border-white/10 pt-4">
          <LogoutButton redirectTo="/" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
