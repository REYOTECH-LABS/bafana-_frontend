import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaArrowRight,
} from 'react-icons/fa';
import { LocationMap } from '../common/LocationMap';
import { Reveal } from '../../animations/Reveal';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Eyebrow, ActionLink } from './ui';
import { officeLocation } from '../../data/about';
import { contactInfo, buildDirectionsUrl } from '../../data/contactInfo';

/**
 * Visit our office.
 *
 * Contact values come from contactInfo.js rather than the About content module,
 * so the address, numbers and hours shown here are the same ones the footer and
 * the contact page render. Duplicating them would guarantee they drift apart.
 */
const details = [
  {
    id: 'address',
    label: 'Office address',
    icon: FaMapMarkerAlt,
    content: <>{contactInfo.address}</>,
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: FaPhone,
    content: (
      <span className="flex flex-col gap-1">
        {contactInfo.phone.map(number => (
          <a
            key={number}
            href={`tel:${number.replace(/[^\d+]/g, '')}`}
            className="hover:text-gold-600 transition-colors"
          >
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
      <a href={`mailto:${contactInfo.email}`} className="hover:text-gold-600 transition-colors">
        {contactInfo.email}
      </a>
    ),
  },
  {
    id: 'hours',
    label: 'Working hours',
    icon: FaClock,
    content: (
      <span className="flex flex-col gap-1">
        <span>{contactInfo.businessHours.weekday}</span>
        <span className="text-gray-600">{contactInfo.businessHours.weekend}</span>
      </span>
    ),
  },
];

export const OfficeLocation = () => {
  // Coordinates rather than an address search, so Maps routes to the exact
  // point the marker sits on instead of guessing at "SDA Junction".
  const directionsUrl = buildDirectionsUrl();

  return (
    <section className="bg-ivory section-padding">
      <div className="container-custom">
        {/* Contact column beside the map. The map is the visual anchor, so it
            takes the wider column and runs the full height of the details. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <Reveal>
              <Eyebrow>{officeLocation.pretitle}</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-10">
                {officeLocation.title}
              </h2>
            </Reveal>

            <motion.dl
              className="border-t border-ivory-200"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {details.map(({ id, label, icon: Icon, content }) => (
                <motion.div
                  key={id}
                  variants={fadeUp}
                  className="group grid grid-cols-[auto_1fr] gap-5 py-6 border-b border-ivory-200"
                >
                  <span className="w-11 h-11 flex items-center justify-center bg-white border border-ivory-200 text-gold-600 transition-colors duration-300 group-hover:bg-charcoal group-hover:border-charcoal group-hover:text-gold-400">
                    <Icon aria-hidden="true" className="text-sm" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-1.5">
                      {label}
                    </dt>
                    <dd className="text-base text-charcoal leading-relaxed break-words">{content}</dd>
                  </div>
                </motion.div>
              ))}
            </motion.dl>

            <Reveal delay={0.1} className="mt-10">
              <ActionLink
                href={directionsUrl}
                variant="dark"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${officeLocation.directionsCta} to Bafana@Law, ${contactInfo.address} (opens Google Maps in a new tab)`}
              >
                {officeLocation.directionsCta}
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

/**
 * Map panel.
 *
 * The frame, the overlay card and the responsive heights are the prototype's;
 * what sits behind them is now a live Leaflet map on OpenStreetMap tiles rather
 * than a placeholder. See components/common/LocationMap for the map itself, and
 * data/contactInfo for the coordinates it centres on.
 *
 * `isolate` matters: Leaflet gives its zoom controls a z-index of 1000, and
 * without a stacking context here they would float over the sticky navbar
 * (z-50) as the section scrolls past it.
 *
 * The reveal is a plain fade rather than `imageReveal` — that variant animates
 * scale, and Leaflet measures its container once at startup, so mounting inside
 * a scaling ancestor leaves the map convinced it is the wrong size and paints
 * grey gaps where tiles belong.
 */
export const OfficeMap = () => {
  return (
    <Reveal variant="fadeIn" className="h-full">
      <div className="relative isolate w-full h-[22rem] md:h-[28rem] lg:h-full lg:min-h-[34rem] overflow-hidden border border-ivory-200 bg-gray-100 shadow-[0_30px_60px_-30px_rgba(20,20,20,0.25)]">
        <LocationMap />

        {/* Address card, floated over the map's lower-left corner. Raised above
            Leaflet's panes, and lifted clear of the attribution strip on mobile
            where the card spans the full width. */}
        <div className="absolute left-4 bottom-9 right-4 sm:bottom-4 sm:right-auto sm:max-w-sm z-[1000] bg-white rounded-lg border border-gray-200 shadow-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-2">
            Bafana@Law
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{contactInfo.address}</p>
          <a
            href={buildDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get directions to Bafana@Law, ${contactInfo.address} (opens Google Maps in a new tab)`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
          >
            Get directions
            <FaArrowRight aria-hidden="true" className="text-xs" />
          </a>
        </div>
      </div>
    </Reveal>
  );
};

export default OfficeLocation;
