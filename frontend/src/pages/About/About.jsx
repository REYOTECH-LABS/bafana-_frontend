import { AboutHero } from "../../components/About/AboutHero";
import { CompanyStory } from "../../components/About/CompanyStory";
import { Philosophy } from "../../components/About/Philosophy";
import { CompanyValues } from "../../components/About/CompanyValues";
import { VisionMission } from "../../components/About/VisionMission";
import { OfficeLocation } from "../../components/About/OfficeLocation";
import { WhyChooseBafana } from "../../components/About/WhyChooseBafana";
import { AboutCTA } from "../../components/About/AboutCTA";

export const About = () => {
  return (
    <main>
      <AboutHero />
      <CompanyStory />
      <Philosophy />
      <CompanyValues />
      <VisionMission />
      {/* Reasons come before the office, so the page closes on an invitation:
          where to find us, then how to book. */}
      <WhyChooseBafana />
      <OfficeLocation />
      <AboutCTA />
    </main>
  );
};

export default About;
