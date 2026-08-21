import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_LOGIN_PATH } from '../../routes/adminPaths';

/**
 * Gate for everything under /admin except the login page.
 *
 * This is a usability layer, not a security boundary. It stops an unauthorised
 * visitor from seeing an empty broken shell, but it protects no data: the
 * pages behind it are useless without the API, and every administrator endpoint
 * enforces authentication and permissions server-side. Editing client state to
 * get past this yields a screen full of 401s and 403s.
 *
 * While the session is being restored it renders a neutral panel rather than
 * redirecting, otherwise a page refresh would bounce a signed-in administrator
 * to the login screen before GET /auth/me had a chance to answer.
 */
export const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center bg-admin-bg"
      >
        <span className="sr-only">Checking your session…</span>
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded-full border-2 border-admin-border border-t-gold-500 animate-spin"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    // `from` lets the login page return them to the page they asked for.
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
