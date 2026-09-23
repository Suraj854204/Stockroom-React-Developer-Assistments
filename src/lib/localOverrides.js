// DummyJSON's /products/add, PUT and DELETE endpoints are fakes: they
// return a plausible response but never actually change the server's
// data. The next GET still returns the original list.
//
// To make Add / Edit / Delete feel real in this app, we keep a small
// "overrides" layer in localStorage and apply it on top of whatever
// the API returns. This is intentionally simple and is explained in
// the README/NOTES rather than hidden.

const KEY = "spa_product_overrides";
const LOCAL_ID_START = 900000; // keep local-only ids well away from real API ids (1-194)

function read() {
  if (typeof window === "undefined") return { added: [], edited: {}, deletedIds: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { added: [], edited: {}, deletedIds: [] };
  } catch {
    return { added: [], edited: {}, deletedIds: [] };
  }
}

function write(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function getOverrides() {
  return read();
}

export function isLocalId(id) {
  return Number(id) >= LOCAL_ID_START;
}

export function addLocalProduct(product) {
  const state = read();
  const nextId = Math.max(LOCAL_ID_START, ...state.added.map((p) => p.id)) + 1;
  const withId = { ...product, id: nextId, reviews: product.reviews || [] };
  state.added = [withId, ...state.added];
  write(state);
  return withId;
}

export function editLocalProduct(id, patch) {
  const state = read();
  const numId = Number(id);
  if (isLocalId(numId)) {
    state.added = state.added.map((p) => (p.id === numId ? { ...p, ...patch } : p));
  } else {
    state.edited = { ...state.edited, [numId]: { ...(state.edited[numId] || {}), ...patch } };
  }
  write(state);
}

export function deleteLocalProduct(id) {
  const state = read();
  const numId = Number(id);
  if (isLocalId(numId)) {
    state.added = state.added.filter((p) => p.id !== numId);
  } else {
    if (!state.deletedIds.includes(numId)) state.deletedIds.push(numId);
    delete state.edited[numId];
  }
  write(state);
}

export function getLocalProduct(id) {
  const state = read();
  const numId = Number(id);
  const local = state.added.find((p) => p.id === numId);
  return local || null;
}

export function isDeleted(id) {
  const state = read();
  return state.deletedIds.includes(Number(id));
}

// Apply edits + deletions to a page of API results, and (on the
// unfiltered first page) prepend locally-added products so they show
// up straight away.
export function applyOverrides(products, { page, hasSearch, hasCategory }) {
  const state = read();
  let list = products
    .filter((p) => !state.deletedIds.includes(p.id))
    .map((p) => (state.edited[p.id] ? { ...p, ...state.edited[p.id] } : p));

  if (page === 1 && !hasSearch && !hasCategory && state.added.length) {
    list = [...state.added, ...list];
  }
  return list;
}

export function mergeSingleProduct(product) {
  const state = read();
  if (state.deletedIds.includes(product.id)) return null;
  return state.edited[product.id] ? { ...product, ...state.edited[product.id] } : product;
}
