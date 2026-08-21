import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { cardHover, fadeUp } from '../../animations/variants';

export const TestimonialCard = ({ name, role, rating, text }) => {
  return (
    // Motion lives on the card root so the card stays the grid item and keeps
    // stretching to equal height. The stagger comes from the parent grid.
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      className="h-full flex flex-col bg-white p-10 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} className="text-black text-sm" />
        ))}
      </div>

      {/* Text — flex-grow pushes the author block to the bottom, so in a row of
          cards every attribution sits on the same line regardless of how long
          the quote runs. */}
      <p className="text-gray-700 mb-8 leading-relaxed flex-grow">
        "{text}"
      </p>

      {/* Author */}
      <div className="pt-6 border-t border-gray-200">
        <p className="font-serif font-bold text-black">
          {name}
        </p>
        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
          {role}
        </p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
