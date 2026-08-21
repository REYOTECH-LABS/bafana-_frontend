import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPlay } from 'react-icons/fa';
import { Button } from '../common/Button';
import { Image } from '../common/Image';
import { fadeUp, imageReveal, staggerContainer } from '../../animations/variants';
import { aboutHero } from '../../data/about';
import lawOfficeImg from '../../../images/law_office.png';

/**
 * About page hero.
 *
 * Mirrors the home hero's construction so the two pages feel like one site:
 * same stagger-on-load (it is above the fold, so scroll triggers would never
 * fire), same rule-and-eyebrow label, same asymmetric column split.
 */
export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 md:py-28 lg:py-32">
      <div className="container-custom">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
              <span aria-hidden="true" className="h-px w-10 bg-gray-400 flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                {aboutHero.pretitle}
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-serif font-bold text-black mb-8 leading-[1.05] tracking-tight"
            >
              {aboutHero.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl"
            >
              {aboutHero.description}
            </motion.p>

            {/* Dual CTA: a solid primary action beside a quieter inline link,
                exactly the pairing the prototype uses. */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:items-center gap-5"
            >
              <Link to={aboutHero.primaryCta.to}>
                <Button variant="primary" size="md">
                  {aboutHero.primaryCta.label}
                  <FaArrowRight className="text-sm" />
                </Button>
              </Link>

              <a
                href={aboutHero.secondaryCta.href}
                className="group inline-flex items-center gap-3 text-black font-semibold"
              >
                <span className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center transition-colors duration-300 group-hover:border-black group-hover:bg-black">
                  <FaPlay
                    aria-hidden="true"
                    className="text-[0.6rem] text-black ml-0.5 transition-colors duration-300 group-hover:text-white"
                  />
                </span>
                {aboutHero.secondaryCta.label}
              </a>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div variants={imageReveal} className="lg:col-span-6">
            <Image
              src={lawOfficeImg}
              alt="Scales of justice, law books and a gavel in the Bafana@Law office"
              height="h-[22rem] md:h-[30rem] lg:h-[34rem]"
              placeholderLabel="Law office"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
