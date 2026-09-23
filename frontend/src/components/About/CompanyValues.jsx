import { motion } from 'framer-motion';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow } from './ui';
import { companyValues } from '../../data/about';
import ladyJusticeImg from '../../../images/lady_justice.png';

/**
 * Values.
 *
 * The page's dark band. Lady Justice stands at the left edge (the cut-out has
 * a transparent background, so she sits directly on the charcoal); the six
 * values run as a numbered grid divided by hairlines rather than boxed cards.
 */
/**
 * Vertical hairlines between columns, never on a row's first item. The grid is
 * 1-up, then 2-up at sm, then 3-up at xl, so which items start a row changes
 * per breakpoint.
 */
const dividerClasses = index => {
  const sm = index % 2 === 0 ? 'sm:pl-0 sm:border-l-0' : 'sm:pl-8 sm:border-l';
  const xl = index % 3 === 0 ? 'xl:pl-0 xl:border-l-0' : 'xl:pl-8 xl:border-l';
  return `${sm} ${xl}`;
};

export const CompanyValues = () => {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white section-padding">
      {/* Statue. Full-height on desktop; a faint backdrop on smaller screens so
          it never competes with the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -right-24 w-2/3 opacity-15 lg:opacity-100 lg:right-auto lg:-left-10 lg:w-[32%]"
      >
        <img
          src={ladyJusticeImg}
          alt=""
          loading="lazy"
          className="w-full h-full object-contain object-bottom lg:object-left-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-charcoal via-charcoal/20 to-transparent hidden lg:block" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_60%,rgba(201,151,74,0.14),transparent_55%)]"
      />

      <div className="container-custom relative">
        <div className="lg:ml-[30%]">
          <Reveal className="mb-14 md:mb-16 max-w-2xl">
            <Eyebrow tone="light">{companyValues.pretitle}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-[1.08] tracking-tight">
              {companyValues.title}
            </h2>
          </Reveal>

          <motion.ol
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-t border-white/10"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {companyValues.items.map(({ id, title, description, icon: Icon }, index) => (
              <motion.li
                key={id}
                variants={fadeUp}
                className={`group relative py-9 pr-6 border-b border-white/10 ${dividerClasses(index)}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 flex items-center justify-center border border-gold-500/40 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-charcoal group-hover:border-gold-500">
                    <Icon aria-hidden="true" className="text-lg" />
                  </span>
                  <span className="font-serif text-sm tracking-widest text-white/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">{title}</h3>
                <p className="text-base text-white/65 leading-relaxed">{description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
};

export default CompanyValues;
