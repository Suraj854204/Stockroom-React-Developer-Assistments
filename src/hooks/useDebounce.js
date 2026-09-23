"use client";

import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delay`ms.
// Used for the search box so we don't fire a request on every keystroke.
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
