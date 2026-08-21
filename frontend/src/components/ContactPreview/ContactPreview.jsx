import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { Image } from '../common/Image';
import { Reveal } from '../../animations/Reveal';
import { contactInfo } from '../../data/contactInfo';

export const ContactPreview = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          pretitle="Get in touch"
          title="Visit or contact our office"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details — one reveal for the whole column, deliberately not
              a per-row stagger. These rows are reference data: an address, a
              phone number, opening hours. Delaying them one by one to look
              elegant makes someone wait for information they came here for. */}
          <Reveal className="space-y-8">
            {/* Address */}
            <div className="flex gap-4">
              <FaMapMarkerAlt className="text-2xl text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-2">Office address</h3>
                <p className="text-gray-700">{contactInfo.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <FaPhone className="text-2xl text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-2">Phone</h3>
                <div className="space-y-1">
                  {contactInfo.phone.map((number, idx) => (
                    <p key={idx} className="text-gray-700">
                      <a href={`tel:${number}`} className="hover:text-black transition-colors">
                        {number}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <FaEnvelope className="text-2xl text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-2">Email</h3>
                <p className="text-gray-700">
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-black transition-colors">
                    {contactInfo.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4">
              <FaClock className="text-2xl text-black flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-2">Business hours</h3>
                <p className="text-gray-700">{contactInfo.businessHours.weekday}</p>
                <p className="text-gray-700 text-sm">{contactInfo.businessHours.weekend}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link to="/contact">
                <Button variant="primary" size="md">
                  Contact us <FaArrowRight />
                </Button>
              </Link>
            </div>
          </Reveal>

          {/* Map Placeholder */}
          <Reveal variant="imageReveal" delay={0.12}>
            <Image
              src={null} // Replace with: 'https://maps.googleapis.com/maps/api/staticmap?...'
              alt="Office Location Map"
              height="h-96"
              placeholderLabel={`${contactInfo.mapLocation}\n\nGoogle Map — interactive on the live site`}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;
