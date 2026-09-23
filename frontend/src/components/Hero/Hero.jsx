import { motion } from "framer-motion";
import { FaWhatsapp, FaHourglassHalf, FaBalanceScale, FaUserTie, FaAward } from "react-icons/fa";
import { Eyebrow, ActionLink } from "../About/ui";
import { CountUp } from "../../animations/CountUp";
import { statistics } from "../../data/statistics";
import { fadeUp, imageReveal, staggerContainer } from "../../animations/variants";
import goldenLadyJusticeImg from "../../../images/golden_lady_justice.png";

/**
 * Home hero.
 *
 * Keeps the approved composition — "Justice. Integrity. Results." set large
 * on the left, Lady Justice as the visual anchor on the right — with the
 * credibility strip as the hero's closing band.
 *
 * Desktop: the photograph fills the right of the band and fades into ivory
 * under the copy. Mobile: the photograph drops below the copy as its own
 * cropped panel, so it never sits behind the text.
 */

// Icons are presentation, so they live here rather than in the data module.
// Matched by position to src/data/statistics.js.
const STAT_ICONS = [FaHourglassHalf, FaBalanceScale, FaUserTie, FaAward];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* Desktop photograph */}
      <div aria-hidden="true" className="hidden lg:block absolute inset-y-0 right-0 w-[60%]">
        <img
          src={goldenLadyJusticeImg}
          alt=""
          className="w-full h-full object-cover object-[60%_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ivory/40 to-transparent" />
      </div>

      <div className="container-custom relative pt-14 md:pt-20 lg:pt-24 pb-12 lg:pb-28">
        <motion.div
          className="max-w-xl"
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Welcome to Bafana@Law</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-charcoal leading-[0.98] tracking-tight mb-8"
          >
            <span className="block">Justice.</span>
            <span className="block">Integrity.</span>
            <span className="block text-gold-600">Results.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-md mb-10"
          >
            We provide exceptional legal services to individuals, businesses,
            and institutions — with integrity, professionalism, and an
            unwavering commitment to results.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <ActionLink to="/book-appointment" variant="gold">
              Book a consultation
            </ActionLink>
            <a
              href="https://wa.me/0546370209"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm md:text-base font-semibold border border-charcoal/30 text-charcoal bg-white/60 hover:bg-charcoal hover:text-white hover:border-charcoal transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <FaWhatsapp aria-hidden="true" className="text-xl" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile / tablet photograph */}
      <motion.div
        variants={imageReveal}
        initial="hidden"
        animate="visible"
        className="lg:hidden container-custom relative pb-10"
      >
        <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
          <img
            src={goldenLadyJusticeImg}
            alt="Bronze statue of Lady Justice holding the scales against a golden sky"
            className="w-full h-full object-cover object-[55%_22%]"
          />
          <span aria-hidden="true" className="absolute top-0 left-0 h-0.5 w-16 bg-gold-500" />
        </div>
      </motion.div>

      {/* Credibility strip */}
      <div className="relative bg-white/85 backdrop-blur-sm border-t border-ivory-200">
        <dl className="container-custom grid grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, index) => {
            const Icon = STAT_ICONS[index % STAT_ICONS.length];
            return (
              <div
                key={stat.id}
                className={[
                  "flex items-center gap-4 py-6 md:py-8",
                  // Hairline between items; never on a row's first item. 2-up
                  // below lg, 4-up from lg.
                  index % 2 === 1 ? "pl-5 md:pl-8 border-l border-ivory-200" : "",
                  index >= 2 ? "border-t border-ivory-200 lg:border-t-0" : "",
                  index === 2 ? "lg:pl-8 lg:border-l" : "",
                ].join(" ")}
              >
                <span className="hidden sm:flex w-11 h-11 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-600">
                  <Icon aria-hidden="true" className="text-base" />
                </span>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs md:text-sm text-gray-600 leading-snug mt-1">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl md:text-4xl font-serif font-bold text-charcoal leading-none">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default Hero;
