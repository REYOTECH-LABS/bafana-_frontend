import { motion } from 'framer-motion';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow } from './ui';
import { companyStory } from '../../data/about';
import lawOfficeImg from '../../../images/law_office.png';
import bafanaLogo from '../../../images/bafana_logo.jpeg';

/**
 * Our Story.
 *
 * Asymmetric: a portrait-cropped office photograph with the firm's crest laid
 * over its corner, beside the narrative. The first paragraph is set as a serif
 * lead so the section opens like an editorial feature rather than a text block.
 */
export const CompanyStory = () => {
  const [lead, ...rest] = companyStory.paragraphs;

  return (
    // scroll-mt clears the sticky navbar when the hero's anchor link lands here.
    <section id="our-story" className="scroll-mt-20 bg-ivory section-padding overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Image composition */}
          <Reveal variant="imageReveal" className="lg:col-span-5">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="group overflow-hidden aspect-[4/5]">
                <img
                  src={lawOfficeImg}
                  alt="Scales of justice, law books and a gavel in the Bafana@Law office"
                  loading="lazy"
                  className="w-full h-full object-cover object-[28%_50%] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>

              {/* Crest card, overlapping the photograph's corner. */}
              <div className="absolute -bottom-10 -right-2 sm:-right-8 w-32 sm:w-40 bg-white p-4 sm:p-5 shadow-xl shadow-black/10 border-t-2 border-gold-500">
                <img
                  src={bafanaLogo}
                  alt="Bafana@Law crest"
                  loading="lazy"
                  className="w-full h-auto"
                />
              </div>

              {/* Vertical rule tying the photo to the page edge on desktop. */}
              <span
                aria-hidden="true"
                className="hidden lg:block absolute -left-8 top-12 bottom-12 w-px bg-gold-500/60"
              />
            </div>
          </Reveal>

          {/* Narrative */}
          <Reveal variant="slideInRight" className="lg:col-span-7 pt-6 lg:pt-0">
            <Eyebrow>{companyStory.pretitle}</Eyebrow>

            <h2 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-8">
              {companyStory.title}
            </h2>

            <p className="font-serif text-xl md:text-2xl text-charcoal/90 leading-snug md:leading-snug mb-6">
              {lead}
            </p>

            {rest.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Highlights — a numbered strip under both columns, so the story
            closes on what the firm offers rather than trailing off. */}
        <motion.ol
          className="mt-24 lg:mt-28 grid grid-cols-1 md:grid-cols-3 border-t border-ivory-200"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {companyStory.highlights.map(({ id, label, icon: Icon }, index) => (
            <motion.li
              key={id}
              variants={fadeUp}
              className={`group relative flex items-start gap-5 py-8 md:px-8 ${
                index > 0 ? 'border-t md:border-t-0 md:border-l border-ivory-200' : 'md:pl-0'
              }`}
            >
              {/* Gold rule that draws across the top on hover. */}
              <span
                aria-hidden="true"
                className={`absolute -top-px left-0 ${index > 0 ? 'md:left-8' : ''} h-0.5 w-0 bg-gold-500 transition-all duration-500 group-hover:w-16`}
              />
              <span className="font-serif text-3xl text-gold-500 leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <Icon aria-hidden="true" className="text-lg text-charcoal mb-3" />
                <p className="text-base md:text-lg text-charcoal leading-snug">{label}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default CompanyStory;
