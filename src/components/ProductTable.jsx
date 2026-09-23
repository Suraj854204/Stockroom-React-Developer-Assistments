"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";

function SortableHeader({ field, label, sort, onSortChange, className = "" }) {
  const [activeField, activeDir] = sort ? sort.split("-") : [null, null];
  const isActive = activeField === field;

  function handleClick() {
    if (!isActive) return onSortChange(`${field}-asc`);
    if (activeDir === "asc") return onSortChange(`${field}-desc`);
    return onSortChange("");
  }

  return (
    <th className={`px-4 py-3 font-medium ${className}`}>
      <button
        onClick={handleClick}
        className="focus-ring inline-flex items-center gap-1 rounded hover:text-ink"
      >
        {label}
        <span className="w-3 text-[10px] leading-none">
          {isActive ? (activeDir === "asc" ? "▲" : "▼") : ""}
        </span>
      </button>
    </th>
  );
}

export default function ProductTable({ products, onDelete, sort, onSortChange }) {
  return (
    <div className="table-scroll hidden sm:block">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="sticky top-16 z-10 border-b border-border bg-panel/95 text-xs uppercase tracking-wide text-muted backdrop-blur">
            <SortableHeader field="title" label="Product" sort={sort} onSortChange={onSortChange} className="sm:px-6" />
            <th className="px-4 py-3 font-medium">Category</th>
            <SortableHeader field="price" label="Price" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="rating" label="Rating" sort={sort} onSortChange={onSortChange} />
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium sm:pr-6"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface">
              <td className="px-4 py-3 sm:px-6">
                <Link href={`/products/${p.id}`} className="focus-ring flex items-center gap-3 rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnail}
                    alt=""
                    className="h-10 w-10 flex-shrink-0 rounded-md border border-border object-cover"
                  />
                  <span className="font-medium text-ink line-clamp-1">{p.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-muted">{p.category?.replaceAll("-", " ")}</td>
              <td className="px-4 py-3 text-ink">${Number(p.price).toFixed(2)}</td>
              <td className="px-4 py-3"><StarRating value={p.rating} /></td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.stock === 0
                      ? "bg-danger-50 text-danger-600"
                      : p.stock < 10
                      ? "bg-amber-50 text-amber-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                </span>
              </td>
              <td className="px-4 py-3 sm:pr-6">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="focus-ring rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink transition hover:bg-surface"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(p)}
                    className="focus-ring rounded-lg border border-danger-50 px-2.5 py-1 text-xs font-medium text-danger-500 transition hover:bg-danger-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
