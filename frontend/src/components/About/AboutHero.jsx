import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { Eyebrow, ActionLink } from './ui';
import { fadeUp, imageReveal, staggerContainer } from '../../animations/variants';
import { aboutHero } from '../../data/about';
import { contactInfo } from '../../data/contactInfo';
import receptionImg from '../../../images/login_background.png';
import bafanaLogo from '../../../images/bafana_logo.jpeg';

/**
 * About page hero.
 *
 * Dark editorial split: copy on charcoal to the left, the firm's own branded
 * reception on the right. The photograph carries the Bafana@Law signage, so
 * the page establishes who the firm is before a word is read.
 *
 * Animates on load rather than on scroll — it is above the fold.
 */
export const AboutHero = () => {
  const { title, titleAccent } = aboutHero;
  const lead = title.replace(titleAccent, '').trim();

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      {/* Warm light bleeding in from the image side, so the two halves read as
          one space rather than a photo pasted onto a black slab. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(201,151,74,0.16),transparent_60%)]"
      />

      <div className="container-custom relative pt-14 pb-20 md:pt-20 md:pb-28 lg:py-28">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center"
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* Copy */}
          <div className="lg:col-span-6 order-1">
            <motion.div variants={fadeUp}>
              <Eyebrow tone="light">{aboutHero.pretitle}</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.02] tracking-tight mb-8"
            >
              <span className="block text-white">{lead}</span>
              <span className="block text-gold-400">{titleAccent}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl mb-10"
            >
              {aboutHero.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <ActionLink to={aboutHero.primaryCta.to} variant="gold">
                {aboutHero.primaryCta.label}
              </ActionLink>

              <a
                href={aboutHero.secondaryCta.href}
                className="group inline-flex items-center gap-3 font-semibold text-white/90 hover:text-white"
              >
                <span className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition-colors duration-300 group-hover:border-gold-400 group-hover:bg-gold-500">
                  <FaArrowDown
                    aria-hidden="true"
                    className="text-xs transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-charcoal"
                  />
                </span>
                {aboutHero.secondaryCta.label}
              </a>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div variants={imageReveal} className="lg:col-span-6 order-2">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Offset gold frame behind the photograph. */}
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -top-5 -right-5 w-full h-full border border-gold-500/50"
              />

              <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] bg-charcoal-800">
                <img
                  src={receptionImg}
                  alt="The Bafana@Law reception, with the firm's name on the feature wall"
                  className="w-full h-full object-cover object-[25%_38%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"
                />
              </div>

              {/* Brand plaque */}
              <div className="absolute -bottom-8 left-4 sm:left-8 flex items-center gap-4 bg-ivory text-charcoal pl-3 pr-6 py-3 shadow-2xl shadow-black/40">
                <img
                  src={bafanaLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-12 h-12 object-contain mix-blend-multiply"
                />
                <div>
                  <p className="font-serif font-bold text-base leading-tight">Bafana@Law</p>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug">
                    {contactInfo.mapLocation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
