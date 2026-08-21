import { motion } from 'framer-motion';
import { SectionHeading } from '../../components/common/SectionHeading';
import { LawyerCard } from '../../components/Lawyers/LawyerCard';
import { LoadingState, ErrorState, EmptyState, StaleDataNotice } from '../../components/common/States';
import { useApi } from '../../hooks/useApi';
import { getLawyers } from '../../services/resources';
import { staggerContainer } from '../../animations/variants';
import { lawyers as staticLawyers } from '../../data/lawyers';

/**
 * Our Lawyers.
 *
 * The static module is the fallback rather than the source: if the API is
 * unreachable the page still shows the team instead of an empty screen, and
 * the error banner explains why the list may be out of date.
 *
 * Anonymous callers get available lawyers only — the backend applies that
 * filter itself, so no query parameter is needed here.
 */
export const Lawyers = () => {
  const { data, loading, error, isEmpty, refetch } = useApi(() => getLawyers({ limit: 100 }), [], {
    fallback: staticLawyers,
  });

  return (
    <main>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            pretitle="Our team"
            title="Experienced. Respected. Trusted."
            description="Meet the advocates who will stand beside you."
          />

          {loading && <LoadingState count={4} columns="md:grid-cols-2 lg:grid-cols-4" label="Loading lawyers" />}

          {/* A failed request still leaves the static fallback in `data`, so the
              team stays visible and the notice explains why it may be stale.
              ErrorState only takes over when there is genuinely nothing to
              show — replacing good content with an error helps nobody. */}
          {!loading && error && !isEmpty && <StaleDataNotice onRetry={refetch} />}

          {!loading && error && isEmpty && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && isEmpty && (
            <EmptyState
              title="No lawyer profiles yet"
              description="Our team profiles are being prepared. Please check back soon."
            />
          )}

          {!loading && !isEmpty && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {data.map(lawyer => (
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
        </div>
      </section>
    </main>
  );
};

export default Lawyers;
