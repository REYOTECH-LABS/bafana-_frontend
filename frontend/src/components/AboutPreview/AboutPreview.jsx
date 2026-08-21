import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "../common/Button";
import { Image } from "../common/Image";
import { Reveal } from "../../animations/Reveal";
import lawOfficeImg from "../../../images/law_office.png";

export const AboutPreview = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* The two columns arrive as a pair: the image settles in with a slight
            scale, the copy slides in from its own outer edge. Note the image is
            the LEFT column here — the brief's "image from the right" would send
            the two columns flying across each other. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <Reveal variant="imageReveal">
            <Image
              src={lawOfficeImg}
              alt="Bafana At Law Office"
              height="h-[40rem]"
              placeholderLabel="Law Office"
            />
          </Reveal>

          {/* Content */}
          <Reveal variant="slideInRight">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-600 mb-4">
              About Bafana@Law
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
              Dedicated to justice.
              <br />
              Committed to you.
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Bafana At Law is a dynamic, client-focused firm built on a simple
              belief: everyone deserves clear, honest, and capable legal
              counsel. We pair deep courtroom experience with a practical,
              people-first approach — so you always understand your options and
              feel supported at every step.
            </p>

            {/* Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <span className="text-xl"></span>
                  Our Vision
                </h3>
                <p className="text-sm text-gray-600">
                  To be the most trusted legal partner, known for excellence and
                  integrity.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <span className="text-xl"></span>
                  Our Mission
                </h3>
                <p className="text-sm text-gray-600">
                  To deliver accessible, effective, client-centred counsel of
                  the highest standard.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <span className="text-xl"></span>
                  Our Values
                </h3>
                <p className="text-sm text-gray-600">
                  Integrity, confidentiality, respect, and an unwavering
                  commitment to results.
                </p>
              </div>
            </div>

            <Link to="/about">
              <Button variant="secondary" size="md">
                Learn more about us <FaArrowRight />
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
