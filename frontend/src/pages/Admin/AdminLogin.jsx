import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  FaBalanceScale,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
  FaApple,
  FaMicrosoft,
  FaShieldAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Field } from '../../components/common/Field';
import { AdminBrandPanel } from '../../components/Admin/AdminBrandPanel';
import { NoIndex } from '../../components/Admin/NoIndex';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_DASHBOARD_PATH } from '../../routes/adminPaths';
import loginBackground from '../../../images/login_background.png';

/**
 * Administrator sign-in.
 *
 * Not linked from anywhere on the public site, and rendered outside MainLayout
 * so the public navbar and footer never appear here. Knowing the URL is not
 * access: every administrator endpoint enforces authentication and permissions
 * server-side regardless of what this page does.
 */

/**
 * OAuth providers are part of the approved design but no provider is
 * implemented in the backend. They render as the design shows and are disabled,
 * because a button that appears to work and silently does nothing is worse than
 * one that is visibly unavailable.
 */
const PROVIDERS = [
  { id: 'google', label: 'Google', Icon: FaGoogle },
  { id: 'apple', label: 'Apple', Icon: FaApple },
  { id: 'microsoft', label: 'Microsoft', Icon: FaMicrosoft },
];

const GENERIC_CREDENTIALS_ERROR = 'Invalid email or password.';

/**
 * Maps a failure to what the administrator should read.
 *
 * 401 is deliberately flattened to one message: distinguishing "no such
 * account" from "wrong password" would let anyone test which addresses are
 * registered. The backend already answers both identically; this makes sure the
 * interface does not reintroduce the difference.
 */
const messageForError = (error) => {
  if (error?.isNetworkError) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  switch (error?.status) {
    case 400:
    case 401:
      return GENERIC_CREDENTIALS_ERROR;
    case 403:
      // The account is real and the password was right, but it is deactivated.
      return error.message || 'This account is deactivated.';
    case 429:
      return 'Too many sign-in attempts. Please wait a few minutes and try again.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
};

export const AdminLogin = () => {
  const { signIn, isAuthenticated, loading: restoringSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  // Where the guard was trying to send them before redirecting here.
  const intended = location.state?.from ?? ADMIN_DASHBOARD_PATH;

  if (!restoringSession && isAuthenticated) {
    return <Navigate to={intended} replace />;
  }

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError(null);
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email address is required';
    if (!form.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await signIn({
        email: form.email.trim(),
        password: form.password,
        persist: keepSignedIn,
      });
      navigate(intended, { replace: true });
    } catch (error) {
      setFormError(messageForError(error));
      // Clear the password so a failed attempt is not left on screen, and the
      // next attempt is typed deliberately.
      setForm((prev) => ({ ...prev, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NoIndex />

      <main className="min-h-screen flex bg-admin-bg text-white">
        <AdminBrandPanel />

        {/* Below lg the photograph becomes the page background rather than a
            column, so the form keeps the full width on a phone. */}
        <div className="relative flex-1 flex items-center justify-center p-5 sm:p-8">
          <img
            src={loginBackground}
            alt=""
            aria-hidden="true"
            className="lg:hidden absolute inset-0 w-full h-full object-cover"
          />
          <div aria-hidden="true" className="lg:hidden absolute inset-0 bg-admin-bg/90" />

          <div className="relative w-full max-w-md">
            {/* Mobile wordmark. The desktop one lives in the brand panel. */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <FaBalanceScale aria-hidden="true" className="text-gold-500 text-lg" />
              <span className="font-serif text-lg font-bold tracking-wide">
                BAFANA<span className="text-gold-500">@</span>LAW
              </span>
            </div>

            <div className="bg-admin-panel border border-admin-border rounded-2xl p-7 sm:p-9">
              <div className="text-center mb-8">
                <span className="w-16 h-16 mx-auto mb-5 rounded-full border border-gold-500/30 flex items-center justify-center">
                  <FaBalanceScale aria-hidden="true" className="text-gold-500 text-2xl" />
                </span>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold-500 mb-3">
                  Administrator login
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
                  Welcome back
                </h1>
                <p className="text-sm text-admin-muted leading-relaxed">
                  Sign in to manage Bafana@Law&apos;s practice, appointments,
                  lawyers, content and enquiries.
                </p>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
                >
                  <FaExclamationTriangle
                    aria-hidden="true"
                    className="text-red-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-red-200">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* The placeholder is a generic hint, not a real administrator
                    address. The field is empty either way, but naming a live
                    account on a public-facing page tells an attacker where to
                    start. */}
                <Field
                  tone="dark"
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@bafanaatlaw.com"
                  value={form.email}
                  onChange={update('email')}
                  error={fieldErrors.email}
                  startAdornment={<FaEnvelope />}
                  className="mb-5"
                />

                <Field
                  tone="dark"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  error={fieldErrors.password}
                  startAdornment={<FaLock />}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="p-2 rounded text-admin-muted hover:text-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  }
                />

                <div className="flex items-center justify-between gap-4 mt-5 mb-7">
                  <label className="flex items-center gap-2.5 text-sm text-admin-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(event) => setKeepSignedIn(event.target.checked)}
                      className="w-4 h-4 rounded border-admin-border bg-admin-field accent-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    Keep me signed in
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowRecovery((v) => !v)}
                    aria-expanded={showRecovery}
                    className="text-sm font-semibold text-gold-500 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {showRecovery && (
                  <div className="mb-7 rounded-lg border border-admin-border bg-admin-field/60 px-4 py-3">
                    <p className="text-sm text-admin-muted leading-relaxed">
                      Self-service password reset is not available on this
                      system. Ask a super administrator to set a new password for
                      your account, then change it from your profile once you are
                      signed in.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3.5 font-semibold text-admin-bg transition-all duration-200 hover:from-gold-300 hover:to-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-admin-panel disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                  {!submitting && <FaArrowRight aria-hidden="true" className="text-sm" />}
                </button>
              </form>

              <div className="flex items-center gap-4 my-7">
                <span aria-hidden="true" className="h-px flex-1 bg-admin-border" />
                <span className="text-xs text-admin-muted">or continue with</span>
                <span aria-hidden="true" className="h-px flex-1 bg-admin-border" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PROVIDERS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={`${label} sign-in is not enabled on this system`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-field px-3 py-3 text-sm text-admin-muted opacity-50 cursor-not-allowed"
                  >
                    <Icon aria-hidden="true" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <p className="mt-3 text-center text-xs text-admin-muted/80">
                Provider sign-in is not enabled on this system.
              </p>

              <p className="mt-7 pt-6 border-t border-admin-border text-center text-sm text-admin-muted">
                Don&apos;t have an account?{' '}
                <a
                  href="mailto:bafanalaw88@gmail.com?subject=Administrator%20access%20request"
                  className="font-semibold text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Contact Super Admin
                </a>
              </p>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-admin-muted">
              <FaShieldAlt aria-hidden="true" />
              Encrypted session · Access is logged and monitored
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminLogin;
