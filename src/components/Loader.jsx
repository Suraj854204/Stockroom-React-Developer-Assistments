export default function Loader({ label = "Loading products…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-500"
        role="status"
        aria-label={label}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
