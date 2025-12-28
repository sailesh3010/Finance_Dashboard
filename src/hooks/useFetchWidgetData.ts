// src/hooks/useFetchWidgetData.ts
import { useState, useEffect } from "react";

/**
 * Simple in-memory cache shared across widgets
 * key   -> api url
 * value -> data + timestamp
 */
const cache = new Map<string, { data: any; timestamp: number }>();

// Cache Time-To-Live (30 seconds)
const CACHE_TTL = 30 * 1000;

export const useFetchWidgetData = (url: string, interval: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // ---------- CACHE CHECK ----------
        const cached = cache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          if (isMounted) {
            setData(cached.data);
            setLoading(false);
          }
          return;
        }

        // ---------- API CALL ----------
        const response = await fetch(url);

        if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        }

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        // ---------- STORE IN CACHE ----------
        cache.set(url, {
          data: result,
          timestamp: Date.now(),
        });

        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Real-time updates with interval
    const timer = setInterval(fetchData, interval * 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [url, interval]);

  return { data, loading, error };
};
