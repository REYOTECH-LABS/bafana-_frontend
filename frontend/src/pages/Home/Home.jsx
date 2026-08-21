import { Hero } from '../../components/Hero/Hero';
import { AboutPreview } from '../../components/AboutPreview/AboutPreview';
import { PracticeAreas } from '../../components/PracticeAreas/PracticeAreas';
import { FeaturedLawyers } from '../../components/Lawyers/FeaturedLawyers';
import { WhyChooseUsSection } from '../../components/WhyChooseUs/WhyChooseUs';
import { TestimonialsPreview } from '../../components/Testimonials/TestimonialsPreview';
import { CTASection } from '../../components/CTA/CTASection';
import { ContactPreview } from '../../components/ContactPreview/ContactPreview';

export const Home = () => {
  return (
    <main>
      <Hero />
      <AboutPreview />
      <PracticeAreas />
      <FeaturedLawyers />
      <WhyChooseUsSection />
      <TestimonialsPreview />
      <CTASection />
      <ContactPreview />
    </main>
  );
};

export default Home;
