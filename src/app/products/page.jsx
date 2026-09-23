"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterSortBar from "@/components/FilterSortBar";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import ProductTableSkeleton from "@/components/ProductTableSkeleton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import StatsBar from "@/components/StatsBar";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
  deleteProduct,
} from "@/lib/api/products";
import { applyOverrides, deleteLocalProduct, getOverrides } from "@/lib/localOverrides";

const PAGE_SIZES = [10, 20, 50];

function parseParams(searchParams) {
  const rawPage = parseInt(searchParams.get("page"), 10);
  const rawLimit = parseInt(searchParams.get("limit"), 10);
  return {
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    limit: PAGE_SIZES.includes(rawLimit) ? rawLimit : 20,
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "",
  };
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loader />}>
        <ProductsPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { page, limit, q, category, sort } = parseParams(searchParams);

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const requestId = useRef(0);
  // id -> setTimeout handle for an optimistically-deleted product that
  // hasn't been committed to the overrides store yet (undo window).
  const pendingDeleteTimers = useRef(new Map());

  // Keep the search box in sync with the URL when navigating with
  // browser back/forward, without fighting the debounce while typing.
  useEffect(() => {
    setSearchInput(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const updateParams = useCallback(
    (patch, { resetPage = false } = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      if (resetPage) next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Debounced search text -> URL. Selecting a category and typing a
  // search are mutually exclusive here (see README): the DummyJSON API
  // has no endpoint that searches *and* filters by category at once,
  // so starting a search clears any active category.
  useEffect(() => {
    if (debouncedSearch === q) return;
    updateParams(
      { q: debouncedSearch, category: debouncedSearch ? "" : category },
      { resetPage: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    const myRequestId = ++requestId.current;
    setStatus("loading");
    setErrorMessage("");

    const skip = (page - 1) * limit;
    const [sortBy, order] = sort ? sort.split("-") : [undefined, undefined];

    try {
      let data;
      if (q) {
        data = await searchProducts({ q, limit, skip, sortBy, order });
      } else if (category) {
        data = await fetchProductsByCategory({ category, limit, skip, sortBy, order });
      } else {
        data = await fetchProducts({ limit, skip, sortBy, order });
      }

      // A stale response from an earlier, slower request — ignore it so
      // fast typing never lets an old result overwrite a newer one.
      if (myRequestId !== requestId.current) return;

      // ?page=999 on a filter with fewer results: fall back to page 1
      // instead of showing a blank screen.
      if (data.products.length === 0 && page > 1 && data.total > 0) {
        updateParams({ page: 1 });
        return;
      }

      const merged = applyOverrides(data.products, {
        page,
        hasSearch: Boolean(q),
        hasCategory: Boolean(category),
      });
      const overrides = getOverrides();
      const addedCount = page === 1 && !q && !category ? overrides.added.length : 0;

      setProducts(merged);
      setTotal(data.total + addedCount);
      setStatus("success");
    } catch (err) {
      if (myRequestId !== requestId.current) return;
      setErrorMessage(err?.message || "Couldn't load products.");
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, q, category, sort]);

  useEffect(() => {
    load();
  }, [load]);

  function handleDeleteRequest(product) {
    setDeleteTarget(product);
  }

  // Actually persists the deletion (localOverrides + the fire-and-forget
  // API call) once the undo window has passed.
  function commitDelete(id) {
    deleteProduct(id).catch(() => null);
    deleteLocalProduct(id);
    pendingDeleteTimers.current.delete(id);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const product = deleteTarget;
    const index = products.findIndex((p) => p.id === product.id);

    setDeleteTarget(null);
    // Optimistic UI: remove it immediately rather than waiting on a
    // network round trip against an API that won't really persist it.
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setTotal((t) => Math.max(0, t - 1));

    const timer = setTimeout(() => commitDelete(product.id), 5000);
    pendingDeleteTimers.current.set(product.id, timer);

    toast({
      message: `Deleted "${product.title}".`,
      actionLabel: "Undo",
      duration: 5000,
      onAction: () => {
        const pending = pendingDeleteTimers.current.get(product.id);
        if (pending) {
          clearTimeout(pending);
          pendingDeleteTimers.current.delete(product.id);
        }
        setProducts((prev) => {
          const next = [...prev];
          next.splice(Math.min(index, next.length), 0, product);
          return next;
        });
        setTotal((t) => t + 1);
      },
    });
  }

  const categoryHint = q ? "Picking a category will clear your search." : null;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const avgRating = products.length
    ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-medium text-ink">Products</h1>
            <p className="text-sm text-muted">Browse, edit and manage your catalog.</p>
          </div>
          <Link
            href="/products/new"
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
          >
            + Add product
          </Link>
        </div>

        {status === "success" && <StatsBar total={total} outOfStock={outOfStock} avgRating={avgRating} />}

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-panel p-4 sm:flex-row sm:items-end sm:justify-between">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <FilterSortBar
            categories={categories}
            category={category}
            categoryHint={categoryHint}
            onCategoryChange={(next) => {
              setSearchInput("");
              updateParams({ category: next, q: "" }, { resetPage: true });
            }}
            sort={sort}
            onSortChange={(next) => updateParams({ sort: next }, { resetPage: true })}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-panel shadow-subtle">
          {status === "loading" && (
            <>
              <ProductTableSkeleton rows={Math.min(limit, 10)} />
              <ProductCardSkeleton rows={Math.min(limit, 6)} />
            </>
          )}

          {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}

          {status === "success" && products.length === 0 && (
            <EmptyState
              title="No products found"
              description={
                q
                  ? `Nothing matches "${q}". Try a different search term.`
                  : "Try a different category or clear your filters."
              }
            />
          )}

          {status === "success" && products.length > 0 && (
            <>
              <ProductTable
                products={products}
                onDelete={handleDeleteRequest}
                sort={sort}
                onSortChange={(next) => updateParams({ sort: next }, { resetPage: true })}
              />
              <div className="flex flex-col gap-3 p-4 sm:hidden">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onDelete={handleDeleteRequest} />
                ))}
              </div>
              <Pagination
                page={page}
                pageSize={limit}
                total={total}
                onPageChange={(next) => updateParams({ page: next })}
                onPageSizeChange={(next) => updateParams({ limit: next }, { resetPage: true })}
              />
            </>
          )}
        </div>
      </main>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="You'll have a few seconds to undo this from the notification."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
