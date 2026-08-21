import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "../common/Button";
import { StatItem } from "../common/StatItem";
import { Image } from "../common/Image";
import { statistics } from "../../data/statistics";
import {
  fadeUp,
  imageReveal,
  staggerContainer,
} from "../../animations/variants";
import ladyJusticeImg from "../../../images/lady_justice.png";
import heroBackgroundImg from "../../../images/background-hero.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Background layer. aria-hidden because it is pure decoration — the
          headline already carries the meaning, and a screen reader announcing a
          gavel here would add noise, not information. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* The source is portrait (731x1280) and this band is wide, so
            bg-cover crops hard top and bottom. Anchoring to `center` keeps the
            gavel head — the subject — in frame instead of drifting to the
            plinth. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBackgroundImg}')` }}
        />
        {/*
          Legibility scrim. The headline is black on white and the body copy is
          mid-grey, so the photograph cannot be allowed to sit behind them at
          full strength.

          The gradient is heaviest on the left, where all the text and both
          buttons live, and thins toward the right so the image stays visible
          behind the statue. Reading left to right: effectively solid, then
          near-solid, then a light veil.
        */}
        {/* Opacity values MUST be multiples of 5. Tailwind's default opacity
            scale steps by 5, and an off-scale value like `from-white/96`
            silently compiles to nothing — the colour stop just disappears and
            that end of the gradient becomes transparent, with no warning at
            build time. */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/55" />
        {/* Protects the statistics row, which spans the full width and sits in
            mid-grey — without this it lands on the brightest part of the
            gavel. Also softens the seam into the section below. */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-white/80 to-white" />
      </div>

      <div className="container-custom relative">
        {/* The hero animates on load rather than on scroll — it is already in
            view when the page opens. One stagger drives the whole composition
            in reading order: eyebrow, headline, paragraph, buttons, stat strip,
            then the image, so the first impression assembles rather than
            appearing.

            The columns are asymmetric (5/7 at lg) rather than an even split.
            An even split gives the text more width than a headline this size
            needs, which is what made the paragraph run long and the whole
            composition read flat. Narrowing the text column tightens the
            measure and hands the extra room to the statue. */}
        <motion.div
          // Splits into two columns only at lg, not md. At tablet width the
          // text column would be ~336px — too narrow for a headline this size
          // and for the four-across stat strip beneath it. Stacking until
          // there is genuinely room keeps both readable.
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center"
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="lg:col-span-5">
            {/* Rule + eyebrow. The rule is decorative only — it gives the
                eyebrow something to sit against so it reads as a considered
                label rather than stray small text. */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 mb-6"
            >
              <span
                aria-hidden="true"
                className="h-px w-10 bg-gray-400 flex-shrink-0"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                Welcome to Bafana@Law
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-black mb-8 leading-[1.05] tracking-tight"
            >
              Justice.
              <br />
              Integrity.
              <br />
              Results.
            </motion.h1>

            {/* max-w caps the measure at roughly 60 characters. Long lines are
                the single biggest thing separating a template from a designed
                page. */}
            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md"
            >
              We provide exceptional legal services to individuals, businesses,
              and institutions — with integrity, professionalism, and an
              unwavering commitment to results.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/book-appointment">
                <Button variant="primary" size="md">
                  Book a consultation
                </Button>
              </Link>
              <a
                href="https://wa.me/0546370209"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md">
                  <FaWhatsapp className="text-xl" />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>

            {/* Statistics.
                Previously a full-width band with a top rule, sitting below the
                hero as a separate strip. Moving it inside the text column and
                separating the items with hairline rules makes the hero read as
                one composition instead of two stacked blocks — the arrangement
                the reference uses for its feature row. */}
            <motion.div
              variants={fadeUp}
              className="mt-14 pt-8 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-y-8"
            >
              {statistics.map((stat, index) => (
                <div
                  key={stat.id}
                  // Hairline rules between items, dropped wherever an item
                  // starts a row so none is left hanging at the strip's left
                  // edge. The layout rewraps from 4-across to 2-across at the
                  // sm breakpoint, so which items start a row changes with it:
                  // every even item on mobile, only the first from sm up.
                  className={[
                    "border-l border-gray-200 pl-5",
                    index % 2 === 0 ? "border-l-0 pl-0" : "",
                    "sm:border-l sm:border-gray-200 sm:pl-5",
                    index === 0 ? "sm:border-l-0 sm:pl-0" : "",
                  ].join(" ")}
                >
                  <StatItem value={stat.value} label={stat.label} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image — last in the stagger, so the words land first.
              The source is a 2:3 portrait cut-out, and object-contain fits it
              to whichever axis runs out first. Height is the limit here, so
              the statue only grows by raising the height. */}
          <motion.div variants={imageReveal} className="lg:col-span-7">
            <Image
              src={ladyJusticeImg}
              alt="Lady Justice statue"
              height="h-[34rem] md:h-[46rem] lg:h-[54rem]"
              objectFit="object-contain"
              placeholderLabel="Lady Justice"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
