import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { fadeUp, staggerContainer, EASE_OUT } from '../../animations/variants';
import { companyValues } from '../../data/about';

/**
 * Values grid.
 *
 * Six centred items rather than bordered cards — the prototype keeps this
 * section lighter than the card grids around it so the page has some texture
 * instead of four identical card walls in a row.
 */
export const CompanyValues = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading pretitle={companyValues.pretitle} title={companyValues.title} />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-14"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {companyValues.items.map(({ id, title, description, icon: Icon }) => (
            <motion.div
              key={id}
              variants={fadeUp}
              // `group` lets the icon well respond to a hover anywhere on the
              // item, not just directly over the circle.
              className="group text-center flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="w-14 h-14 mb-5 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center transition-colors duration-300 group-hover:border-black group-hover:bg-black"
              >
                <Icon
                  aria-hidden="true"
                  className="text-lg text-black transition-colors duration-300 group-hover:text-white"
                />
              </motion.div>
              <h3 className="text-base font-semibold text-black mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-snug">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyValues;
