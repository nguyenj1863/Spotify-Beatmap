"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard-root flex h-dvh text-white">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-white/10 bg-black/60 p-3 backdrop-blur-lg lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-controls="sidebar"
            aria-expanded={open}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-neutral-300 hover:bg-white/10 lg:hidden"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        {children}
      </main>
    </div>
  );
}