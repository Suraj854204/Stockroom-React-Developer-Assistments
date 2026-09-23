"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

// Wraps any page that requires login. Waits for the auth check to
// finish before deciding, so we don't flash a redirect on refresh.
export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader label="Checking your session…" />
      </div>
    );
  }

  return children;
}
