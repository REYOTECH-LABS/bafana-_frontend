import { motion } from 'framer-motion';
import { Image } from '../common/Image';
import { cardHover, fadeUp } from '../../animations/variants';

export const LawyerCard = ({ name, title, specialization, bio, profileImage }) => {
  return (
    // Motion lives on the card root so the card stays the grid item and keeps
    // stretching to equal height. The stagger comes from the parent grid.
    //
    // `transition-all` removed — it interpolated the same transform Framer
    // animates, so entrance and hover fought each other.
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-900 transition-colors duration-300"
    >
      {/* Image */}
      <Image
        src={profileImage}
        alt={name}
        height="h-72"
        width="w-full"
        placeholderLabel={`Portrait — ${name}`}
      />

      {/* Content */}
      <div className="p-7 flex-grow">
        <h3 className="text-xl font-serif font-bold text-black mb-2">
          {name}
        </h3>
        {/* The role line is the card's label, so it takes the same uppercase
            micro-type used for eyebrows and stat labels elsewhere. */}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          {title} • {specialization}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {bio}
        </p>
      </div>
    </motion.div>
  );
};

export default LawyerCard;
