export default function ErrorState({ message = "We couldn't load this.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-50 bg-danger-50/40 px-6 py-16 text-center">
      <h3 className="font-display text-lg font-medium text-danger-600">Something went wrong</h3>
      <p className="max-w-sm text-sm text-ink/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring mt-1 rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-600"
        >
          Retry
        </button>
      )}
    </div>
  );
}
