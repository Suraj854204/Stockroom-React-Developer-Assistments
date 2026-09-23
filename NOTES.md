# Notes

## Choices worth explaining

- **Search and category filter are mutually exclusive.** DummyJSON can't do both at once, so setting one clears the other. This felt more honest than silently ignoring one of them.
- **Add/edit/delete are simulated locally.** DummyJSON's write endpoints don't persist, so a `localStorage` overrides layer (`src/lib/localOverrides.js`) makes changes stick within the browser. Full reasoning is in the README.
- **URL is the single source of truth** for page, page size, search, category and sort, so the view is always shareable and refresh-safe.

## A problem I ran into, and the fix

The trickiest part was making sure a slow search response can't overwrite a newer one (the `&delay=2000` test case). The fix was to tag every outgoing request with an incrementing counter and only commit a response to state if its counter still matches the latest one issued — anything older is silently dropped. This is simpler than juggling `AbortController` cancellation for every request type and behaves the same from the user's point of view.

A related issue: resetting to page 1 on a new search had to happen in the URL, not just in local state, otherwise browser back/forward and page refresh would disagree with what was on screen.

