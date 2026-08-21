import { SectionHeading } from '../../components/common/SectionHeading';
import { ContactForm } from '../../components/Contact/ContactForm';
import { OfficeLocation } from '../../components/About/OfficeLocation';
import { Reveal } from '../../animations/Reveal';

/**
 * Contact page.
 *
 * The office details and map are the same `OfficeLocation` component the About
 * page uses — it already reads from contactInfo, so both pages stay in step and
 * there is one component to change when the office moves.
 */
export const Contact = () => {
  return (
    <main>
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeading
            pretitle="Contact us"
            title="Let's talk about your matter."
            description="Send us a message and a member of our team will respond shortly. Everything you share is treated in confidence."
          />

          <Reveal className="max-w-3xl mx-auto">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <OfficeLocation />
    </main>
  );
};

export default Contact;
