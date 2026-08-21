import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

/**
 * Transient confirmations for actions that succeed.
 *
 * A save that changes a row the administrator can already see needs no
 * announcement, but one that closes a dialog or deletes a record leaves no
 * other evidence it worked. Toasts cover that gap.
 *
 * Failures are shown inline, next to the form or section that produced them,
 * rather than here — an error that vanishes after four seconds is an error the
 * reader cannot act on.
 */
const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'success') => {
      // Date.now() alone collides when two toasts land in the same millisecond,
      // which duplicate-keys the list and makes dismissal remove the wrong one.
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      notify: (message) => push(message, 'success'),
      notifyError: (message) => push(message, 'error'),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* aria-live so the confirmation is announced without stealing focus. */}
      <div
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon = toast.tone === 'error' ? FaExclamationCircle : FaCheckCircle;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-lg border shadow-lg max-w-sm text-sm ${
                toast.tone === 'error'
                  ? 'bg-state-dangerBg border-state-dangerFg/30 text-state-dangerFg'
                  : 'bg-portal-surface border-portal-border text-portal-ink'
              }`}
            >
              <Icon
                aria-hidden="true"
                className={toast.tone === 'error' ? 'text-state-dangerFg' : 'text-state-successFg'}
              />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="p-1 opacity-60 hover:opacity-100"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }

  return context;
};

export default ToastContext;
