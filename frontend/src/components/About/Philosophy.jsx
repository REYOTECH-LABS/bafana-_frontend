import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { FeatureCard } from '../common/FeatureCard';
import { staggerContainer } from '../../animations/variants';
import { philosophy } from '../../data/about';

export const Philosophy = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeading
          pretitle={philosophy.pretitle}
          title={philosophy.title}
          description={philosophy.description}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {philosophy.items.map(item => (
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

export default Philosophy;
