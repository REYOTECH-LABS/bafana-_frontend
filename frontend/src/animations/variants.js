/**
 * Shared motion tokens and variants.
 *
 * Single source of truth for every animation on the site. If a duration, easing
 * curve or distance needs to change, it changes here and nowhere else.
 *
 * Only `opacity` and `transform` (x / y / scale) are ever animated. Both are
 * GPU-composited, so nothing here triggers layout or paint.
 */

/** Gentle deceleration — moves off quickly, settles softly. No overshoot. */
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 0.8,
};

/**
 * Reveal when 18% of the element has entered the viewport, and only once.
 *
 * Tall sections (the hero image is 40rem) would otherwise need to be almost
 * fully on screen before a higher threshold fired, so the reveal would happen
 * off-screen and the user would scroll onto content that had already resolved.
 */
export const VIEWPORT = { once: true, amount: 0.18 };

/**
 * Travel distance for entrance animations.
 *
 * 48px is deliberately large enough to read as movement. An earlier pass used
 * 24px, which was technically animating but perceptually invisible — the page
 * looked identical to the static version.
 */
const OFFSET = 48;

export const fadeUp = {
  hidden: { opacity: 0, y: OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -OFFSET },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: OFFSET },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/**
 * For photography and large media.
 *
 * The slight scale gives an image weight as it settles — it reads as the image
 * arriving rather than a box fading in. Kept at 0.96 so it never looks like a
 * zoom effect.
 */
export const imageReveal = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const VARIANTS = {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  imageReveal,
};

/**
 * Parent variant for a group of items that should arrive in sequence.
 *
 * The stagger communicates "these are a set, read them in order". 0.1s sits in
 * the band that reads as intentional rather than slow.
 */
export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/**
 * Shared hover response for cards.
 *
 * Movement stays under 6px and there is no spring, so nothing bounces. Framer
 * owns the transform and the shadow; the card's own Tailwind classes must not
 * carry `transition-all`, or CSS will interpolate the same transform in
 * parallel and the two fight each other.
 */
export const cardHover = {
  y: -5,
  boxShadow: '0 18px 35px -12px rgba(0, 0, 0, 0.18)',
  transition: { duration: 0.28, ease: EASE_OUT },
};

/**
 * Returns a copy of `variant` with `delay` applied.
 *
 * Variants carry their own `transition`, which takes precedence over a
 * `transition` prop on the element — so a delay has to be merged into the
 * variant itself rather than passed alongside it.
 */
export const withDelay = (variant, delay = 0) => {
  if (!delay) return variant;

  return {
    ...variant,
    visible: {
      ...variant.visible,
      transition: { ...variant.visible.transition, delay },
    },
  };
};
