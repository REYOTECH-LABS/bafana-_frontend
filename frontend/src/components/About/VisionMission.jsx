import { motion } from 'framer-motion';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow } from './ui';
import { visionMission } from '../../data/about';
import bafanaLogo from '../../../images/bafana_logo.jpeg';

/**
 * Vision and mission.
 *
 * Two statements, deliberately not twins: the vision on white with a gold
 * rule, the mission reversed out of charcoal. Each statement is set in the
 * serif at reading size, because these two sentences are the section's whole
 * content. The firm's crest sits behind them as a faint watermark.
 */
const TONES = [
  {
    block: 'bg-white text-charcoal border-t-2 border-gold-500 shadow-[0_30px_60px_-30px_rgba(20,20,20,0.18)]',
    icon: 'bg-gold-500 text-charcoal',
    label: 'text-gold-600',
    body: 'text-charcoal/85',
  },
  {
    block: 'bg-charcoal text-white',
    icon: 'bg-transparent border border-gold-500/60 text-gold-400',
    label: 'text-gold-400',
    body: 'text-white/85',
  },
];

export const VisionMission = () => {
  return (
    <section className="relative overflow-hidden bg-ivory section-padding">
      {/* Cropped to the figure only — the wordmark beneath it would read as
          stray text at this size. */}
      <div
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute right-0 lg:right-8 top-6 w-[26rem] h-[22rem] overflow-hidden opacity-[0.06]"
      >
        <img
          src={bafanaLogo}
          alt=""
          loading="lazy"
          className="w-full h-auto mix-blend-multiply"
        />
      </div>

      <div className="container-custom relative">
        <Reveal className="mb-14 md:mb-16">
          <Eyebrow>{visionMission.pretitle}</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight">
            {visionMission.title}
          </h2>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {visionMission.items.map(({ id, title, description, icon: Icon }, index) => {
            const tone = TONES[index % TONES.length];
            return (
              <motion.article
                key={id}
                variants={fadeUp}
                className={`group h-full flex flex-col p-8 sm:p-10 lg:p-14 transition-transform duration-500 hover:-translate-y-1 ${tone.block}`}
              >
                <div className="flex items-center gap-4 mb-8 lg:mb-10">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center ${tone.icon}`}>
                    <Icon aria-hidden="true" className="text-base" />
                  </span>
                  <h3 className={`text-sm font-sans font-semibold uppercase tracking-[0.22em] ${tone.label}`}>
                    {title}
                  </h3>
                </div>
                <p className={`font-serif text-2xl md:text-[1.7rem] lg:text-3xl leading-snug md:leading-snug ${tone.body}`}>
                  {description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionMission;
