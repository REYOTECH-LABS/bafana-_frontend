import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { resolveIcon } from '../../lib/iconRegistry';
import { imageForArea, entryNumber, areaAnchor } from './practiceImagery';

/**
 * The numbered practice-area directory.
 *
 * Ruled editorial rows rather than cards. On desktop a sticky panel beside
 * the list shows the image for whichever row is hovered or keyboard-focused;
 * on smaller screens the rows stand alone as a clean vertical list.
 *
 * `startAt` continues the numbering from the featured entry above.
 */
export const PracticeAreaList = ({ areas, startAt = 1 }) => {
  const [active, setActive] = useState(0);

  if (areas.length === 0) return null;
  const activeArea = areas[Math.min(active, areas.length - 1)];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
      <motion.ol
        className="lg:col-span-8"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {areas.map((area, index) => (
          <PracticeAreaRow
            key={area.id}
            area={area}
            number={startAt + index}
            isActive={index === active}
            onActivate={() => setActive(index)}
          />
        ))}
      </motion.ol>

      {/* Preview panel — decorative; each row already carries its own text. */}
      <div aria-hidden="true" className="hidden lg:block lg:col-span-4">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
            {areas.map((area, index) => (
              <img
                key={area.id}
                src={imageForArea(area, index).src}
                alt=""
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                  index === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
            <span className="absolute top-0 left-0 h-0.5 w-16 bg-gold-500" />

            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="font-serif text-4xl text-gold-400 leading-none mb-3">
                {entryNumber(startAt + areas.indexOf(activeArea))}
              </p>
              <p className="font-serif text-2xl font-bold text-white leading-snug">
                {activeArea.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PracticeAreaRow = ({ area, number, isActive, onActivate }) => {
  const Icon = resolveIcon(area.iconName);
  const anchor = areaAnchor(area);
  const linkLabel = `Book a consultation about ${area.title}`;

  return (
    <motion.li
      id={anchor}
      variants={fadeUp}
      onMouseEnter={onActivate}
      // Focus bubbles in React, so tabbing onto the row's link drives the
      // preview panel exactly as hovering does.
      onFocus={onActivate}
      className="scroll-mt-28 group relative border-t border-gray-200 last:border-b"
    >
      {/* Gold rule that draws across the top of the active row. */}
      <span
        aria-hidden="true"
        // Tied to the preview panel, so it only tracks the active row where
        // that panel exists (lg and up).
        className={`absolute left-0 -top-px h-0.5 w-0 bg-gold-500 transition-all duration-500 ${
          isActive ? 'lg:w-full' : ''
        } group-hover:w-full group-focus-within:w-full`}
      />

      <article
        aria-labelledby={`${anchor}-title`}
        className="grid grid-cols-[auto_1fr] md:grid-cols-[5.5rem_1fr_auto] gap-x-5 md:gap-x-6 py-8 md:py-10 md:px-5 transition-colors duration-300 lg:group-hover:bg-ivory"
      >
        <span className="font-serif text-4xl md:text-6xl leading-none text-gold-500/70 transition-colors duration-300 group-hover:text-gold-500">
          {entryNumber(number)}
        </span>

        <div className="min-w-0">
          <Icon aria-hidden="true" className="text-base text-gold-600 mb-3" />
          <h3
            id={`${anchor}-title`}
            className="text-2xl md:text-3xl font-serif font-bold text-charcoal leading-tight mb-3 transition-transform duration-300 lg:group-hover:translate-x-1"
          >
            {area.title}
          </h3>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl">
            {area.description}
          </p>

          {/* Text link on phones, where there is room for words but not for
              a floating arrow button. */}
          <Link
            to="/book-appointment"
            aria-label={linkLabel}
            className="md:hidden mt-5 inline-flex items-center gap-2 text-sm font-semibold text-charcoal border-b border-gold-500 pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          >
            Book a consultation
            <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
        </div>

        <Link
          to="/book-appointment"
          aria-label={linkLabel}
          className="hidden md:flex self-center w-12 h-12 rounded-full border border-gray-300 items-center justify-center text-charcoal transition-colors duration-300 group-hover:bg-gold-500 group-hover:border-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          <FaArrowRight
            aria-hidden="true"
            className="text-sm transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </article>
    </motion.li>
  );
};

/** Skeleton rows matching the real row layout, so nothing jumps on load. */
export const PracticeAreaListSkeleton = ({ count = 4 }) => (
  <div role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Loading practice areas…</span>
    <div aria-hidden="true" className="h-72 lg:h-[30rem] bg-gray-100 animate-pulse mb-16" />
    {Array.from({ length: count - 1 }).map((_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="grid grid-cols-[auto_1fr] md:grid-cols-[5.5rem_1fr] gap-x-6 py-10 border-t border-gray-200 animate-pulse"
      >
        <div className="h-12 w-14 bg-gray-100" />
        <div>
          <div className="h-7 w-1/2 bg-gray-100 mb-4" />
          <div className="h-4 w-4/5 bg-gray-100 mb-2" />
          <div className="h-4 w-3/5 bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
);

export default PracticeAreaList;
