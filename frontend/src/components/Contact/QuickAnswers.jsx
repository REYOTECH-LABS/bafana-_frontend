import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Eyebrow } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';
import { telHref } from './ContactHero';

/**
 * Quick answers.
 *
 * There is no FAQ content in the project, so this is deliberately limited to
 * the practical questions the site's own contact data already answers —
 * where, when, how soon, how to book. No policy or legal advice is implied.
 *
 * Native <details>/<summary>: keyboard- and screen-reader-accessible with no
 * script, and it still works if JavaScript fails.
 */
export const QuickAnswers = () => {
  const phone = contactInfo.phone[0];
  const phoneLink = (
    <a href={telHref(phone)} className="font-semibold text-charcoal border-b border-gold-500">
      {phone}
    </a>
  );

  const answers = [
    {
      id: 'where',
      question: 'Where is your office?',
      answer: (
        <>
          {contactInfo.address}.{' '}
          <a href="#visit-our-office" className="font-semibold text-charcoal border-b border-gold-500">
            See it on the map
          </a>
          .
        </>
      ),
    },
    {
      id: 'when',
      question: 'When are you open?',
      answer: (
        <>
          Weekdays, {contactInfo.businessHours.weekday}. {contactInfo.businessHours.weekend}.
        </>
      ),
    },
    {
      id: 'reply',
      question: 'How soon will I hear back?',
      answer: (
        <>
          Send us a message and a member of our team will respond shortly. If your
          matter is urgent, call us on {phoneLink}.
        </>
      ),
    },
    {
      id: 'book',
      question: 'How do I book a consultation?',
      answer: (
        <>
          Use our{' '}
          <Link to="/book-appointment" className="font-semibold text-charcoal border-b border-gold-500">
            online booking form
          </Link>{' '}
          to choose a time, or call us on {phoneLink}.
        </>
      ),
    },
  ];

  return (
    <section className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Common questions</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight mb-5">
              Quick answers.
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md">
              The practical details, in one place. For anything else, call or write to us.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <div className="border-t border-gray-200">
              {answers.map(({ id, question, answer }) => (
                <details key={id} className="group border-b border-gray-200">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg md:text-xl font-serif font-bold text-charcoal transition-colors hover:text-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 [&::-webkit-details-marker]:hidden">
                    {question}
                    <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-300 text-charcoal transition-all duration-300 group-open:rotate-45 group-open:bg-gold-500 group-open:border-gold-500">
                      <FaPlus aria-hidden="true" className="text-xs" />
                    </span>
                  </summary>
                  <p className="pb-6 pr-14 text-base text-gray-700 leading-relaxed">{answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default QuickAnswers;
