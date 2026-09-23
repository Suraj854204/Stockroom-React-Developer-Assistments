export default function ProductCardSkeleton({ rows = 6 }) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border bg-panel p-3">
          <div className="skeleton h-16 w-16 flex-shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
