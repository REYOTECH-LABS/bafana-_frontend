import { FaExclamationTriangle, FaInbox } from 'react-icons/fa';
import { Button } from './Button';

/**
 * Loading, error and empty states.
 *
 * One place so every page reports the same way — pages differ in what they
 * fetch, not in how they say "loading" or "that didn't work".
 */

/**
 * Skeleton card grid.
 *
 * Deliberately mirrors the real card dimensions (rounded-xl, same padding,
 * same grid) so content does not jump when the data lands. Animated with
 * `animate-pulse`, which Tailwind already disables under prefers-reduced-motion
 * via the reduced-motion block in globals.css.
 */
export const LoadingState = ({
  count = 3,
  columns = 'md:grid-cols-3',
  label = 'Loading',
  // `media` mirrors the taller image-topped card instead of the icon card.
  // Defaulted off, so every existing caller keeps the skeleton it had.
  media = false,
}) => {
  return (
    <div
      className={`grid grid-cols-1 ${columns} gap-8`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}…</span>
      {Array.from({ length: count }).map((_, index) =>
        media ? (
          <div
            key={index}
            aria-hidden="true"
            className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
          >
            {/* Same aspect ratio as the real card's image band, so the grid
                does not resize when the data lands. */}
            <div className="w-full aspect-[16/10] bg-gray-200" />
            <div className="p-8">
              <div className="h-5 w-2/3 mb-4 rounded bg-gray-200" />
              <div className="h-3 w-full mb-2 rounded bg-gray-100" />
              <div className="h-3 w-5/6 mb-2 rounded bg-gray-100" />
              <div className="h-3 w-4/6 rounded bg-gray-100" />
            </div>
          </div>
        ) : (
          <div
            key={index}
            aria-hidden="true"
            className="h-full bg-white p-10 rounded-xl border border-gray-200 animate-pulse"
          >
            <div className="w-12 h-12 mb-6 rounded-lg bg-gray-200" />
            <div className="h-5 w-2/3 mb-4 rounded bg-gray-200" />
            <div className="h-3 w-full mb-2 rounded bg-gray-100" />
            <div className="h-3 w-5/6 mb-2 rounded bg-gray-100" />
            <div className="h-3 w-4/6 rounded bg-gray-100" />
          </div>
        )
      )}
    </div>
  );
};

/**
 * Shown when a request fails.
 *
 * `isNetworkError` from the api normaliser distinguishes "the server is down"
 * from "the server said no", because the two need different wording — one is
 * worth retrying immediately, the other usually isn't.
 */
export const ErrorState = ({ error, onRetry, className = '' }) => {
  const isNetwork = error?.isNetworkError;

  return (
    <div className={`text-center py-16 ${className}`} role="alert">
      <FaExclamationTriangle aria-hidden="true" className="text-3xl text-gray-400 mb-5 mx-auto" />
      <h3 className="text-xl font-serif font-bold text-black mb-3">
        {isNetwork ? 'Cannot reach the server' : 'Something went wrong'}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        {error?.message || 'Please try again in a moment.'}
      </p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};

/**
 * Inline notice for a *recoverable* failure — the request failed but fallback
 * content is being shown, so the page is still usable.
 *
 * Distinct from ErrorState, which takes over the whole section when there is
 * nothing to render. Showing a full-page error on top of perfectly good
 * fallback content hides information the visitor came for.
 */
export const StaleDataNotice = ({ onRetry, className = '' }) => {
  return (
    <div
      role="status"
      className={`mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 ${className}`}
    >
      <p className="text-sm text-gray-600">
        <FaExclamationTriangle aria-hidden="true" className="inline mr-2 text-gray-400" />
        Showing saved information — we could not reach the server, so this may not be up to date.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold text-black underline underline-offset-4 hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};

/** Shown when a request succeeds but there is genuinely nothing to display. */
export const EmptyState = ({
  title = 'Nothing here yet',
  description = 'Check back soon.',
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <FaInbox aria-hidden="true" className="text-3xl text-gray-300 mb-5 mx-auto" />
      <h3 className="text-xl font-serif font-bold text-black mb-3">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default { LoadingState, ErrorState, EmptyState, StaleDataNotice };
