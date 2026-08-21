import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { FeatureCard } from '../common/FeatureCard';
import { staggerContainer } from '../../animations/variants';
import { whyBafana } from '../../data/about';

export const WhyChooseBafana = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeading
          pretitle={whyBafana.pretitle}
          title={whyBafana.title}
          description={whyBafana.description}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {whyBafana.items.map(item => (
            <FeatureCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseBafana;
