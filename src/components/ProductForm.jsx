"use client";

import { useState } from "react";

function validate(values) {
  const errors = {};
  if (!values.title.trim() || values.title.trim().length < 3) {
    errors.title = "Title needs at least 3 characters.";
  }
  if (!values.category) {
    errors.category = "Pick a category.";
  }
  if (!values.description.trim() || values.description.trim().length < 10) {
    errors.description = "Description needs at least 10 characters.";
  }
  const price = Number(values.price);
  if (!values.price || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }
  const stock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Enter a whole number, 0 or more.";
  }
  if (values.thumbnail && !/^https?:\/\/.+/i.test(values.thumbnail)) {
    errors.thumbnail = "Use a full image URL starting with http(s)://";
  }
  return errors;
}

export default function ProductForm({ initialValues, categories, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    category: initialValues?.category || "",
    description: initialValues?.description || "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    brand: initialValues?.brand || "",
    thumbnail: initialValues?.thumbnail || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guards against double-click submitting twice

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      });
    } catch (err) {
      setSubmitError(err?.message || "Couldn't save this product. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Title</label>
          <input
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="e.g. Essence Mascara Lash Princess"
          />
          {errors.title && <p className="mt-1 text-xs text-danger-500">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-danger-500">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Brand</label>
          <input
            value={values.brand}
            onChange={(e) => update("brand", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="0.00"
          />
          {errors.price && <p className="mt-1 text-xs text-danger-500">{errors.price}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Stock</label>
          <input
            type="number"
            step="1"
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="0"
          />
          {errors.stock && <p className="mt-1 text-xs text-danger-500">{errors.stock}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Thumbnail URL</label>
          <input
            value={values.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="https://…"
          />
          {errors.thumbnail && <p className="mt-1 text-xs text-danger-500">{errors.thumbnail}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="focus-ring w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink"
            placeholder="What is this product?"
          />
          {errors.description && <p className="mt-1 text-xs text-danger-500">{errors.description}</p>}
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{submitError}</p>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
