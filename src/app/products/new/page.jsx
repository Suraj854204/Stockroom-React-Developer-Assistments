"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { fetchCategories, addProduct } from "@/lib/api/products";
import { addLocalProduct } from "@/lib/localOverrides";
import { useToast } from "@/context/ToastContext";

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <NewProductContent />
    </ProtectedRoute>
  );
}

function NewProductContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  async function handleSubmit(values) {
    // DummyJSON's POST /products/add is a fake endpoint — it accepts
    // the payload and echoes back a response but doesn't persist it.
    // We still call it (so the network flow matches the brief), then
    // save the product locally so it actually shows up in the app.
    await addProduct(values).catch(() => null);
    const created = addLocalProduct({
      ...values,
      rating: 0,
      thumbnail: values.thumbnail || "https://cdn.dummyjson.com/product-images/1/thumbnail.png",
      images: values.thumbnail ? [values.thumbnail] : [],
    });
    toast({ message: `Added "${created.title}".`, type: "success" });
    router.push(`/products/${created.id}`);
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link href="/products" className="focus-ring mb-4 inline-block text-sm text-muted hover:text-ink">
          ← Back to products
        </Link>
        <div className="rounded-xl border border-border bg-panel p-6 shadow-subtle sm:p-8">
          <h1 className="font-display text-2xl font-medium text-ink">Add product</h1>
          <p className="mt-1 text-sm text-muted">Fill in the details below.</p>
          <div className="mt-6">
            <ProductForm
              categories={categories}
              submitLabel="Add product"
              onSubmit={handleSubmit}
              onCancel={() => router.push("/products")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
