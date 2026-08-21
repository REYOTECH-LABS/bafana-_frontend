import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
  getCurrentAdministrator,
} from '../services/resources';
import { getToken, setUnauthorizedHandler } from '../services/api';

/**
 * Authentication state for the administrator portal.
 *
 * The administrator is fetched from GET /auth/me rather than decoded from the
 * token or restored from storage. Only the token persists between reloads;
 * identity, role and permissions are re-read from the server every time the app
 * starts, so a change made while the browser was closed takes effect on the
 * next load rather than lingering in a cached copy.
 *
 * Nothing here is a security boundary. `hasPermission` exists so the interface
 * can avoid showing actions that would fail; the backend independently enforces
 * every one of them, and a user who edits this state in memory gains nothing
 * but a 403.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [administrator, setAdministrator] = useState(null);
  // Starts true only when a token exists — otherwise there is nothing to
  // restore and the guard can redirect immediately rather than flashing a
  // loading state on every public page load.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  const clearSession = useCallback(() => setAdministrator(null), []);

  // A 401 anywhere in the app means the session is over. api.js has already
  // discarded the token; this drops the administrator so the guard reacts.
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const current = await getCurrentAdministrator();
        if (!cancelled) setAdministrator(current);
      } catch {
        // The interceptor has already cleared an invalid token. Any other
        // failure leaves the visitor signed out, which the guard handles.
        if (!cancelled) setAdministrator(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async ({ email, password, persist }) => {
    await loginRequest({ email, password, persist });
    // Deliberately re-read rather than trusting the login response, so the
    // administrator in state always comes from the same source as every later
    // request — including the permissions the interface renders from.
    const current = await getCurrentAdministrator();
    setAdministrator(current);
    return current;
  }, []);

  /**
   * Re-reads the administrator from the server.
   *
   * Used after a self-service profile edit so the header and sidebar show the
   * new name immediately. Deliberately re-fetches rather than merging the
   * response locally, keeping one source for what the session believes.
   */
  const refresh = useCallback(async () => {
    if (!getToken()) return null;

    try {
      const current = await getCurrentAdministrator();
      setAdministrator(current);
      return current;
    } catch {
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await logoutRequest();
    setAdministrator(null);
  }, []);

  const value = useMemo(() => {
    const permissions = administrator?.permissions ?? [];
    const isSuperAdmin = administrator?.role === 'super_admin';

    return {
      administrator,
      loading,
      isAuthenticated: Boolean(administrator),
      isSuperAdmin,
      permissions,
      // '*' is what the API returns for super_admin, covering permissions that
      // do not exist yet.
      hasPermission: (permission) =>
        isSuperAdmin || permissions.includes('*') || permissions.includes(permission),
      signIn,
      signOut,
      refresh,
    };
  }, [administrator, loading, signIn, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};

export default AuthContext;
