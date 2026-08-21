import { motion } from 'framer-motion';
import { cardHover, fadeUp } from '../../animations/variants';

export const PracticeAreaCard = ({ title, description, icon: Icon }) => {
  return (
    // The card root itself is the motion element rather than being wrapped in
    // one: an extra wrapper would become the grid item, and the card inside it
    // would size to its content instead of stretching — breaking the equal card
    // heights the grid gives for free.
    //
    // No `initial`/`whileInView` here. The parent grid drives the stagger and
    // this variant name is inherited through it.
    //
    // `transition-all` was removed from the class list: it made the browser
    // interpolate `transform` at the same time Framer was animating it, so the
    // entrance and hover fought each other. Border colour still transitions in
    // CSS; Framer owns transform and shadow.
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      className="h-full bg-white p-10 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300"
    >
      {/* The icon sits in its own bordered well rather than floating loose
          above the text. It gives every card the same fixed-height opening
          mark, so a row of cards lines up on a shared grid even when their
          titles run to different lengths. */}
      <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <Icon className="text-xl text-black" />
      </div>
      <h3 className="text-xl font-serif font-bold text-black mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default PracticeAreaCard;
