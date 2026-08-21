import { motion } from 'framer-motion';
import { SectionHeading } from '../../components/common/SectionHeading';
import { TestimonialCard } from '../../components/Testimonials/TestimonialCard';
import { LoadingState, ErrorState, EmptyState, StaleDataNotice } from '../../components/common/States';
import { useApi } from '../../hooks/useApi';
import { getTestimonials } from '../../services/resources';
import { staggerContainer } from '../../animations/variants';
import { testimonials as staticTestimonials } from '../../data/testimonials';

/**
 * Testimonials.
 *
 * The backend returns published testimonials only to anonymous callers, so no
 * filtering is needed here.
 */
export const Testimonials = () => {
  const { data, loading, error, isEmpty, refetch } = useApi(() => getTestimonials(), [], {
    fallback: staticTestimonials,
  });

  return (
    <main>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            pretitle="Testimonials"
            title="What our clients say"
            description="The measure of our work is what clients say once a matter is behind them."
          />

          {loading && <LoadingState count={6} label="Loading testimonials" />}

          {/* Fallback content stays visible on failure; the notice explains it
              may be stale. ErrorState only takes over when nothing can be shown. */}
          {!loading && error && !isEmpty && <StaleDataNotice onRetry={refetch} />}

          {!loading && error && isEmpty && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && isEmpty && (
            <EmptyState
              title="No testimonials yet"
              description="Client reviews will appear here once published."
            />
          )}

          {!loading && !isEmpty && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {data.map(testimonial => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  role={testimonial.role}
                  rating={testimonial.rating}
                  text={testimonial.text}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Testimonials;
