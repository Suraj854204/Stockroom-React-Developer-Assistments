"use client";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "rating-desc", label: "Rating (high to low)" },
  { value: "rating-asc", label: "Rating (low to high)" },
];

export default function FilterSortBar({
  categories,
  category,
  onCategoryChange,
  categoryHint,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Category
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="focus-ring rounded-lg border border-border bg-panel px-3 py-2 text-ink"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        {categoryHint && <span className="max-w-[14rem] text-xs text-muted">{categoryHint}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Sort by
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="focus-ring rounded-lg border border-border bg-panel px-3 py-2 text-ink"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export { SORT_OPTIONS };
