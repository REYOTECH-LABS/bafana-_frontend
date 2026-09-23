import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

/**
 * Small presentational pieces shared by the About sections only.
 *
 * Kept here rather than in components/common so the About redesign cannot
 * change how any other page renders.
 */

/** Gold rule + tracked label. `tone` switches the text for dark sections. */
export const Eyebrow = ({ children, tone = 'dark', className = '' }) => (
  <div className={`flex items-center gap-4 mb-6 ${className}`}>
    <span aria-hidden="true" className="h-px w-10 bg-gold-500 flex-shrink-0" />
    <p
      className={`text-xs md:text-[0.8rem] font-semibold uppercase tracking-[0.22em] ${
        tone === 'light' ? 'text-gold-400' : 'text-gold-600'
      }`}
    >
      {children}
    </p>
  </div>
);

const ACTION_STYLES = {
  gold: 'bg-gold-500 text-charcoal hover:bg-gold-400',
  dark: 'bg-charcoal text-white hover:bg-gray-800',
  outline: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
  outlineLight: 'border border-white/40 text-white hover:border-white hover:bg-white hover:text-charcoal',
};

/**
 * A link styled as a button. Rendered as the link itself rather than a
 * <button> inside an <a>, which is invalid markup and double-focuses.
 */
export const ActionLink = ({ to, href, variant = 'gold', children, className = '', ...rest }) => {
  const classes = `group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm md:text-base font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${ACTION_STYLES[variant]} ${className}`;
  const content = (
    <>
      {children}
      <FaArrowRight
        aria-hidden="true"
        className="text-xs transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );

  return to ? (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  );
};
