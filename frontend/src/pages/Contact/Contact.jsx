import { ContactHero } from '../../components/Contact/ContactHero';
import { ContactOptions } from '../../components/Contact/ContactOptions';
import { ContactFormSection } from '../../components/Contact/ContactFormSection';
import { QuickAnswers } from '../../components/Contact/QuickAnswers';
import { ContactCTA } from '../../components/Contact/ContactCTA';
import { OfficeLocation } from '../../components/About/OfficeLocation';

/**
 * Contact page.
 *
 * Hero on the firm's building → the four ways to reach us → the enquiry form
 * → office details and map → quick answers → booking prompt.
 *
 * The office details and map are the same `OfficeLocation` component the About
 * page uses — it already reads from contactInfo, so both pages stay in step and
 * there is one component to change when the office moves.
 */
export const Contact = () => {
  return (
    <main>
      <ContactHero />
      <ContactOptions />
      <ContactFormSection />
      {/* Anchor target for "See the map" and the quick answers. scroll-mt
          clears the sticky navbar. */}
      <div id="visit-our-office" className="scroll-mt-20">
        <OfficeLocation />
      </div>
      <QuickAnswers />
      <ContactCTA />
    </main>
  );
};

export default Contact;
