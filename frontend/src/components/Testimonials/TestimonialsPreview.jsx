import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Eyebrow } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { getTestimonials } from '../../services/resources';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { testimonials as staticTestimonials } from '../../data/testimonials';

/**
 * Home — testimonials.
 *
 * Typography only: an oversized gold quotation mark, the words, and the
 * attribution under a rule. There are no approved client photographs, so none
 * are shown and no placeholder avatar stands in for one.
 */
export const TestimonialsPreview = () => {
  const { data, loading, error, refetch } = useApi(() => getTestimonials(), [], {
    fallback: staticTestimonials,
  });

  const testimonials = (data?.length ? data : staticTestimonials).slice(0, 3);

  return (
    <section className="bg-ivory section-padding">
      <div className="container-custom">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight">
              What our clients say
            </h2>
          </div>
          <Link
            to="/testimonials"
            className="group inline-flex items-center gap-3 self-start md:self-auto flex-shrink-0 font-semibold text-charcoal border-b border-gold-500 pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          >
            View all testimonials
            <FaArrowRight aria-hidden="true" className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {loading ? (
          <div role="status" aria-live="polite" aria-busy="true" className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <span className="sr-only">Loading testimonials…</span>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} aria-hidden="true" className="animate-pulse border-t border-ivory-200 pt-10">
                <div className="h-4 w-full bg-ivory-200 mb-3" />
                <div className="h-4 w-5/6 bg-ivory-200 mb-3" />
                <div className="h-4 w-2/3 bg-ivory-200" />
              </div>
            ))}
          </div>
        ) : error && !testimonials.length ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-3"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.li
                key={testimonial.id}
                variants={fadeUp}
                className={`group flex flex-col py-10 md:py-2 md:px-8 lg:px-10 ${
                  index > 0 ? 'border-t md:border-t-0 md:border-l border-ivory-200' : 'md:pl-0 lg:pl-0'
                } ${index === testimonials.length - 1 ? 'md:pr-0 lg:pr-0' : ''}`}
              >
                <figure className="flex flex-col h-full">
                  <span
                    aria-hidden="true"
                    className="font-serif text-7xl leading-[0.6] text-gold-500 mb-6 transition-transform duration-500 group-hover:-translate-y-1"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="flex-grow">
                    <p className="font-serif text-xl md:text-[1.35rem] text-charcoal leading-snug">
                      {testimonial.text}
                    </p>
                  </blockquote>
                  <figcaption className="mt-8 pt-5 border-t border-ivory-200">
                    <span className="block font-semibold text-charcoal">{testimonial.name}</span>
                    {testimonial.role && (
                      <span className="block text-xs uppercase tracking-[0.18em] text-gray-600 mt-1">
                        {testimonial.role}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
};

export default TestimonialsPreview;
