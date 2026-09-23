import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Reveal } from '../../animations/Reveal';
import { Eyebrow, ActionLink } from './ui';
import { aboutCta } from '../../data/about';
import { contactInfo } from '../../data/contactInfo';
import lawOfficeImg from '../../../images/law_office.png';

/**
 * Closing call to action.
 *
 * The office photograph sits behind a heavy charcoal scrim — enough to set the
 * mood without competing with the headline. The right column offers the
 * direct lines (from contactInfo.js, the shared source of truth) for visitors
 * who would rather call or write than book online.
 */
export const AboutCTA = () => {
  const primaryPhone = contactInfo.phone[0];

  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={lawOfficeImg}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      </div>

      <div className="container-custom relative py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="light">{aboutCta.pretitle}</Eyebrow>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.05] tracking-tight mb-6">
              {aboutCta.title}
            </h2>
            <p className="text-lg text-white/75 leading-relaxed max-w-xl mb-10">
              {aboutCta.description}
            </p>
            <ActionLink to={aboutCta.cta.to} variant="gold">
              {aboutCta.cta.label}
            </ActionLink>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5 lg:pl-12 lg:border-l lg:border-gold-500/50">
            <ul className="space-y-6">
              <li>
                <a
                  href={`tel:${primaryPhone.replace(/[^\d+]/g, '')}`}
                  className="group flex items-center gap-5"
                >
                  <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-white/20 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-charcoal">
                    <FaPhone aria-hidden="true" className="text-sm" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">
                      Phone
                    </span>
                    <span className="block text-lg text-white group-hover:text-gold-300">{primaryPhone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="group flex items-center gap-5">
                  <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-white/20 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-charcoal">
                    <FaEnvelope aria-hidden="true" className="text-sm" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">
                      Email
                    </span>
                    <span className="block text-lg text-white break-all group-hover:text-gold-300">
                      {contactInfo.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
