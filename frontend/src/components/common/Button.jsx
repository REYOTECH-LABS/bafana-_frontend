import { motion } from 'framer-motion';
import { EASE_OUT } from '../../animations/variants';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // The Tailwind `hover:scale-105` that used to live here has moved to Framer's
  // whileHover below — two hover-scale mechanisms on one element fight each
  // other, and the transform is better handled by the animation layer. The
  // colour transition stays in Tailwind. 1.03 is deliberately gentler than the
  // old 1.05: enough to confirm the target, not enough to draw attention.
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors duration-300';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'border-2 border-black text-black hover:bg-black hover:text-white',
    light: 'bg-gray-50 text-black hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.35)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
