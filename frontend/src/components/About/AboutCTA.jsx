import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Button } from '../common/Button';
import { Reveal } from '../../animations/Reveal';
import { aboutCta } from '../../data/about';

/**
 * Closing call to action.
 *
 * The prototype puts a faint dot field behind this band. It is drawn as a CSS
 * radial-gradient rather than shipped as an image — it costs nothing to
 * download, stays crisp at any density, and is trivially tunable.
 *
 * Note the button is `variant="light"`. The primary variant is black-on-black
 * here and would be invisible against this section.
 */
export const AboutCTA = () => {
  return (
    <section className="relative overflow-hidden section-padding bg-black text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Fades the dot field out toward the edges so it reads as texture rather
          than a tiled pattern with visible seams. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"
      />

      <div className="container-custom relative">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-4 mb-5">
            <span aria-hidden="true" className="h-px w-10 bg-gray-500 flex-shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {aboutCta.pretitle}
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-[1.1] tracking-tight">
            {aboutCta.title}
          </h2>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl">
            {aboutCta.description}
          </p>

          <Link to={aboutCta.cta.to}>
            <Button variant="light" size="md">
              {aboutCta.cta.label}
              <FaArrowRight className="text-sm" />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutCTA;
