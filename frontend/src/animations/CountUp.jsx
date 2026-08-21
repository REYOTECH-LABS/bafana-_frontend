import { useEffect, useMemo, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { EASE_OUT } from './variants';

/**
 * Matches an optional prefix, a number, and an optional suffix.
 * '850+' -> ['', '850', '+']   '98%' -> ['', '98', '%']   '12' -> ['', '12', '']
 */
const PATTERN = /^(\D*)(\d[\d,.]*)(\D*)$/;

/**
 * Counts a statistic up to its value when it scrolls into view.
 *
 * The values in src/data/statistics.js are strings with affixes ('15+', '98%'),
 * so a plain parseInt would silently drop the '+' and '%' and change what the
 * page claims. This splits the string, animates only the number, and re-emits
 * the affixes untouched. Anything that doesn't match renders verbatim.
 *
 * Two implementation notes:
 *
 * 1. The parse is memoised on `value`. It used to be computed inline and listed
 *    in the effect's dependency array — but String.match returns a NEW array
 *    every render, so the effect re-ran on every render, restarting the
 *    animation forever. The counters churned and never settled on their final
 *    value.
 *
 * 2. The animated number is a MotionValue rendered directly as a child, so
 *    Framer writes to the DOM text node itself. Driving it through useState
 *    would re-render this component ~60 times a second for every stat on the
 *    page.
 */
export const CountUp = ({ value, duration = 1.8, className = '' }) => {
  const ref = useRef(null);
  // Triggers slightly before the number is on screen. Until it fires the
  // counter reads "0+", and a statistic that says "0+ Years of experience"
  // looks broken rather than un-animated — so the margin buys enough lead time
  // that it is always already counting by the time it can be read.
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: '0px 0px 120px 0px',
  });
  const prefersReducedMotion = useReducedMotion();

  const parsed = useMemo(() => {
    const match = typeof value === 'string' ? value.match(PATTERN) : null;
    if (!match) return null;

    const [prefix, digits, suffix] = match.slice(1);
    return {
      prefix,
      suffix,
      target: Number(digits.replace(/,/g, '')),
      decimals: (digits.split('.')[1] || '').length,
      grouped: digits.includes(','),
    };
  }, [value]);

  const count = useMotionValue(0);

  const text = useTransform(count, (latest) => {
    if (!parsed) return '';

    const fixed = parsed.decimals
      ? latest.toFixed(parsed.decimals)
      : String(Math.round(latest));

    const body = parsed.grouped
      ? Number(fixed).toLocaleString('en-US', {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        })
      : fixed;

    return `${parsed.prefix}${body}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!parsed || !isInView) return undefined;

    // Someone who asked for reduced motion still needs the number — show the
    // final value immediately rather than counting to it.
    if (prefersReducedMotion) {
      count.set(parsed.target);
      return undefined;
    }

    const controls = animate(count, parsed.target, {
      duration,
      ease: EASE_OUT,
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, parsed, duration, count]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {text}
    </motion.span>
  );
};

export default CountUp;
