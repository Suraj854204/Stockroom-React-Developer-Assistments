export default function StarRating({ value = 0 }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rating ${value} out of 5`}>
      <span className="text-amber-500">★</span>
      <span className="font-medium text-ink">{rounded.toFixed(1)}</span>
    </span>
  );
}
