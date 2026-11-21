"use client";

import { useEffect, useState } from "react";

export function useApi<T>(url: string | null) {
  const [result, setResult] = useState<{ url: string | null; data: T | null; error: string | null; loading: boolean }>({ url, data: null, error: null, loading: !!url });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load data.");
        return body as T;
      })
      .then((body) => { if (!controller.signal.aborted) setResult({ url, data: body, error: null, loading: false }); })
      .catch((cause) => { if (!controller.signal.aborted) setResult({ url, data: null, error: cause.message || "Could not load data.", loading: false }); });
    return () => controller.abort();
  }, [url]);

  return result.url === url ? result : { url, data: null, error: null, loading: !!url };
}
