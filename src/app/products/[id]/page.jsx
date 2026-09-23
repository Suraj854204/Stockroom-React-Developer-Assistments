"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import StarRating from "@/components/StarRating";
import ConfirmModal from "@/components/ConfirmModal";
import { fetchProductById, deleteProduct } from "@/lib/api/products";
import { getLocalProduct, isLocalId, mergeSingleProduct, deleteLocalProduct } from "@/lib/localOverrides";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailsPage() {
  return (
    <ProtectedRoute>
      <ProductDetailsContent />
    </ProtectedRoute>
  );
}

function ProductDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | notfound | error
  const [errorMessage, setErrorMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setStatus("loading");
    setErrorMessage("");
    try {
      if (isLocalId(id)) {
        const local = getLocalProduct(id);
        if (!local) {
          setStatus("notfound");
          return;
        }
        setProduct(local);
        setStatus("success");
        return;
      }

      const data = await fetchProductById(id);
      const merged = mergeSingleProduct(data);
      if (!merged) {
        setStatus("notfound");
        return;
      }
      setProduct(merged);
      setStatus("success");
    } catch (err) {
      if (err?.status === 404) {
        setStatus("notfound");
      } else {
        setErrorMessage(err?.message || "Couldn't load this product.");
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    await deleteProduct(id).catch(() => null);
    deleteLocalProduct(id);
    setDeleting(false);
    setConfirmOpen(false);
    toast({ message: `Deleted "${product?.title}".`, type: "success" });
    router.push("/products");
  }

  const images = product?.images?.length ? product.images : product?.thumbnail ? [product.thumbnail] : [];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link href="/products" className="focus-ring mb-4 inline-block text-sm text-muted hover:text-ink">
          ← Back to products
        </Link>

        {status === "loading" && <Loader />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}

        {status === "notfound" && (
          <EmptyState
            title="Product not found"
            description={`We couldn't find a product with id "${id}". It may have been deleted or the link is wrong.`}
            action={
              <Link
                href="/products"
                className="focus-ring mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
              >
                Back to products
              </Link>
            }
          />
        )}

        {status === "success" && product && (
          <div className="overflow-hidden rounded-xl border border-border bg-panel shadow-subtle">
            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[activeImage] || product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => setActiveImage(i)}
                        className={`focus-ring h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border ${
                          i === activeImage ? "border-indigo-500" : "border-border"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium capitalize text-indigo-500">
                  {product.category?.replaceAll("-", " ")}
                </p>
                <h1 className="mt-1 font-display text-2xl font-medium text-ink">{product.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating value={product.rating || 0} />
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
                </div>
                <p className="mt-4 font-display text-3xl font-medium text-ink">
                  ${Number(product.price).toFixed(2)}
                </p>
                {product.brand && <p className="mt-1 text-sm text-muted">by {product.brand}</p>}
                <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>

                <div className="mt-6 flex gap-2">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="focus-ring rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="focus-ring rounded-lg border border-danger-50 px-4 py-2 text-sm font-medium text-danger-500 transition hover:bg-danger-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6 sm:p-8">
              <h2 className="font-display text-lg font-medium text-ink">Reviews</h2>
              {product.reviews?.length ? (
                <div className="mt-4 space-y-4">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{r.reviewerName}</p>
                        <StarRating value={r.rating} />
                      </div>
                      <p className="mt-1 text-sm text-ink/80">{r.comment}</p>
                      {r.date && (
                        <p className="mt-1 text-xs text-muted">
                          {new Date(r.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">No reviews yet.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        open={confirmOpen}
        title={`Delete "${product?.title}"?`}
        description="This removes the product from your catalog view. This can't be undone."
        confirmLabel="Delete"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
