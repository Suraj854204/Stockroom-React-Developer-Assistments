import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
      <p className="font-display text-6xl font-bold text-indigo-500">404</p>
      <h1 className="font-display text-xl font-medium text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/products"
        className="focus-ring mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
      >
        Back to products
      </Link>
    </div>
  );
}
