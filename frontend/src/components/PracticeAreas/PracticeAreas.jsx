import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Eyebrow } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { getActivePracticeAreas } from '../../services/resources';
import { resolveIcon } from '../../lib/iconRegistry';
import { fadeUp, staggerContainer } from '../../animations/variants';
import propertyImg from '../../../images/property.png';
import gavelImg from '../../../images/background-hero.png';
import signingImg from '../../../images/someone_signing.png';
import disputeImg from '../../../images/dispute_resolution.png';

/**
 * Home — practice areas preview.
 *
 * Numbered editorial rows that lead into the full Practice Areas page.
 *
 * Reads the same active, display-ordered list as that page, and — like it —
 * carries no static fallback: the firm's service list must never be guessed.
 * (The old preview fell back to a sample list of nine areas the firm does not
 * list, and requested inactive areas too.)
 */

/**
 * Thumbnail for an area. An uploaded photograph always wins; otherwise the
 * area is matched to the site's own imagery by subject. Areas with no suitable
 * image simply render without one rather than borrowing an unrelated picture.
 */
const SUBJECT_IMAGES = [
  { match: /property|real estate|land/i, src: propertyImg },
  { match: /criminal/i, src: gavelImg },
  { match: /employment|labour|labor/i, src: signingImg },
  // Desaturated below: the source's red lettering sits outside the palette.
  { match: /litigation|dispute/i, src: disputeImg, muted: true },
];

const imageFor = area => {
  if (area.imageUrl) return { src: area.imageUrl, muted: false };
  const hit = SUBJECT_IMAGES.find(({ match }) => match.test(`${area.slug} ${area.title}`));
  return hit ? { src: hit.src, muted: Boolean(hit.muted) } : null;
};

export const PracticeAreas = () => {
  const { data, loading, error, refetch } = useApi(() => getActivePracticeAreas(), [], {
    fallback: [],
  });

  const areas = (data ?? []).slice(0, 6);

  return (
    <section className="bg-ivory section-padding">
      <div className="container-custom">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div className="max-w-2xl">
            <Eyebrow>Our Practice Areas</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-5">
              Comprehensive legal solutions
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              From the boardroom to the courtroom, our teams advise across the full
              spectrum of legal need.
            </p>
          </div>
          <Link
            to="/practice-areas"
            className="group inline-flex items-center gap-3 self-start md:self-auto flex-shrink-0 font-semibold text-charcoal border-b border-gold-500 pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          >
            View all practice areas
            <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {loading && <PreviewSkeleton />}

        {!loading && error && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && areas.length > 0 && (
          <motion.ol
            className="border-t border-ivory-200"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {areas.map((area, index) => (
              <PracticeRow key={area.id} area={area} number={index + 1} />
            ))}
          </motion.ol>
        )}
      </div>
    </section>
  );
};

const PracticeRow = ({ area, number }) => {
  const Icon = resolveIcon(area.iconName ?? area.icon);
  const image = imageFor(area);

  return (
    <motion.li variants={fadeUp} className="border-b border-ivory-200">
      <Link
        to="/practice-areas"
        className="group relative grid grid-cols-[auto_1fr] sm:grid-cols-[4.5rem_1fr_11rem] lg:grid-cols-[6rem_3rem_1fr_15rem_3rem] items-center gap-x-5 lg:gap-x-8 py-7 md:py-8 lg:px-4 transition-colors duration-300 hover:bg-white focus-visible:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-500"
      >
        {/* Gold rule drawn across the top on hover. */}
        <span
          aria-hidden="true"
          className="absolute left-0 -top-px h-0.5 w-0 bg-gold-500 transition-all duration-500 group-hover:w-full group-focus-visible:w-full"
        />

        <span className="self-start sm:self-center font-serif text-4xl md:text-5xl lg:text-6xl leading-none text-gold-500/80 transition-colors duration-300 group-hover:text-gold-600">
          {String(number).padStart(2, '0')}
        </span>

        <span className="hidden lg:flex w-12 h-12 items-center justify-center border border-gold-500/40 text-gold-600 transition-colors duration-300 group-hover:bg-charcoal group-hover:border-charcoal group-hover:text-gold-400">
          <Icon aria-hidden="true" className="text-base" />
        </span>

        <span className="min-w-0">
          <span className="block text-2xl md:text-[1.7rem] font-serif font-bold text-charcoal leading-tight mb-2 transition-transform duration-300 group-hover:translate-x-1">
            {area.title}
          </span>
          <span className="block text-base text-gray-700 leading-relaxed max-w-xl">
            {area.description}
          </span>
        </span>

        {image ? (
          <span aria-hidden="true" className="hidden sm:block relative overflow-hidden aspect-[16/10] bg-charcoal">
            <img
              src={image.src}
              alt=""
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                image.muted ? 'saturate-[.35] sepia-[.25]' : ''
              }`}
            />
          </span>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}

        <span
          aria-hidden="true"
          className="hidden lg:flex w-12 h-12 rounded-full border border-gray-300 items-center justify-center text-charcoal transition-colors duration-300 group-hover:bg-gold-500 group-hover:border-gold-500"
        >
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.li>
  );
};

const PreviewSkeleton = () => (
  <div role="status" aria-live="polite" aria-busy="true" className="border-t border-ivory-200">
    <span className="sr-only">Loading practice areas…</span>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="grid grid-cols-[auto_1fr] sm:grid-cols-[4.5rem_1fr_11rem] gap-x-5 py-8 border-b border-ivory-200 animate-pulse"
      >
        <div className="h-10 w-12 bg-ivory-200" />
        <div>
          <div className="h-6 w-1/2 bg-ivory-200 mb-3" />
          <div className="h-4 w-4/5 bg-ivory-200" />
        </div>
        <div className="hidden sm:block aspect-[16/10] bg-ivory-200" />
      </div>
    ))}
  </div>
);

export default PracticeAreas;
