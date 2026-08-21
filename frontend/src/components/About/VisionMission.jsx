import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { cardHover, fadeUp, staggerContainer } from '../../animations/variants';
import { visionMission } from '../../data/about';

/**
 * Vision and mission.
 *
 * Two cards that must stay the same height even though the mission copy runs
 * longer than the vision copy — `items-stretch` on the grid plus `h-full` on
 * each card does that without hard-coding a height.
 *
 * The icon well is inverted here (solid black, white glyph) rather than the
 * light well used elsewhere. These two statements are the section's whole
 * content, so they carry more visual weight than a supporting card.
 */
export const VisionMission = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeading pretitle={visionMission.pretitle} title={visionMission.title} />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {visionMission.items.map(({ id, title, description, icon: Icon }) => (
            <motion.div
              key={id}
              variants={fadeUp}
              whileHover={cardHover}
              className="h-full bg-white p-10 md:p-12 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300"
            >
              <div className="w-14 h-14 mb-7 rounded-full bg-black flex items-center justify-center">
                <Icon aria-hidden="true" className="text-lg text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-black mb-4">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionMission;
