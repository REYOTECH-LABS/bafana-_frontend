import { motion } from 'framer-motion';
import { cardHover, fadeUp } from '../../animations/variants';

/**
 * Icon + title + description card.
 *
 * Shared by the About page's philosophy and "why clients stay with us" grids,
 * which are structurally identical — one component rather than two near-copies.
 * Visually it matches PracticeAreaCard so cards read the same across the site.
 *
 * Motion lives on the root rather than a wrapper so the card stays the grid
 * item and keeps stretching to equal height. No initial/whileInView here: the
 * parent grid supplies the stagger and this variant name is inherited from it.
 */
export const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      className="h-full bg-white p-10 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300"
    >
      <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <Icon aria-hidden="true" className="text-xl text-black" />
      </div>
      <h3 className="text-xl font-serif font-bold text-black mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
