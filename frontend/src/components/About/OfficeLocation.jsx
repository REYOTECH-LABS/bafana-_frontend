import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaArrowRight,
} from 'react-icons/fa';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { LocationMap } from '../common/LocationMap';
import { Reveal } from '../../animations/Reveal';
import { cardHover, fadeUp, staggerContainer } from '../../animations/variants';
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
            className="hover:text-black transition-colors"
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
      <a href={`mailto:${contactInfo.email}`} className="hover:text-black transition-colors">
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
        <span className="text-gray-500">{contactInfo.businessHours.weekend}</span>
      </span>
    ),
  },
];

export const OfficeLocation = () => {
  // Coordinates rather than an address search, so Maps routes to the exact
  // point the marker sits on instead of guessing at "SDA Junction".
  const directionsUrl = buildDirectionsUrl();

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Heading and the directions action share a row on desktop and stack on
            mobile, so the button never crowds the title. */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <SectionHeading
            pretitle={officeLocation.pretitle}
            title={officeLocation.title}
            centered={false}
            className="mb-0 md:mb-0"
          />
          <Reveal delay={0.1} className="flex-shrink-0">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${officeLocation.directionsCta} to Bafana@Law, ${contactInfo.address} (opens Google Maps in a new tab)`}
            >
              <Button variant="secondary" size="md">
                {officeLocation.directionsCta}
                <FaArrowRight className="text-sm" />
              </Button>
            </a>
          </Reveal>
        </div>

        {/* Detail cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {details.map(({ id, label, icon: Icon, content }) => (
            <motion.div
              key={id}
              variants={fadeUp}
              whileHover={cardHover}
              className="h-full bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300"
            >
              <div className="w-11 h-11 mb-6 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <Icon aria-hidden="true" className="text-base text-black" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                {label}
              </p>
              <div className="text-gray-700 leading-relaxed">{content}</div>
            </motion.div>
          ))}
        </motion.div>

        <OfficeMap />
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
const OfficeMap = () => {
  return (
    <Reveal variant="fadeIn">
      <div className="relative isolate w-full h-[20rem] md:h-[26rem] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        <LocationMap />

        {/* Address card, floated over the map's lower-left corner. Raised above
            Leaflet's panes, and lifted clear of the attribution strip on mobile
            where the card spans the full width. */}
        <div className="absolute left-4 bottom-9 right-4 sm:bottom-4 sm:right-auto sm:max-w-sm z-[1000] bg-white rounded-lg border border-gray-200 shadow-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-2">
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
