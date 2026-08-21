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
      <OfficeLocation />
      <WhyChooseBafana />
      <AboutCTA />
    </main>
  );
};

export default About;
