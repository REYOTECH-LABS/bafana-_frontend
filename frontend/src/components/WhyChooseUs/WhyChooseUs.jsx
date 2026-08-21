import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { cardHover, fadeUp, staggerContainer } from '../../animations/variants';
import { whyChooseUs } from '../../data/whyChooseUs';

export const WhyChooseUsSection = () => {
  return (
    <section className="section-padding bg-black text-white">
      <div className="container-custom">
        <SectionHeading
          title="The advantage of true counsel"
          pretitle="Why choose us"
          centered={true}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {whyChooseUs.map(item => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                // A dark-on-dark shadow would be invisible, so this card lifts
                // and brightens its border instead of gaining elevation.
                whileHover={{ y: -5, transition: cardHover.transition }}
                className="h-full border border-gray-800 p-10 rounded-xl hover:border-white transition-colors duration-300"
              >
                {/* Same icon well as the practice-area cards, inverted for the
                    dark section so the treatment stays consistent. */}
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg border border-gray-700 bg-white/5">
                  <Icon className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
