import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '../common/Button';
import { Reveal } from '../../animations/Reveal';

export const CTASection = () => {
  return (
    <section className="section-padding bg-black text-white">
      <div className="container-custom">
        {/* One reveal for the whole block. The heading, copy and both buttons
            are a single call to action, so they arrive as a single thought. */}
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Need legal assistance?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book a consultation with our team today and let us help you find the right path forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-appointment">
              <Button variant="primary" size="md">
                Book appointment
              </Button>
            </Link>
            <a
              href="https://wa.me/233200000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="md">
                <FaWhatsapp className="text-xl" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;
