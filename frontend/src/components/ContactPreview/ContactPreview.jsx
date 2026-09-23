import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { Eyebrow, ActionLink } from '../About/ui';
import { OfficeMap } from '../About/OfficeLocation';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';

/**
 * Home — visit our office.
 *
 * Office details beside the map. The map is the About page's OfficeMap,
 * imported rather than rebuilt, so both pages show the same Leaflet map,
 * coordinates, marker and overlay card.
 */
const telHref = number => `tel:${number.replace(/[^\d+]/g, '')}`;

export const ContactPreview = () => {
  const details = [
    { id: 'address', label: 'Office address', icon: FaMapMarkerAlt, content: contactInfo.address },
    {
      id: 'phone',
      label: 'Phone',
      icon: FaPhone,
      content: (
        <span className="flex flex-col gap-1">
          {contactInfo.phone.map(number => (
            <a key={number} href={telHref(number)} className="hover:text-gold-600 transition-colors">
              {number}
            </a>
          ))}
        </span>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      icon: FaEnvelope,
      content: (
        <a href={`mailto:${contactInfo.email}`} className="hover:text-gold-600 transition-colors break-words">
          {contactInfo.email}
        </a>
      ),
    },
    {
      id: 'hours',
      label: 'Business hours',
      icon: FaClock,
      content: (
        <span className="flex flex-col gap-1">
          <span>{contactInfo.businessHours.weekday}</span>
          <span className="text-gray-600">{contactInfo.businessHours.weekend}</span>
        </span>
      ),
    },
  ];

  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <Reveal>
              <Eyebrow>Get in touch</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-10">
                Visit or contact our office
              </h2>
            </Reveal>

            {/* One reveal for the whole list: this is reference information,
                so it arrives at once rather than item by item. */}
            <Reveal as="dl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 border-t border-gray-200">
              {details.map(({ id, label, icon: Icon, content }) => (
                <div key={id} className="grid grid-cols-[auto_1fr] gap-4 py-5 border-b border-gray-200">
                  <span className="w-10 h-10 flex items-center justify-center bg-ivory text-gold-600">
                    <Icon aria-hidden="true" className="text-sm" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-1">
                      {label}
                    </dt>
                    <dd className="text-base text-charcoal leading-relaxed">{content}</dd>
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-10">
              <ActionLink to="/contact" variant="dark">
                Contact us
              </ActionLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <OfficeMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;
