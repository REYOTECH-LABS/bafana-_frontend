import { ActionLink } from '../About/ui';
import { Reveal } from '../../animations/Reveal';
import { resolveIcon } from '../../lib/iconRegistry';
import { imageForArea, entryNumber, areaAnchor } from './practiceImagery';

/**
 * The directory's opening entry, set large.
 *
 * Purely a change of scale to open the list — it is whichever area the firm
 * has ordered first in the admin, carries the same "01" numbering as the rows
 * that follow, and makes no claim to be more important than them.
 */
export const FeaturedPractice = ({ area, number = 1 }) => {
  const Icon = resolveIcon(area.iconName);
  // Index 2 lands on the firm's own branded reception when no photo exists.
  const { src, isOwnImage } = imageForArea(area, 2);

  return (
    <Reveal
      as="article"
      id={areaAnchor(area)}
      aria-labelledby={`${areaAnchor(area)}-title`}
      className="scroll-mt-28 group grid grid-cols-1 lg:grid-cols-12 bg-charcoal text-white overflow-hidden"
    >
      <div className="relative lg:col-span-6 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[30rem] overflow-hidden">
        <img
          src={src}
          alt={isOwnImage ? `${area.title} at Bafana@Law` : ''}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-[25%_40%] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal/60"
        />
      </div>

      <div className="lg:col-span-6 flex flex-col justify-center p-8 sm:p-10 lg:p-14">
        <div className="flex items-center gap-5 mb-8 lg:mb-10">
          <span className="font-serif text-5xl md:text-6xl leading-none text-gold-400">
            {entryNumber(number)}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
          <span className="w-11 h-11 flex items-center justify-center border border-gold-500/50 text-gold-400">
            <Icon aria-hidden="true" className="text-base" />
          </span>
        </div>

        <h3
          id={`${areaAnchor(area)}-title`}
          className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.1] tracking-tight mb-5"
        >
          {area.title}
        </h3>
        <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-lg mb-10">
          {area.description}
        </p>

        <div>
          <ActionLink
            to="/book-appointment"
            variant="gold"
            aria-label={`Book a consultation about ${area.title}`}
          >
            Book a consultation
          </ActionLink>
        </div>
      </div>
    </Reveal>
  );
};

export default FeaturedPractice;
