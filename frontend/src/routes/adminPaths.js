/**
 * Administrator portal routes.
 *
 * Kept in one place so the login page, the guard and the router agree, and so
 * nothing under /admin is ever spelled out inline in a public component where
 * it could drift or leak into the public navigation.
 */
export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
