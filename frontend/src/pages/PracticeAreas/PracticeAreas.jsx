import { PracticeHero } from '../../components/PracticeAreas/PracticeHero';
import { FeaturedPractice } from '../../components/PracticeAreas/FeaturedPractice';
import {
  PracticeAreaList,
  PracticeAreaListSkeleton,
} from '../../components/PracticeAreas/PracticeAreaList';
import { ConsultationCTA } from '../../components/PracticeAreas/ConsultationCTA';
import { Eyebrow } from '../../components/About/ui';
import { ErrorState, EmptyState } from '../../components/common/States';
import { Reveal } from '../../animations/Reveal';
import { useApi } from '../../hooks/useApi';
import { getActivePracticeAreas } from '../../services/resources';

/**
 * Practice Areas.
 *
 * Charcoal hero with a jump index → the directory (an editorial introduction,
 * the first area set large, the rest as numbered rows with a hover preview) →
 * an ivory consultation prompt.
 *
 * Unlike the other listing pages this one carries **no static fallback**. The
 * firm's service list is the one thing on the site that must never be guessed
 * at — showing a plausible but wrong set of practice areas is worse than
 * showing none — so the API is the sole source and an empty result gets a real
 * empty state. The API returns areas in the firm's chosen display order.
 */
export const PracticeAreasPage = () => {
  const { data, loading, error, isEmpty, refetch } = useApi(
    () => getActivePracticeAreas(),
    [],
    { fallback: [] }
  );

  const hasAreas = !loading && !error && !isEmpty;
  const [firstArea, ...otherAreas] = hasAreas ? data : [];

  return (
    <main>
      <PracticeHero areas={hasAreas ? data : []} />

      <section className="bg-white section-padding">
        <div className="container-custom">
          {/* Introduction — heading and supporting line share a baseline, so
              the section reads as the opening of the directory below rather
              than a free-standing centred block. */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 lg:items-end mb-14 md:mb-16">
            <div className="lg:col-span-7">
              <Eyebrow>Our expertise</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal leading-[1.08] tracking-tight">
                Legal solutions built around real-world needs.
              </h2>
            </div>
            <p className="lg:col-span-5 text-base md:text-lg text-gray-700 leading-relaxed lg:pb-2">
              We deliver focused legal expertise across the areas of law that
              individuals, families, and organizations most often need on their side.
            </p>
          </Reveal>

          {loading && <PracticeAreaListSkeleton />}

          {/* No fallback content exists to sit behind a failure here, so the
              error takes the section rather than appearing as an inline notice. */}
          {!loading && error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && isEmpty && (
            <EmptyState
              title="No practice areas yet"
              description="Our service listings are being prepared. Please check back soon."
            />
          )}

          {hasAreas && (
            <>
              <FeaturedPractice area={firstArea} number={1} />
              {otherAreas.length > 0 && (
                <div className="mt-16 md:mt-20">
                  <PracticeAreaList areas={otherAreas} startAt={2} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Hidden while the directory is in an error or empty state: inviting a
          booking underneath "no practice areas" reads as broken. */}
      {hasAreas && <ConsultationCTA />}
    </main>
  );
};

export default PracticeAreasPage;
