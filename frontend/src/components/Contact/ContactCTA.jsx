import { FaPhone } from 'react-icons/fa';
import { Eyebrow, ActionLink } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';
import { telHref } from './ContactHero';
import officeFrontImg from '../../../images/the_actual_office_2.png';

/**
 * Closing call to action, over the building's courtyard, darkened.
 */
export const ContactCTA = () => {
  const phone = contactInfo.phone[0];

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={officeFrontImg}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover object-[50%_60%] opacity-30 grayscale-[40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      </div>

      <div className="container-custom relative py-20 md:py-24">
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow tone="light">Book a consultation</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.04] tracking-tight mb-6">
              Need legal assistance?
            </h2>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl">
              Book a consultation with our team today and let us help you find the right path forward.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <ActionLink to="/book-appointment" variant="gold">
              Book an appointment
            </ActionLink>
            <a
              href={telHref(phone)}
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm md:text-base font-semibold border border-white/40 text-white hover:bg-white hover:text-charcoal hover:border-white transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <FaPhone aria-hidden="true" className="text-sm" />
              {phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactCTA;
