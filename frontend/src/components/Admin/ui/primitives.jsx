import { useEffect, useId, useRef } from 'react';
import { FaSpinner, FaInbox, FaExclamationTriangle, FaSearch, FaTimes } from 'react-icons/fa';

/**
 * Shared portal primitives.
 *
 * Grouped in one module because they are small, always used together, and share
 * the same token vocabulary. A file each would add eleven imports to every page
 * for no benefit.
 *
 * The visual language is the approved report design: off-white paper, hairline
 * rules, serif headings, restrained status tints.
 */

/* ------------------------------------------------------------------ headings */

export const PageHeader = ({ title, description, actions }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
    <div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-portal-ink tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-portal-muted max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </header>
);

export const SectionCard = ({ title, action, children, className = '', bodyClassName = '' }) => (
  <section
    className={`bg-portal-surface border border-portal-border rounded-xl overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-portal-border">
        <h2 className="text-lg font-serif font-bold text-portal-ink">{title}</h2>
        {action}
      </div>
    )}
    <div className={bodyClassName || 'p-6'}>{children}</div>
  </section>
);

/* -------------------------------------------------------------------- button */

const BUTTON_VARIANTS = {
  primary: 'bg-portal-ink text-white hover:bg-black',
  secondary: 'bg-portal-surface text-portal-ink border border-portal-border hover:border-portal-ink',
  ghost: 'text-portal-muted hover:text-portal-ink hover:bg-portal-raised',
  danger: 'bg-state-dangerFg text-white hover:brightness-110',
};

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => (
  <button
    // Guarding on `loading` as well as `disabled` is what actually prevents a
    // double submission; the visual state alone would not.
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-ink focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    {...props}
  >
    {loading && <FaSpinner aria-hidden="true" className="animate-spin" />}
    {children}
  </button>
);

/* -------------------------------------------------------------- status badge */

const STATUS_TONES = {
  success: 'bg-state-successBg text-state-successFg',
  warning: 'bg-state-warningBg text-state-warningFg',
  danger: 'bg-state-dangerBg text-state-dangerFg',
  info: 'bg-state-infoBg text-state-infoFg',
  neutral: 'bg-state-neutralBg text-state-neutralFg',
};

const SUCCESS_WORDS = ['confirmed', 'resolved', 'completed', 'published', 'active', 'available', 'verified'];
const WARNING_WORDS = ['pending', 'in_progress', 'draft', 'unresolved', 'new', 'on leave'];
const DANGER_WORDS = ['cancelled', 'canceled', 'no-show', 'inactive', 'suspended', 'unavailable'];

/**
 * Maps a backend status string to a tone.
 *
 * Centralised so "pending" looks identical on the dashboard, the appointments
 * table and the enquiry drawer. An unknown status falls back to neutral rather
 * than rendering unstyled.
 */
export const toneForStatus = (status) => {
  const value = String(status ?? '').toLowerCase();
  if (SUCCESS_WORDS.includes(value)) return 'success';
  if (WARNING_WORDS.includes(value)) return 'warning';
  if (DANGER_WORDS.includes(value)) return 'danger';
  return 'neutral';
};

export const StatusBadge = ({ status, tone, label }) => {
  const resolved = tone ?? toneForStatus(status);
  const text = label ?? String(status ?? '—').replace(/[_-]/g, ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize whitespace-nowrap ${STATUS_TONES[resolved]}`}
    >
      {text}
    </span>
  );
};

/* ----------------------------------------------------------------- stat card */

export const StatCard = ({ label, value, hint, icon: Icon }) => (
  <div className="bg-portal-surface border border-portal-border rounded-xl p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {/* Serif numerals echo the report design and separate the figure from
            its label far more clearly than size alone would. */}
        <p className="text-3xl font-serif font-bold text-portal-ink tabular-nums leading-none">
          {value}
        </p>
        <p className="mt-2 text-sm text-portal-muted truncate">{label}</p>
        {hint && <p className="mt-1 text-xs text-portal-subtle">{hint}</p>}
      </div>
      {Icon && (
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-portal-raised border border-portal-border flex items-center justify-center">
          <Icon aria-hidden="true" className="text-sm text-portal-muted" />
        </span>
      )}
    </div>
  </div>
);

/* --------------------------------------------------------------- data states */

export const LoadingState = ({ rows = 5, label = 'Loading' }) => (
  <div role="status" aria-live="polite" aria-busy="true" className="p-6">
    <span className="sr-only">{label}…</span>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} aria-hidden="true" className="h-11 rounded-lg bg-portal-raised animate-pulse" />
      ))}
    </div>
  </div>
);

export const EmptyState = ({ title = 'Nothing here yet', description, action }) => (
  <div className="text-center py-16 px-6">
    <FaInbox aria-hidden="true" className="text-2xl text-portal-subtle mb-4 mx-auto" />
    <h3 className="text-base font-serif font-bold text-portal-ink mb-1">{title}</h3>
    {description && <p className="text-sm text-portal-muted max-w-sm mx-auto">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

/**
 * Turns a failure into something the reader can act on.
 *
 * The wording is chosen by HTTP status rather than shown raw, because "Request
 * failed with status code 403" tells an administrator nothing about what to do
 * next. `normaliseError` in api.js supplies the status and the network flag.
 */
export const ErrorState = ({ error, onRetry }) => {
  const status = error?.status;

  const title = error?.isNetworkError
    ? 'Cannot reach the server'
    : status === 403
      ? 'You do not have permission'
      : status === 404
        ? 'Not found'
        : status === 429
          ? 'Too many requests'
          : 'Something went wrong';

  const description = error?.isNetworkError
    ? 'The API did not respond. Check that the backend is running, then try again.'
    : status === 403
      ? 'Your account does not carry the permission this section requires. A super administrator can grant it.'
      : status === 429
        ? 'Please wait a moment before trying again.'
        : error?.message || 'Please try again in a moment.';

  return (
    <div role="alert" className="text-center py-16 px-6">
      <FaExclamationTriangle aria-hidden="true" className="text-2xl text-portal-subtle mb-4 mx-auto" />
      <h3 className="text-base font-serif font-bold text-portal-ink mb-1">{title}</h3>
      <p className="text-sm text-portal-muted max-w-md mx-auto">{description}</p>
      {/* Retrying a 403 would fail identically every time, so it is not offered. */}
      {onRetry && status !== 403 && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};

/* --------------------------------------------------------- search and filter */

export const SearchInput = ({ value, onChange, placeholder = 'Search', label }) => {
  const id = useId();

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label ?? placeholder}</label>
      <FaSearch
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-portal-subtle pointer-events-none"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-64 pl-9 pr-8 py-2 text-sm rounded-lg bg-portal-surface border border-portal-border text-portal-ink placeholder-portal-subtle focus:outline-none focus:ring-2 focus:ring-portal-ink focus:border-portal-ink transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-portal-subtle hover:text-portal-ink"
        >
          <FaTimes className="text-xs" />
        </button>
      )}
    </div>
  );
};

export const FilterSelect = ({ value, onChange, options, label }) => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="py-2 pl-3 pr-8 text-sm rounded-lg bg-portal-surface border border-portal-border text-portal-ink focus:outline-none focus:ring-2 focus:ring-portal-ink focus:border-portal-ink transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* --------------------------------------------------------------------- modal */

/**
 * Centred dialog.
 *
 * Escape closes it, body scroll is locked while it is open, and focus moves
 * into the panel on mount so a keyboard user is not left behind on the trigger.
 */
export const Modal = ({ open, onClose, title, children, footer, size = 'md' }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-portal-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${width} bg-portal-surface rounded-t-2xl sm:rounded-xl border border-portal-border shadow-xl max-h-[92vh] flex flex-col focus:outline-none`}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-portal-border flex-shrink-0">
          <h2 className="text-lg font-serif font-bold text-portal-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 -mr-2 text-portal-subtle hover:text-portal-ink rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-portal-border flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-portal-muted leading-relaxed">{message}</p>
  </Modal>
);
