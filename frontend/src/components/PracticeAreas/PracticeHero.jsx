import { motion } from 'framer-motion';
import { Eyebrow, ActionLink } from '../About/ui';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { lawOfficeImg, entryNumber, areaAnchor } from './practiceImagery';

/**
 * Practice Areas hero.
 *
 * Charcoal band with the office photograph bleeding in from the right, and a
 * jump index of every practice area along the bottom — the page's table of
 * contents, so a visitor can go straight to the area they came for.
 *
 * Animates on load; it is above the fold.
 */
export const PracticeHero = ({ areas = [] }) => {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      {/* Photograph. Full-bleed behind a heavy scrim on small screens; pinned
          to the right half on desktop, fading into the charcoal. */}
      <div aria-hidden="true" className="absolute inset-0 lg:left-[42%]">
        <img
          src={lawOfficeImg}
          alt=""
          className="w-full h-full object-cover object-[35%_50%]"
        />
        <div className="absolute inset-0 bg-charcoal/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/40 lg:to-charcoal/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      <div className="container-custom relative pt-16 pb-12 md:pt-24 md:pb-14 lg:pt-28">
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow tone="light">What we do</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.02] tracking-tight mb-8"
          >
            <span className="block">Our Practice</span>
            <span className="block text-gold-400">Areas.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl mb-10"
          >
            At Bafana@Law, we provide expert legal services across a wide range of
            practice areas. Our goal is to offer practical, effective, and reliable
            solutions tailored to your circumstances.
          </motion.p>

          <motion.div variants={fadeUp}>
            <ActionLink to="/book-appointment" variant="gold">
              Book a consultation
            </ActionLink>
          </motion.div>
        </motion.div>

        {/* Jump index. Rendered only once the areas have loaded, so it never
            shows placeholder names. */}
        {areas.length > 0 && (
          <motion.nav
            aria-label="Practice areas on this page"
            className="mt-16 md:mt-20 pt-6 border-t border-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-3">
              {areas.map((area, index) => (
                <li key={area.id}>
                  <a
                    href={`#${areaAnchor(area)}`}
                    className="group inline-flex items-baseline gap-3 py-1 text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                  >
                    <span className="font-serif text-sm text-gold-400">
                      {entryNumber(index + 1)}
                    </span>
                    <span className="text-sm md:text-base font-medium border-b border-transparent group-hover:border-gold-400 transition-colors duration-300">
                      {area.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
      </div>
    </section>
  );
};

export default PracticeHero;
