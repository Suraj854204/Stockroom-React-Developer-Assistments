"use client";

function getPageNumbers(current, totalPages) {
  // Always show first, last, current, and one neighbour on each side;
  // collapse the rest into ellipses.
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const withGaps = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withGaps.push("…");
    withGaps.push(p);
  });
  return withGaps;
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-ink">{from}–{to}</span> of{" "}
        <span className="font-medium text-ink">{total}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="focus-ring rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-2 text-sm text-muted">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`focus-ring h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${
                  p === page
                    ? "bg-indigo-500 text-white"
                    : "text-ink hover:bg-surface"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="focus-ring rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 text-sm text-muted">
        Rows per page
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="focus-ring rounded-lg border border-border bg-panel px-2 py-1.5 text-ink"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
