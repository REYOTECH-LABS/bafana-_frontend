import { SectionHeading } from '../../components/common/SectionHeading';
import { AppointmentForm } from '../../components/Appointment/AppointmentForm';
import { Reveal } from '../../animations/Reveal';

export const Appointment = () => {
  return (
    <main>
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeading
            pretitle="Book a consultation"
            title="Request an appointment."
            description="Tell us who you need to see and when. We will confirm your consultation by email."
          />

          <Reveal className="max-w-3xl mx-auto">
            <AppointmentForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Appointment;
