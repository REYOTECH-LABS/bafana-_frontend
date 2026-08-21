import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { TestimonialCard } from './TestimonialCard';
import { Reveal } from '../../animations/Reveal';
import { LoadingState, ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { getTestimonials } from '../../services/resources';
import { staggerContainer } from '../../animations/variants';
import { testimonials as staticTestimonials } from '../../data/testimonials';

export const TestimonialsPreview = () => {
  const { data, loading, error, refetch } = useApi(() => getTestimonials(), [], {
    fallback: staticTestimonials,
  });

  const testimonials = (data?.length ? data : staticTestimonials).slice(0, 3);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeading
          pretitle="Testimonials"
          title="What our clients say"
        />

        {/* Grid */}
        {loading ? (
          <div className="mb-12">
            <LoadingState count={3} label="Loading testimonials" />
          </div>
        ) : error && !testimonials.length ? (
          <ErrorState error={error} onRetry={refetch} className="mb-12" />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {testimonials.map(testimonial => (
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

        {/* CTA */}
        <Reveal className="text-center">
          <Link to="/testimonials">
            <Button variant="primary" size="md">
              View all testimonials <FaArrowRight />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
