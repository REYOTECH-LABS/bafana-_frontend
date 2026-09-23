import { FaPhone } from 'react-icons/fa';
import { Eyebrow, ActionLink } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';
import ladyJusticeImg from '../../../images/lady_justice.png';

/**
 * Closing consultation prompt.
 *
 * Ivory, so the page ends on warmth before the black footer. Lady Justice
 * stands in a gold-ruled arch on the right; the booking link goes to the same
 * appointment route as every other CTA on the site, with the office line
 * beside it for visitors who would rather call.
 */
export const ConsultationCTA = () => {
  const phone = contactInfo.phone[0];

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7 pt-20 md:pt-24 lg:pb-24">
            <Eyebrow>Here for you</Eyebrow>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal leading-[1.05] tracking-tight mb-6">
              Need legal assistance?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-lg mb-10">
              Tell us what you are facing and we will point you to the right lawyer.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <ActionLink to="/book-appointment" variant="dark">
                Book an appointment
              </ActionLink>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="group inline-flex items-center gap-3 font-semibold text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
              >
                <span className="w-11 h-11 flex items-center justify-center border border-charcoal/20 text-gold-600 transition-colors duration-300 group-hover:bg-charcoal group-hover:border-charcoal group-hover:text-gold-400">
                  <FaPhone aria-hidden="true" className="text-sm" />
                </span>
                {phone}
              </a>
            </div>
          </Reveal>

          <Reveal variant="fadeIn" delay={0.1} className="lg:col-span-5 relative flex justify-center">
            {/* Arch behind the statue. */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 w-56 sm:w-64 lg:w-72 h-[85%] rounded-t-full border border-b-0 border-gold-500/50 bg-white/60"
            />
            <img
              src={ladyJusticeImg}
              alt="Bronze statue of Lady Justice holding scales and a sword"
              loading="lazy"
              className="relative h-72 sm:h-80 lg:h-[28rem] w-auto object-contain object-bottom"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
