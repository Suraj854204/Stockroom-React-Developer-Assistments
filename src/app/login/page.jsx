"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/products");
  }, [ready, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // stops repeated clicks from firing repeated requests

    if (!username.trim() || !password.trim()) {
      setError("Enter both a username and a password.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await login(username.trim(), password);
      router.replace("/products");
    } catch (err) {
      setError(
        err?.status === 400 || err?.status === 401
          ? "Wrong username or password."
          : err?.message || "Couldn't log in. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-panel p-8 shadow-panel">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 font-display text-base font-bold text-white">
            S
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-ink">Stockroom</span>
        </div>

        <h1 className="font-display text-2xl font-medium text-ink">Log in</h1>
        <p className="mt-1 text-sm text-muted">Manage the product catalog.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
              placeholder="emilys"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
              placeholder="emilyspass"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Demo credentials — username <code className="rounded bg-surface px-1 py-0.5">emilys</code>, password{" "}
          <code className="rounded bg-surface px-1 py-0.5">emilyspass</code>
        </p>
      </div>
    </div>
  );
}
