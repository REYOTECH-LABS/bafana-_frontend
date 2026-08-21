import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { PracticeAreaCard } from './PracticeAreaCard';
import { Reveal } from '../../animations/Reveal';
import { LoadingState, ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { getPracticeAreas } from '../../services/resources';
import { resolveIcon } from '../../lib/iconRegistry';
import { staggerContainer } from '../../animations/variants';
import { practiceAreas as staticPracticeAreas } from '../../data/practiceAreas';

export const PracticeAreas = () => {
  const { data, loading, error, refetch } = useApi(() => getPracticeAreas(), [], {
    fallback: staticPracticeAreas,
  });

  // The homepage shows a preview of the full list.
  const practiceAreas = (data?.length ? data : staticPracticeAreas).slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          pretitle="Our Practice Areas"
          title="Comprehensive legal solutions"
          description="From the boardroom to the courtroom, our teams advise across the full spectrum of legal need."
        />

        {/* Grid — the stagger says "these are a set, read them in order". */}
        {loading ? (
          <div className="mb-12">
            <LoadingState count={6} label="Loading practice areas" />
          </div>
        ) : error && !practiceAreas.length ? (
          <ErrorState error={error} onRetry={refetch} className="mb-12" />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {practiceAreas.map(area => (
              <PracticeAreaCard
                key={area.id}
                title={area.title}
                description={area.description}
                // API records carry an icon name (string); the static fallback
                // carries a component. resolveIcon accepts either.
                icon={resolveIcon(area.iconName ?? area.icon)}
              />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <Reveal className="text-center">
          <Link to="/practice-areas">
            <Button variant="primary" size="md">
              View all practice areas <FaArrowRight />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default PracticeAreas;
