# Stockroom — Product Admin Dashboard

A small admin dashboard for managing a product catalog, built with Next.js (App Router), React, Tailwind CSS and Axios, against the free [DummyJSON](https://dummyjson.com) API.

## Setup

```bash
npm install
cp .env.local.example .env.local   # optional — defaults to https://dummyjson.com anyway
npm run dev
```

Open http://localhost:3000. Log in with:

- **Username:** `emilys`
- **Password:** `emilyspass`

To build for production:

```bash
npm run build
npm start
```

## What's finished

- Login with DummyJSON `/auth/login`, error message on wrong credentials, token stored and attached to every request, logout button, and route protection so `/products/*` pages redirect to `/login` when signed out.
- Product list with image, title, category, price, rating and stock — a table on desktop, cards on mobile.
- Pagination via `limit`/`skip`, with page numbers, Previous/Next, a page-size selector (10/20/50), and a "Showing X–Y of Z" line.
- Debounced search (`/products/search`) that resets to page 1 on every new query, and never lets a slow, stale response overwrite a newer one (tested with `&delay=2000`).
- Category filter (`/products/categories`, `/products/category/:slug`) and sort by title / price / rating, both ascending and descending.
- Product details page at `/products/[id]` with an image gallery, description, price and reviews, plus a proper "not found" screen for a bad id.
- Add / edit forms with client-side validation, and a confirm dialog before deleting.
- Loading, empty and error states everywhere data is fetched, each with a Retry button on error.
- One shared Axios instance (`src/lib/axios.js`) that attaches the token to every request and normalises errors in one interceptor.
- Page, search, category, sort and page-size are all kept in the URL query string, so refreshing or sharing the link reproduces the same view. Invalid values (`?page=abc`, `?page=999`, an unsupported `?limit=`) are sanitised instead of breaking the page.
- Double-submit protection on login and on the add/edit form (button disables itself and the handler bails out while a request is in flight).
- No table/pagination/data-fetching libraries — all of it is hand-written.

## Extras added beyond the brief

- **Toast notifications** for add / edit / delete, with a persistent notification area (`src/context/ToastContext.jsx`).
- **Optimistic delete with a 5-second Undo.** Deleting a product removes it from the list immediately; the change is only written to `localOverrides` (and the fire-and-forget API call only made) once the undo window passes. Clicking "Undo" in the toast restores it in its original position at no network cost.
- **Skeleton loading rows** for the table and card views instead of a blocking spinner, so the layout doesn't jump when data arrives.
- **Sticky, sortable table header** — click "Product", "Price" or "Rating" to cycle ascending → descending → unsorted; stays in sync with the Sort by dropdown (both read/write the same `sort` URL param).
- **Stats bar** above the list: total products matching the current filters, out-of-stock count and average rating for the current page.

## Project structure

```
src/
  app/                 pages (App Router)
  components/          small, focused UI components
  context/AuthContext  login state, kept in localStorage
  lib/axios.js         shared Axios instance + interceptors
  lib/api/             one file per API resource (auth, products)
  lib/localOverrides.js  add/edit/delete persistence layer (see below)
  hooks/useDebounce.js
```

## Design choices worth calling out

**Search vs. category filter.** DummyJSON has no single endpoint that both searches and filters by category, so the app treats them as mutually exclusive: typing in the search box clears any active category, and picking a category clears the search box. A small note appears under the category dropdown when a search is active, so the behaviour isn't a surprise.

**Add / edit / delete aren't really saved by the API.** DummyJSON's `POST /products/add`, `PUT /products/:id` and `DELETE /products/:id` all return a convincing response but don't change what the next `GET` returns. The app still calls these endpoints (so the network flow matches the brief and can be inspected in dev tools), but the change that's actually shown in the UI comes from a small local-overrides layer (`src/lib/localOverrides.js`) backed by `localStorage`:
- new products are stored with a locally-generated id (900000+) and prepended to the unfiltered first page;
- edits are stored as a patch keyed by product id and merged onto whatever the API returns for that id;
- deletes add the id to a "hidden" list that's filtered out of every list/detail response.

This is a reasonable simplification for a take-home exercise against a mock API, not a real backend — it's per-browser, not shared, and doesn't try to be a full offline cache.

**Race conditions on search.** Each fetch is tagged with an incrementing request id; when a response comes back, it's only applied to state if its id still matches the latest request. This means a slow response to an old keystroke can never overwrite the result of a newer one.

**Wrong URL values.** `page`/`limit` are parsed with `parseInt` and checked against sane bounds before use; anything invalid or missing falls back to `page=1` / `limit=20` rather than being passed straight to the API or crashing the page. A `page` beyond the last page (e.g. after a filter narrows the result set) is detected once the API responds and the URL is corrected back to page 1.

