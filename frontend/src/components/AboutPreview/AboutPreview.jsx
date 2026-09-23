import { motion } from "framer-motion";
import { FaEye, FaBullseye, FaBalanceScale } from "react-icons/fa";
import { Eyebrow, ActionLink } from "../About/ui";
import { Reveal } from "../../animations/Reveal";
import { fadeUp, staggerContainer } from "../../animations/variants";
import lawOfficeImg from "../../../images/law_office.png";

/**
 * Home — who we are.
 *
 * A short introduction that hands off to the full About page: the office
 * photograph in a gold-offset frame, the firm's statement, and vision,
 * mission and values as three ruled columns rather than boxed cards.
 */
const PILLARS = [
  {
    id: "vision",
    title: "Our Vision",
    description: "To be the most trusted legal partner, known for excellence and integrity.",
    icon: FaEye,
  },
  {
    id: "mission",
    title: "Our Mission",
    description: "To deliver accessible, effective, client-centred counsel of the highest standard.",
    icon: FaBullseye,
  },
  {
    id: "values",
    title: "Our Values",
    description: "Integrity, confidentiality, respect, and an unwavering commitment to results.",
    icon: FaBalanceScale,
  },
];

export const AboutPreview = () => {
  return (
    <section className="bg-white section-padding overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          <Reveal variant="imageReveal" className="lg:col-span-5">
            <div className="relative max-w-lg mx-auto lg:max-w-none">
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -top-5 -left-5 w-full h-full border border-gold-500/50"
              />
              <div className="group relative overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
                <img
                  src={lawOfficeImg}
                  alt="Scales of justice, law books and a gavel in the Bafana@Law office"
                  loading="lazy"
                  className="w-full h-full object-cover object-[30%_50%] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>About Bafana@Law</Eyebrow>
              <h2 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-6">
                Dedicated to justice.
                <br />
                Committed to you.
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mb-10">
                Bafana At Law is a dynamic, client-focused firm built on a simple
                belief: everyone deserves clear, honest, and capable legal
                counsel. We pair deep courtroom experience with a practical,
                people-first approach — so you always understand your options and
                feel supported at every step.
              </p>
            </Reveal>

            <motion.ul
              className="grid grid-cols-1 sm:grid-cols-3 border-t border-gray-200 mb-10"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {PILLARS.map(({ id, title, description, icon: Icon }, index) => (
                <motion.li
                  key={id}
                  variants={fadeUp}
                  className={`py-6 sm:pt-7 sm:pb-0 ${
                    index > 0
                      ? "border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-6"
                      : ""
                  } ${index < PILLARS.length - 1 ? "sm:pr-6" : ""}`}
                >
                  <Icon aria-hidden="true" className="text-xl text-gold-600 mb-4" />
                  <h3 className="text-lg md:text-xl font-serif font-bold text-charcoal mb-2">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {description}
                  </p>
                </motion.li>
              ))}
            </motion.ul>

            <Reveal>
              <ActionLink to="/about" variant="outline">
                Learn more about us
              </ActionLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
