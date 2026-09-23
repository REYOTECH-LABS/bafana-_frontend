import { motion } from 'framer-motion';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow } from './ui';
import { philosophy } from '../../data/about';
import gavelImg from '../../../images/background-hero.png';

/**
 * Our philosophy.
 *
 * Heading and a tall photograph on the left, the three commitments set as large
 * numbered entries on the right — a reading list rather than a card row, so it
 * does not repeat the grid treatments further down the page.
 */
export const Philosophy = () => {
  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Heading + image */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{philosophy.pretitle}</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-6">
                {philosophy.title}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md">
                {philosophy.description}
              </p>
            </Reveal>

            <Reveal variant="imageReveal" className="mt-10 lg:mt-12">
              <div className="group relative overflow-hidden aspect-[16/10] lg:aspect-square">
                <img
                  src={gavelImg}
                  alt="A gavel and scales of justice on a lawyer's desk"
                  loading="lazy"
                  className="w-full h-full object-cover object-[50%_60%] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/60 to-transparent"
                />
              </div>
            </Reveal>
          </div>

          {/* Commitments */}
          <motion.ol
            className="lg:col-span-7 lg:pt-4 self-center"
            variants={staggerContainer(0.14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {philosophy.items.map(({ id, title, description, icon: Icon }, index) => (
              <motion.li
                key={id}
                variants={fadeUp}
                className="group grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 py-10 md:py-12 border-t border-gray-200 last:border-b"
              >
                <span className="w-14 md:w-20 font-serif text-5xl md:text-6xl leading-none text-gold-500/80 transition-colors duration-300 group-hover:text-gold-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon aria-hidden="true" className="text-base text-gold-600" />
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
                      {title}
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl">
                    {description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
