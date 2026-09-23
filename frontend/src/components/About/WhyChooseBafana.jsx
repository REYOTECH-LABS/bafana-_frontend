import { motion } from 'framer-motion';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow } from './ui';
import { whyBafana } from '../../data/about';

/**
 * Why Bafana@Law.
 *
 * The heading stays pinned on desktop while the six reasons scroll past it,
 * set as a ruled two-column list rather than a card wall.
 */
export const WhyChooseBafana = () => {
  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-32">
              <Eyebrow>{whyBafana.pretitle}</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-6">
                {whyBafana.title}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md">
                {whyBafana.description}
              </p>
            </Reveal>
          </div>

          <motion.ul
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:gap-x-14"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {whyBafana.items.map(({ id, title, description, icon: Icon }) => (
              <motion.li
                key={id}
                variants={fadeUp}
                className="group relative border-t border-gray-200 pt-8 pb-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-0.5 w-10 bg-gold-500 transition-all duration-500 group-hover:w-full"
                />
                <Icon aria-hidden="true" className="text-xl text-gold-600 mb-5" />
                <h3 className="text-xl md:text-2xl font-serif font-bold text-charcoal mb-3">{title}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBafana;
