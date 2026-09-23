"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/products" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-display text-sm font-bold text-white">
            S
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-ink">Stockroom</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted">@{user.username}</p>
            </div>
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            )}
            <button
              onClick={logout}
              className="focus-ring rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
