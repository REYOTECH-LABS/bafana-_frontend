import { useId } from 'react';

/**
 * Labelled form control with inline validation messaging.
 *
 * Shared by the contact and appointment forms so both report errors the same
 * way and get the same accessibility wiring for free: the label is bound to the
 * control, `aria-invalid` marks the failure, and `aria-describedby` points at
 * the message so a screen reader announces it on focus.
 */
/**
 * `dark` serves the administrator portal, which is charcoal-on-gold rather than
 * the public site's black-on-white. `light` stays the default so every existing
 * form is unaffected.
 */
const TONES = {
  light: {
    label: 'text-black',
    required: 'text-gray-400',
    control:
      'bg-white text-black placeholder-gray-400 focus:ring-black focus:border-black',
    border: 'border-gray-300',
    errorBorder: 'border-red-500',
    errorText: 'text-red-600',
  },
  dark: {
    label: 'text-gray-200',
    required: 'text-admin-muted',
    control:
      'bg-admin-field text-white placeholder-admin-muted focus:ring-gold-500 focus:border-gold-500',
    border: 'border-admin-border',
    errorBorder: 'border-red-500',
    errorText: 'text-red-400',
  },
};

export const Field = ({
  label,
  name,
  type = 'text',
  as = 'input',
  error,
  required = false,
  tone = 'light',
  // Rendered inside the control, for the leading mail/lock glyphs and the
  // password visibility toggle the admin login uses.
  startAdornment,
  endAdornment,
  children,
  className = '',
  ...props
}) => {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const errorId = `${id}-error`;
  const t = TONES[tone] ?? TONES.light;

  const controlClass = [
    'w-full py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2',
    t.control,
    error ? t.errorBorder : t.border,
    startAdornment ? 'pl-11' : 'pl-4',
    endAdornment ? 'pr-11' : 'pr-4',
  ].join(' ');

  const shared = {
    id,
    name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: controlClass,
    ...props,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className={`block text-sm font-semibold mb-2 ${t.label}`}>
        {label}
        {required && (
          <span aria-hidden="true" className={t.required}>
            {' '}*
          </span>
        )}
      </label>

      <div className="relative">
        {startAdornment && (
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-admin-muted"
          >
            {startAdornment}
          </span>
        )}

        {as === 'textarea' && <textarea {...shared} />}
        {as === 'select' && <select {...shared}>{children}</select>}
        {as === 'input' && <input type={type} {...shared} />}

        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
        )}
      </div>

      {error && (
        <p id={errorId} className={`mt-2 text-sm ${t.errorText}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
