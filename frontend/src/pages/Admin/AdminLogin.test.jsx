import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mocked before the modules under test import it, so no request ever leaves the
// suite and the token-storage assertions stay deterministic.
vi.mock('../../services/api', async () => {
  const actual = await vi.importActual('../../services/api');
  return {
    ...actual,
    default: { post: vi.fn(), get: vi.fn() },
  };
});

import api, { TOKEN_STORAGE_KEY } from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';
import { RequireAuth } from '../../components/Admin/RequireAuth';
import { AdminLogin } from './AdminLogin';
import { ADMIN_DASHBOARD_PATH, ADMIN_LOGIN_PATH } from '../../routes/adminPaths';

const ADMINISTRATOR = {
  id: 'a1',
  email: 'admin@bafanaatlaw.com',
  fullName: 'Test Administrator',
  role: 'admin',
  isActive: true,
  permissions: ['dashboard:view'],
};

/** Shape of a rejection from services/api's normaliseError. */
const apiError = (status, message, isNetworkError = false) => ({
  status,
  message,
  errors: [],
  isNetworkError,
});

const renderLogin = (initialEntries = [ADMIN_LOGIN_PATH]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />
          <Route element={<RequireAuth />}>
            <Route path={ADMIN_DASHBOARD_PATH} element={<h1>Dashboard reached</h1>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

const fillCredentials = async (user, password = 'Password123') => {
  await user.type(screen.getByLabelText(/email address/i), 'admin@bafanaatlaw.com');
  await user.type(screen.getByLabelText(/^password/i), password);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AdminLogin — rendering', () => {
  it('renders the sign-in form', () => {
    renderLogin();

    expect(screen.getByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('offers no way to register an account', () => {
    renderLogin();

    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
    // "Contact Super Admin" is a mailto link, not self-service registration.
    expect(screen.getByRole('link', { name: /contact super admin/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:')
    );
  });

  it('toggles password visibility without revealing it by default', async () => {
    const user = userEvent.setup();
    renderLogin();

    const password = screen.getByLabelText(/^password/i);
    expect(password).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(password).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(password).toHaveAttribute('type', 'password');
  });
});

describe('AdminLogin — validation', () => {
  it('reports missing fields without calling the API', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
});

describe('AdminLogin — successful sign-in', () => {
  it('stores the token and reaches the dashboard', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ token: 'issued-token', administrator: ADMINISTRATOR });
    api.get.mockResolvedValue(ADMINISTRATOR);

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Dashboard reached')).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@bafanaatlaw.com',
      password: 'Password123',
    });
  });

  it('keeps the session to the tab when "keep me signed in" is unchecked', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ token: 'session-token', administrator: ADMINISTRATOR });
    api.get.mockResolvedValue(ADMINISTRATOR);

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem(TOKEN_STORAGE_KEY)).toBe('session-token');
    });
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('persists the session across restarts when "keep me signed in" is checked', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ token: 'persistent-token', administrator: ADMINISTRATOR });
    api.get.mockResolvedValue(ADMINISTRATOR);

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByLabelText(/keep me signed in/i));
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('persistent-token');
    });
    expect(sessionStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe('AdminLogin — failures', () => {
  it('shows one generic message for bad credentials, revealing nothing', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(apiError(401, 'Invalid email or password'));

    renderLogin();
    await fillCredentials(user, 'WrongPassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid email or password/i);
    // Nothing may hint at which half was wrong, or whether the account exists.
    expect(alert).not.toHaveTextContent(/not found/i);
    expect(alert).not.toHaveTextContent(/no account/i);
    expect(alert).not.toHaveTextContent(/incorrect password/i);
  });

  it('stores no token when sign-in fails', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(apiError(401, 'Invalid email or password'));

    renderLogin();
    await fillCredentials(user, 'WrongPassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await screen.findByRole('alert');
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(screen.queryByText('Dashboard reached')).not.toBeInTheDocument();
  });

  it('reports a deactivated account distinctly', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(apiError(403, 'Account is deactivated'));

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/deactivated/i);
  });

  it('reports rate limiting rather than blaming the credentials', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(apiError(429, 'Too many login attempts'));

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/too many sign-in attempts/i);
  });

  it('reports a network failure', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(apiError(0, 'Could not reach the server.', true));

    renderLogin();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i);
  });

  it('disables the button while the request is in flight', async () => {
    const user = userEvent.setup();
    let release;
    api.post.mockReturnValue(new Promise((resolve) => { release = resolve; }));

    renderLogin();
    await fillCredentials(user);

    const button = screen.getByRole('button', { name: /sign in/i });
    await user.click(button);

    // Guards against a double submission creating two sessions.
    await waitFor(() => expect(button).toBeDisabled());
    expect(api.post).toHaveBeenCalledTimes(1);

    release({ token: 't', administrator: ADMINISTRATOR });
  });
});

describe('AdminLogin — unimplemented providers', () => {
  it('renders the OAuth buttons disabled and inert', async () => {
    const user = userEvent.setup();
    renderLogin();

    for (const name of ['Google', 'Apple', 'Microsoft']) {
      const button = screen.getByRole('button', { name: new RegExp(name, 'i') });
      expect(button).toBeDisabled();
      await user.click(button);
    }

    // No request, and above all no token: a provider button must never fake
    // a successful sign-in.
    expect(api.post).not.toHaveBeenCalled();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('explains that password recovery is handled by a super administrator', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /forgot password/i }));

    expect(await screen.findByText(/super administrator/i)).toBeInTheDocument();
    // It must not claim to have sent anything.
    expect(screen.queryByText(/email sent/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/check your inbox/i)).not.toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
});

describe('RequireAuth', () => {
  it('redirects an unauthenticated visitor to the login page', async () => {
    renderLogin([ADMIN_DASHBOARD_PATH]);

    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard reached')).not.toBeInTheDocument();
  });

  it('admits a visitor whose stored token resolves to an administrator', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'valid-token');
    api.get.mockResolvedValue(ADMINISTRATOR);

    renderLogin([ADMIN_DASHBOARD_PATH]);

    expect(await screen.findByText('Dashboard reached')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
  });

  it('redirects when a stored token no longer resolves', async () => {
    // Covers a deleted or deactivated administrator: the token is well formed
    // but the server refuses it.
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stale-token');
    api.get.mockRejectedValue(apiError(401, 'Invalid or expired token'));

    renderLogin([ADMIN_DASHBOARD_PATH]);

    expect(await screen.findByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard reached')).not.toBeInTheDocument();
  });
});
