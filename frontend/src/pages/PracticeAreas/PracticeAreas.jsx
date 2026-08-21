import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/common/Button';
import { PracticeAreaMediaCard } from '../../components/PracticeAreas/PracticeAreaMediaCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { Reveal } from '../../animations/Reveal';
import { useApi } from '../../hooks/useApi';
import { getActivePracticeAreas } from '../../services/resources';
import { fadeUp, staggerContainer } from '../../animations/variants';
// The same statue the home hero uses. Reused rather than duplicated so the two
// pages open on the same image and the asset is bundled once.
import ladyJusticeImg from '../../../images/lady_justice.png';

/**
 * Practice Areas.
 *
 * Built to the prototype: a two-column intro, a centred "what we offer"
 * heading, a grid of image-topped cards, and a closing booking prompt.
 *
 * Unlike the other listing pages this one carries **no static fallback**. The
 * firm's service list is the one thing on the site that must never be guessed
 * at — showing a plausible but wrong set of practice areas is worse than
 * showing none — so the API is the sole source and an empty result gets a real
 * empty state.
 */
export const PracticeAreasPage = () => {
  const { data, loading, error, isEmpty, refetch } = useApi(
    () => getActivePracticeAreas(),
    [],
    { fallback: [] }
  );

  const hasCards = !loading && !error && !isEmpty;

  return (
    <main>
      {/* ------------------------------------------------------------ intro */}
      {/* Mirrors the About hero's construction — same tinted band, same
          asymmetric split, same stagger-on-load. It is above the fold, so a
          scroll trigger would never fire. */}
      <section className="relative overflow-hidden bg-gray-50 py-20 md:py-28 lg:py-32">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
            variants={staggerContainer(0.13, 0.1)}
            initial="hidden"
            animate="visible"
          >
            <div className="lg:col-span-6">
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
                <span aria-hidden="true" className="h-px w-10 bg-gray-400 flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                  What we do
                </p>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-serif font-bold text-black mb-8 leading-[1.05] tracking-tight"
              >
                Our Practice Areas
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-gray-600 leading-relaxed max-w-xl"
              >
                At Bafana@Law, we provide expert legal services across a wide range of
                practice areas. Our goal is to offer practical, effective, and reliable
                solutions tailored to your circumstances.
              </motion.p>
            </div>

            {/* The prototype frames the statue in a soft panel rather than
                letting it float on the section background. */}
            <motion.div variants={fadeUp} className="lg:col-span-6">
              <div className="rounded-xl bg-gray-100 overflow-hidden">
                <img
                  src={ladyJusticeImg}
                  alt="Bronze statue of Lady Justice holding scales and a sword"
                  className="w-full h-[18rem] md:h-[24rem] lg:h-[26rem] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- grid */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            pretitle="What we offer"
            title="Our Practice Areas"
            description="We deliver focused legal expertise across the areas of law that individuals, families, and organizations most often need on their side."
          />

          {loading && (
            <LoadingState count={6} media label="Loading practice areas" />
          )}

          {/* No fallback content exists to sit behind a failure here, so the
              error takes the section rather than appearing as an inline notice. */}
          {!loading && error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && isEmpty && (
            <EmptyState
              title="No practice areas yet"
              description="Our service listings are being prepared. Please check back soon."
            />
          )}

          {hasCards && (
            // Three across on desktop keeps each card close to the width the
            // prototype draws; two would stretch them well past it and flatten
            // the image band. Two at tablet, one on mobile.
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {data.map(area => (
                <PracticeAreaMediaCard
                  key={area.id}
                  title={area.title}
                  description={area.description}
                  imageUrl={area.imageUrl}
                  iconName={area.iconName}
                />
              ))}
            </motion.div>
          )}

          {/* --------------------------------------------------------- CTA */}
          {/* Hidden while the section is in an error or empty state: inviting a
              booking underneath "no practice areas" reads as broken. */}
          {hasCards && (
            <Reveal className="mt-16 md:mt-20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-xl border border-gray-200 bg-gray-50 p-8 md:p-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-2">
                    Need legal assistance?
                  </h2>
                  <p className="text-gray-600 leading-relaxed max-w-xl">
                    Tell us what you are facing and we will point you to the right lawyer.
                  </p>
                </div>

                {/* The existing booking route — same destination as the navbar
                    and hero CTAs. */}
                <Link to="/book-appointment" className="flex-shrink-0">
                  <Button variant="primary" size="md">
                    Book an appointment
                  </Button>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
};

export default PracticeAreasPage;
