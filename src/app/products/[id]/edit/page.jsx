"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { fetchCategories, fetchProductById, updateProduct } from "@/lib/api/products";
import { editLocalProduct, getLocalProduct, isLocalId, mergeSingleProduct } from "@/lib/localOverrides";
import { useToast } from "@/context/ToastContext";

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}

function EditProductContent() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  async function load() {
    setStatus("loading");
    try {
      if (isLocalId(id)) {
        const local = getLocalProduct(id);
        if (!local) return setStatus("notfound");
        setProduct(local);
        return setStatus("success");
      }
      const data = await fetchProductById(id);
      const merged = mergeSingleProduct(data);
      if (!merged) return setStatus("notfound");
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

  async function handleSubmit(values) {
    await updateProduct(id, values).catch(() => null);
    editLocalProduct(id, values);
    toast({ message: "Changes saved.", type: "success" });
    router.push(`/products/${id}`);
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link href={`/products/${id}`} className="focus-ring mb-4 inline-block text-sm text-muted hover:text-ink">
          ← Back to product
        </Link>

        {status === "loading" && <Loader />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}
        {status === "notfound" && (
          <EmptyState
            title="Product not found"
            description={`We couldn't find a product with id "${id}".`}
          />
        )}

        {status === "success" && product && (
          <div className="rounded-xl border border-border bg-panel p-6 shadow-subtle sm:p-8">
            <h1 className="font-display text-2xl font-medium text-ink">Edit product</h1>
            <p className="mt-1 text-sm text-muted">Update the details below.</p>
            <div className="mt-6">
              <ProductForm
                initialValues={product}
                categories={categories}
                submitLabel="Save changes"
                onSubmit={handleSubmit}
                onCancel={() => router.push(`/products/${id}`)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
