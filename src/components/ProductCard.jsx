"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-panel p-3 shadow-subtle sm:hidden">
      <Link href={`/products/${product.id}`} className="focus-ring flex-shrink-0 rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt=""
          className="h-16 w-16 rounded-lg border border-border object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/products/${product.id}`} className="focus-ring truncate font-medium text-ink">
          {product.title}
        </Link>
        <p className="text-xs capitalize text-muted">{product.category?.replaceAll("-", " ")}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-medium text-ink">${Number(product.price).toFixed(2)}</span>
          <StarRating value={product.rating} />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              product.stock === 0
                ? "bg-danger-50 text-danger-600"
                : product.stock < 10
                ? "bg-amber-50 text-amber-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="focus-ring rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(product)}
              className="focus-ring rounded-lg border border-danger-50 px-2.5 py-1 text-xs font-medium text-danger-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
