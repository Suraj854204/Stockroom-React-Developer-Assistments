export default function StatsBar({ total, outOfStock, avgRating }) {
  const stats = [
    { label: "Products matching filters", value: total },
    { label: "Out of stock on this page", value: outOfStock },
    { label: "Avg. rating on this page", value: avgRating != null ? avgRating.toFixed(1) : "—" },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-panel px-4 py-3 shadow-subtle">
          <p className="font-display text-2xl font-medium text-ink">{s.value}</p>
          <p className="text-xs text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
