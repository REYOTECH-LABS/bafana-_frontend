import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async request and reports its state.
 *
 *   const { data, loading, error, refetch } = useApi(getLawyers, [], { fallback: lawyers });
 *
 * `fallback` is what `data` holds before the first response and after a failure.
 * Passing the existing static module keeps a page useful when the backend is
 * unreachable rather than showing an empty screen — the API upgrades the
 * content, it isn't a hard dependency.
 *
 * `enabled: false` defers the call, for requests that depend on something the
 * user hasn't chosen yet.
 */
export const useApi = (requestFn, deps = [], options = {}) => {
  const { fallback = null, enabled = true, onSuccess } = options;

  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  // Guards against setting state after unmount, and against an earlier slow
  // response overwriting a later fast one when deps change quickly.
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!enabled) return undefined;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      if (!mountedRef.current || requestId !== requestIdRef.current) return undefined;

      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return undefined;

      setError(err);
      // Fall back to whatever was supplied so the page still renders content.
      setData(fallback);
      return undefined;
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
    // requestFn is intentionally excluded: callers pass an inline arrow, which
    // is a new reference every render and would loop forever. `deps` is the
    // caller's declaration of what actually matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  useEffect(() => {
    execute();
  }, [execute]);

  const isEmpty = !loading && !error && Array.isArray(data) && data.length === 0;

  return { data, loading, error, isEmpty, refetch: execute };
};

export default useApi;
