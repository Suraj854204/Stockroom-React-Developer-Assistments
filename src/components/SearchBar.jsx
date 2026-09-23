"use client";

export default function SearchBar({ value, onChange, disabled, disabledHint }) {
  return (
    <div className="w-full sm:max-w-xs">
      <label className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
          ⌕
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Search products…"
          className="focus-ring w-full rounded-lg border border-border bg-panel py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted"
        />
      </label>
      {disabled && disabledHint && (
        <p className="mt-1 text-xs text-muted">{disabledHint}</p>
      )}
    </div>
  );
}
