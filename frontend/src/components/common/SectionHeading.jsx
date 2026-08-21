import { Reveal } from '../../animations/Reveal';

export const SectionHeading = ({
  pretitle,
  title,
  description,
  centered = true,
  className = ''
}) => {
  return (
    // Every section opens with this heading, so the reveal lives here rather
    // than being repeated in each of the eight section components.
    <Reveal className={`mb-14 md:mb-20 ${centered ? 'text-center' : ''} ${className}`}>
      {pretitle && (
        // Matched to the hero eyebrow — same size, weight and letter-spacing,
        // with the same short rule alongside it. Repeating one label treatment
        // across every section is most of what makes a page feel designed
        // rather than assembled.
        <div
          className={`flex items-center gap-4 mb-5 ${centered ? 'justify-center' : ''}`}
        >
          <span aria-hidden="true" className="h-px w-10 bg-gray-400 flex-shrink-0" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            {pretitle}
          </p>
          {centered && (
            <span aria-hidden="true" className="h-px w-10 bg-gray-400 flex-shrink-0" />
          )}
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-[1.1] tracking-tight">
        {title}
      </h2>
      {description && (
        <p
          className={`text-lg text-gray-600 max-w-2xl leading-relaxed ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
};

export default SectionHeading;
