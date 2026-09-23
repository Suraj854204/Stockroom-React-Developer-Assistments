export default function EmptyState({
  title = "Nothing here",
  description = "Try adjusting your search or filters.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-panel px-6 py-16 text-center">
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}
