import { Reveal } from "../../animations/Reveal";
import { Image } from "../common/Image";
import { companyStory } from "../../data/about";
import lawOfficeImg from "../../../images/law_office.png";

/**
 * Our Story — image left, narrative right, closing with a three-item
 * capability list.
 *
 * The image is intentionally left without a source. The prototype shows an
 * upload placeholder here ("drop your office or library photo"), so no asset
 * was supplied. The shared Image component already renders the project's
 * standard placeholder when `src` is null — the same pattern the contact map
 * uses — so dropping a real photo in later is a one-line change.
 */
export const CompanyStory = () => {
  return (
    <section id="our-story" className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <Reveal variant="imageReveal">
            <Image
              src={lawOfficeImg}
              alt="The Bafana@Law office"
              height="h-[24rem] md:h-[32rem]"
              placeholderLabel="Office or library photo"
            />
          </Reveal>

          {/* Content */}
          <Reveal variant="slideInRight">
            <div className="flex items-center gap-4 mb-5">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-gray-400 flex-shrink-0"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                {companyStory.pretitle}
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-[1.1] tracking-tight">
              {companyStory.title}
            </h2>

            {companyStory.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg text-gray-600 leading-relaxed mb-5"
              >
                {paragraph}
              </p>
            ))}

            {/* Capability list. Divided by a rule from the prose above so it
                reads as a summary rather than a fourth paragraph. */}
            <ul className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {companyStory.highlights.map(({ id, label, icon: Icon }) => (
                <li key={id} className="flex flex-col gap-3">
                  <Icon aria-hidden="true" className="text-xl text-black" />
                  <span className="text-sm text-gray-600 leading-snug">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
