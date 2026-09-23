import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { contactInfo } from '../../data/contactInfo';
import { telHref } from './ContactHero';

/**
 * The four ways to reach the firm, as one ruled strip that overlaps the
 * hero's lower edge on desktop. Every value comes from contactInfo.js.
 */
const OPTIONS = [
  {
    id: 'call',
    title: 'Call us',
    description: 'Speak directly with our team.',
    value: contactInfo.phone[0],
    href: telHref(contactInfo.phone[0]),
    icon: FaPhone,
  },
  {
    id: 'email',
    title: 'Email us',
    description: 'Write to us at any time.',
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    icon: FaEnvelope,
  },
  {
    id: 'visit',
    title: 'Visit our office',
    description: contactInfo.mapLocation,
    value: 'See the map',
    href: '#visit-our-office',
    icon: FaMapMarkerAlt,
  },
  {
    id: 'book',
    title: 'Book an appointment',
    description: 'Choose a time that suits you.',
    value: 'Book now',
    to: '/book-appointment',
    icon: FaCalendarAlt,
  },
];

export const ContactOptions = () => {
  return (
    <section className="bg-ivory pb-16 md:pb-20">
      <div className="container-custom">
        <motion.ul
          className="relative z-10 -mt-12 md:-mt-16 lg:-mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white shadow-[0_30px_60px_-30px_rgba(20,20,20,0.35)]"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {OPTIONS.map((option, index) => (
            <motion.li
              key={option.id}
              variants={fadeUp}
              className={[
                'border-ivory-200',
                index > 0 ? 'border-t sm:border-t-0' : '',
                index % 2 === 1 ? 'sm:border-l' : '',
                index >= 2 ? 'sm:border-t lg:border-t-0' : '',
                index === 2 ? 'lg:border-l' : '',
              ].join(' ')}
            >
              <OptionLink option={option} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

const OptionLink = ({ option }) => {
  const { title, description, value, href, to, icon: Icon } = option;
  const className =
    'group relative flex h-full flex-col p-7 lg:p-8 transition-colors duration-300 hover:bg-ivory/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-500';

  const body = (
    <>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-0.5 w-0 bg-gold-500 transition-all duration-500 group-hover:w-full"
      />
      <span className="w-12 h-12 mb-6 rounded-full flex items-center justify-center bg-gold-500/15 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-charcoal">
        <Icon aria-hidden="true" className="text-base" />
      </span>
      <span className="block font-serif text-xl md:text-2xl font-bold text-charcoal mb-2">{title}</span>
      <span className="block text-sm md:text-base text-gray-600 leading-relaxed mb-5">{description}</span>
      <span className="mt-auto flex items-center gap-2 text-base font-semibold text-charcoal break-all">
        {value}
        <FaArrowRight
          aria-hidden="true"
          className="flex-shrink-0 text-xs text-gold-600 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </>
  );

  return to ? (
    <Link to={to} className={className}>
      {body}
    </Link>
  ) : (
    <a href={href} className={className}>
      {body}
    </a>
  );
};

export default ContactOptions;
