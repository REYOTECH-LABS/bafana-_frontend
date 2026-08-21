import { useId } from 'react';

/**
 * Labelled control for portal forms.
 *
 * A portal-toned sibling of components/common/Field, which is hardcoded to the
 * public site's white-on-white styling. Same accessibility wiring: the label is
 * bound to the control, `aria-invalid` marks failure, and `aria-describedby`
 * points at the message so a screen reader announces it on focus.
 */
export const FormField = ({
  label,
  name,
  type = 'text',
  as = 'input',
  error,
  hint,
  required = false,
  options = [],
  children,
  className = '',
  ...props
}) => {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  const controlClass = `w-full px-3.5 py-2.5 text-sm rounded-lg bg-portal-surface text-portal-ink placeholder-portal-subtle border transition-colors focus:outline-none focus:ring-2 focus:ring-portal-ink focus:border-portal-ink ${
    error ? 'border-state-dangerFg' : 'border-portal-border'
  }`;

  const shared = {
    id,
    name,
    required,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    className: controlClass,
    ...props,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-portal-ink mb-1.5">
        {label}
        {required && (
          <span aria-hidden="true" className="text-portal-subtle"> *</span>
        )}
      </label>

      {as === 'textarea' && <textarea rows={4} {...shared} />}
      {as === 'select' && (
        <select {...shared}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      )}
      {as === 'input' && <input type={type} {...shared} />}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-portal-subtle">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-state-dangerFg">{error}</p>
      )}
    </div>
  );
};

/** Checkbox with the label to its right, for boolean record flags. */
export const CheckboxField = ({ label, name, checked, onChange, hint, disabled }) => {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        className="mt-0.5 w-4 h-4 rounded border-portal-border text-portal-ink focus:ring-2 focus:ring-portal-ink cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-portal-ink cursor-pointer">
          {label}
        </label>
        {hint && <p id={hintId} className="text-xs text-portal-subtle mt-0.5">{hint}</p>}
      </div>
    </div>
  );
};

/**
 * Form-level failure message.
 *
 * Distinct from a per-field error: this is for what the server rejected as a
 * whole, such as a duplicate email or a business rule. `role="alert"` makes a
 * screen reader announce it as soon as it appears.
 */
export const FormError = ({ error }) => {
  if (!error) return null;

  const message =
    error.status === 409
      ? error.message || 'That record already exists.'
      : error.status === 403
        ? 'You do not have permission to perform this action.'
        : error.isNetworkError
          ? 'Could not reach the server. Check your connection and try again.'
          : error.message || 'Something went wrong. Please try again.';

  // The API returns a per-field list for a 400. Without showing it, a
  // validation failure reads only as "Validation failed", which tells the
  // administrator nothing about which field to correct.
  const fieldErrors = Array.isArray(error.errors) ? error.errors : [];

  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-state-dangerFg/30 bg-state-dangerBg px-4 py-3 text-sm text-state-dangerFg"
    >
      <p>{message}</p>
      {fieldErrors.length > 0 && (
        <ul className="mt-2 space-y-1 list-disc list-inside">
          {fieldErrors.map((item, index) => (
            <li key={item.field ?? index}>
              {item.field ? <span className="font-semibold">{item.field}: </span> : null}
              {item.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormField;
