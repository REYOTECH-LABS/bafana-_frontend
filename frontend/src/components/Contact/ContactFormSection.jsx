import { FaMapMarkerAlt } from 'react-icons/fa';
import { Eyebrow } from '../About/ui';
import { ContactForm } from './ContactForm';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';
import officeBuildingImg from '../../../images/the_actual_office_1.png';

/**
 * The enquiry form beside a photograph of the firm's actual building, with a
 * charcoal panel across the photo's foot restating the confidentiality
 * promise and the address.
 */
export const ContactFormSection = () => {
  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal className="mb-10">
              <Eyebrow>Write to us</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-5">
                Send us a message.
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl">
                Fill in the form below and a member of our team will respond shortly.
              </p>
            </Reveal>

            <Reveal>
              <ContactForm />
            </Reveal>
          </div>

          <Reveal variant="imageReveal" className="lg:col-span-5 lg:sticky lg:top-28">
            <figure className="group relative overflow-hidden bg-charcoal">
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-square overflow-hidden">
                <img
                  src={officeBuildingImg}
                  alt="The office building that houses Bafana@Law, in Adenta, Accra"
                  loading="lazy"
                  className="w-full h-full object-cover object-[50%_80%] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>

              <figcaption className="bg-charcoal text-white p-7 md:p-8 border-t-2 border-gold-500">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 mb-3">
                  In confidence
                </p>
                <p className="font-serif text-2xl md:text-[1.7rem] leading-snug mb-5">
                  Everything you share is treated in confidence.
                </p>
                <p className="flex items-start gap-3 text-sm md:text-base text-white/75 leading-relaxed">
                  <FaMapMarkerAlt aria-hidden="true" className="mt-1 flex-shrink-0 text-gold-400" />
                  {contactInfo.address}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
