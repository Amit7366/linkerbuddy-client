"use client";

import { useEffect, useState } from "react";

/** False on the server and the first client render; true after mount. */
export function useIsomorphicLayoutReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setReady(true));
  }, []);

  return ready;
}
