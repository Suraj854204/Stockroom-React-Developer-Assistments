import api from "@/lib/axios";

// All product-related network calls live here so page/components never
// call axios directly — this is the one place that knows the DummyJSON
// URL shapes.

export async function fetchProducts({ limit, skip, sortBy, order }) {
  const { data } = await api.get("/products", {
    params: { limit, skip, sortBy, order },
  });
  return data; // { products, total, skip, limit }
}

export async function searchProducts({ q, limit, skip, sortBy, order }) {
  const { data } = await api.get("/products/search", {
    params: { q, limit, skip, sortBy, order },
  });
  return data;
}

export async function fetchProductsByCategory({ category, limit, skip, sortBy, order }) {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`, {
    params: { limit, skip, sortBy, order },
  });
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get("/products/categories");
  // DummyJSON has returned this either as an array of strings, or an
  // array of { slug, name, url } objects depending on API version —
  // normalise both into { slug, name }.
  return data.map((c) =>
    typeof c === "string" ? { slug: c, name: c } : { slug: c.slug, name: c.name }
  );
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function addProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
