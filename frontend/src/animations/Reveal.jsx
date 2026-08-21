import { motion } from 'framer-motion';
import { VARIANTS, VIEWPORT, fadeUp, withDelay } from './variants';

/**
 * Scroll reveal wrapper.
 *
 * Keeps `whileInView` boilerplate out of the section components — they stay
 * readable as markup, and the reveal behaviour can be tuned in one place.
 *
 *   <Reveal>…</Reveal>                        fade + rise (default)
 *   <Reveal variant="slideInLeft">…</Reveal>  enters from the left
 *   <Reveal as="section" delay={0.1}>…</Reveal>
 *
 * `as` renders the original element type so wrapping something never changes
 * the document structure or the CSS that targets it.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user"> in
 * App.jsx — Framer drops the transform and keeps the opacity fade, so there is
 * nothing to special-case here.
 */
export const Reveal = ({
  as = 'div',
  variant = 'fadeUp',
  delay = 0,
  amount,
  className = '',
  children,
  ...rest
}) => {
  const MotionTag = motion[as] ?? motion.div;
  const selected = withDelay(VARIANTS[variant] ?? fadeUp, delay);
  const viewport = amount === undefined ? VIEWPORT : { ...VIEWPORT, amount };

  return (
    <MotionTag
      className={className}
      variants={selected}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
