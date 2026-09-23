import { motion } from 'framer-motion';
import { Eyebrow } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { whyChooseUs } from '../../data/whyChooseUs';

/**
 * Home — why choose us.
 *
 * Heading on the left, the six reasons as a numbered, ruled 2×3 grid on the
 * right. No boxed cards: thin rules and a gold number carry the structure.
 */
export const WhyChooseUsSection = () => {
  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow>Why choose us</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight">
                The advantage of true counsel
              </h2>
              <span aria-hidden="true" className="hidden lg:block mt-10 h-px w-24 bg-gold-500" />
            </div>
          </Reveal>

          <motion.ol
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:gap-x-14"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {whyChooseUs.map(({ id, title, description, icon: Icon }, index) => (
              <motion.li
                key={id}
                variants={fadeUp}
                className="group relative border-t border-gray-200 pt-7 pb-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-0.5 w-10 bg-gold-500 transition-all duration-500 group-hover:w-full"
                />
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-serif text-2xl text-gold-600 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon aria-hidden="true" className="text-base text-charcoal/70" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-charcoal mb-2">
                  {title}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">{description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
