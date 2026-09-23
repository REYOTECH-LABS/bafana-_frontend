import { motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Eyebrow, ActionLink } from '../About/ui';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { contactInfo, buildDirectionsUrl } from '../../data/contactInfo';
import officeCourtyardImg from '../../../images/the_actual_office_3.png';

export const telHref = number => `tel:${number.replace(/[^\d+]/g, '')}`;

/**
 * Contact hero.
 *
 * The firm's actual building fills the band. The scrim is heavy only behind
 * the copy on the left, so the building itself stays recognisable on the
 * right. The source photo has a finger at its left edge, so it is anchored
 * right to crop that out.
 */
export const ContactHero = () => {
  const phone = contactInfo.phone[0];

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={officeCourtyardImg}
          alt=""
          className="w-full h-full object-cover object-[80%_45%]"
        />
        <div className="absolute inset-0 bg-charcoal/65 lg:bg-transparent lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/75 lg:to-charcoal/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal/80 to-transparent" />
      </div>

      <div className="container-custom relative pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-28 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <motion.div
            className="lg:col-span-7"
            variants={staggerContainer(0.13, 0.1)}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow tone="light">Contact us</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.02] tracking-tight mb-8"
            >
              <span className="block">Let&rsquo;s talk about</span>
              <span className="block text-gold-400">your matter.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-10"
            >
              Send us a message and a member of our team will respond shortly.
              Everything you share is treated in confidence.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <ActionLink to="/book-appointment" variant="gold">
                Book an appointment
              </ActionLink>
              <a
                href={telHref(phone)}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm md:text-base font-semibold border border-white/40 text-white hover:bg-white hover:text-charcoal hover:border-white transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                <FaPhone aria-hidden="true" className="text-sm" />
                Call us instead
              </a>
            </motion.div>
          </motion.div>

          {/* Address plaque — the single most-wanted fact on a contact page,
              answered before the visitor scrolls. */}
          <motion.div
            className="hidden lg:block lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="bg-charcoal/85 backdrop-blur-sm border-l-2 border-gold-500 p-7">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 mb-3">
                <FaMapMarkerAlt aria-hidden="true" />
                Our office
              </p>
              <p className="font-serif text-xl leading-snug text-white mb-4">{contactInfo.address}</p>
              <a
                href={buildDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to Bafana@Law, ${contactInfo.address} (opens Google Maps in a new tab)`}
                className="text-sm font-semibold text-white border-b border-gold-500 pb-0.5 hover:text-gold-300"
              >
                Get directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
