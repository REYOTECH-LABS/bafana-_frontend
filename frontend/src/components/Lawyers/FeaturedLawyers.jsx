import { Eyebrow, ActionLink } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import groupLawyersImg from '../../../images/group_lawyers.png';

/**
 * Home — our team.
 *
 * A charcoal band with the team photograph bleeding off the right edge. It
 * introduces the people and hands off to the Our Lawyers page, where the
 * individual profiles live — no individual lawyer is named or pictured here.
 */
export const FeaturedLawyers = () => {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      {/* Photograph: right half on desktop, full-width panel above the copy on
          smaller screens. */}
      <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto">
        <img
          src={groupLawyersImg}
          alt="The legal team standing together in the firm's reception"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/30 lg:to-transparent"
        />
      </div>

      <div className="container-custom relative">
        <Reveal className="max-w-md py-14 md:py-20 lg:py-32">
          <Eyebrow tone="light">Our Team</Eyebrow>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.05] tracking-tight mb-6">
            Experienced.
            <br />
            Respected.
            <br />
            <span className="text-gold-400">Trusted.</span>
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-10">
            Meet the advocates who will stand beside you.
          </p>
          <ActionLink to="/lawyers" variant="gold">
            Meet all our lawyers
          </ActionLink>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedLawyers;
