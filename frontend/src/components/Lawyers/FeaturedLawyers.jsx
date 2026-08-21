import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { LawyerCard } from './LawyerCard';
import { Reveal } from '../../animations/Reveal';
import { LoadingState, ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { getLawyers } from '../../services/resources';
import { staggerContainer } from '../../animations/variants';
import { lawyers as staticLawyers } from '../../data/lawyers';


export const FeaturedLawyers = () => {
  // The homepage shows a preview, so it asks for four. The static module is the
  // fallback: a marketing page should degrade to slightly stale content rather
  // than a blank section if the API is briefly unreachable.
  const { data, loading, error, refetch } = useApi(() => getLawyers({ limit: 4 }), [], {
    fallback: staticLawyers,
  });

  const lawyers = data?.length ? data : staticLawyers;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeading
          pretitle="Our Team"
          title="Experienced. Respected. Trusted."
          description="Meet the advocates who will stand beside you."
        />

        {/* Grid */}
        {loading ? (
          <div className="mb-12">
            <LoadingState count={4} columns="md:grid-cols-2 lg:grid-cols-4" label="Loading lawyers" />
          </div>
        ) : error && !lawyers.length ? (
          <ErrorState error={error} onRetry={refetch} className="mb-12" />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {lawyers.map(lawyer => (
              <LawyerCard
                key={lawyer.id}
                name={lawyer.name}
                title={lawyer.title}
                specialization={lawyer.specialization}
                bio={lawyer.bio}
                profileImage={lawyer.profileImageUrl}
              />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <Reveal className="text-center">
          <Link to="/lawyers">
            <Button variant="primary" size="md">
              Meet all our lawyers <FaArrowRight />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedLawyers;
