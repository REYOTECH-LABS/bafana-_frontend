import { useState } from 'react';
import { motion } from 'framer-motion';
import { cardHover, fadeUp } from '../../animations/variants';
import { resolveIcon } from '../../lib/iconRegistry';

/**
 * Practice area card with a photographic header.
 *
 * A sibling to PracticeAreaCard rather than a replacement: that one is the
 * compact icon card the homepage section uses, and changing it would rework a
 * page that is not in scope. This is the taller media card the Practice Areas
 * prototype calls for — image band on top, title and description beneath.
 */

/**
 * Stands in until a real photograph exists.
 *
 * The backend has no image field for practice areas yet — only `iconUrl` — so
 * most records will land here. Rather than a grey box with a broken-image
 * glyph, this renders the area's own icon oversized and low-contrast on a soft
 * neutral wash: it reads as a deliberate treatment, stays inside the
 * black/white palette, and occupies exactly the space a photograph will take,
 * so nothing reflows when one is added.
 */
const MediaPlaceholder = ({ icon: Icon }) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"
  >
    <Icon className="text-6xl text-gray-300" />
    {/* Hairline seam against the card body below, so the band reads as a
        distinct region even when the wash is nearly the same value as white. */}
    <span className="absolute inset-x-0 bottom-0 h-px bg-gray-200" />
  </div>
);

export const PracticeAreaMediaCard = ({ title, description, imageUrl, iconName }) => {
  // A stored URL can still 404. Tracking that lets the card fall back to the
  // placeholder instead of showing the browser's broken-image icon.
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = resolveIcon(iconName);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    // The card root is the motion element, not a wrapper around it: an extra
    // wrapper would become the grid item and the card would size to its
    // content, losing the equal row heights the grid gives for free.
    //
    // No initial/whileInView here — the parent grid owns the stagger and this
    // variant name is inherited through it.
    <motion.article
      variants={fadeUp}
      whileHover={cardHover}
      className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-900 transition-colors duration-300"
    >
      {/* Fixed ratio rather than a fixed height, so the band scales with the
          column and every card in a row stays aligned at any breakpoint. */}
      <div className="relative w-full aspect-[16/10]">
        {showImage ? (
          <img
            src={imageUrl}
            alt={`${title} at Bafana@Law`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <MediaPlaceholder icon={Icon} />
        )}
      </div>

      <div className="flex flex-col flex-grow p-8">
        <h3 className="text-xl font-serif font-bold text-black mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.article>
  );
};

export default PracticeAreaMediaCard;
