import {
  FaBalanceScale,
  FaGlobeAfrica,
  FaComments,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaStar,
  FaLock,
  FaHandshake,
  FaBullseye,
  FaEye,
  FaUserTie,
  FaFileInvoiceDollar,
  FaLightbulb,
  FaBolt,
} from 'react-icons/fa';

/**
 * Content for the About page.
 *
 * Follows the same convention as the other modules in this folder: copy and
 * icons live here as data, components stay presentational. Contact details are
 * deliberately NOT duplicated here — they come from contactInfo.js, which is
 * the single source of truth shared with the footer and the contact page.
 */

export const aboutHero = {
  pretitle: 'About the company',
  title: 'About Bafana@Law',
  description:
    'Bafana@Law is a dynamic, client-focused law firm dedicated to providing exceptional legal services to individuals, businesses, investors, and institutions. Built on integrity, professionalism, excellence, and results, we deliver practical legal solutions that meet the evolving needs of our clients.',
  primaryCta: { label: 'Book a consultation', to: '/book-appointment' },
  secondaryCta: { label: 'Learn more about us', href: '#our-story' },
};

export const companyStory = {
  pretitle: 'Our story',
  title: 'A commitment built on purpose.',
  paragraphs: [
    'Every client and every legal matter is unique. Our team combines legal expertise with a strategic approach to provide sound advice, strong representation, and effective solutions — and we take pride in relationships built on trust, transparency, and personalised service.',
    'We work across civil rights, human rights, commercial law and property, contracts, family law, foreign investment, labour and employment, and litigation. Whether you are protecting your rights, resolving a dispute, or growing your business, we safeguard your interests every step of the way.',
  ],
  highlights: [
    { id: 1, label: 'Advisory and litigation under one roof', icon: FaBalanceScale },
    { id: 2, label: 'Serving clients across Ghana and beyond', icon: FaGlobeAfrica },
    { id: 3, label: 'Plain-language advice, always', icon: FaComments },
  ],
};

export const philosophy = {
  pretitle: 'Our philosophy',
  title: 'How we practise law.',
  description:
    'Three commitments shape every matter we take on — from a first consultation to a final judgment.',
  items: [
    {
      id: 1,
      title: 'Integrity first',
      description:
        'We uphold the highest ethical standards in everything we do. You get honest counsel, even when it is not the easiest answer to hear.',
      icon: FaShieldAlt,
    },
    {
      id: 2,
      title: 'Client focus',
      description:
        'Your goals set the strategy. We listen first, explain your options in plain language, and act in your best interest throughout.',
      icon: FaUsers,
    },
    {
      id: 3,
      title: 'Results driven',
      description:
        'We combine strategy, experience, and dedication to deliver outcomes that hold up — in negotiation and in court.',
      icon: FaChartLine,
    },
  ],
};

export const companyValues = {
  pretitle: 'Our values',
  title: 'The principles that guide us.',
  items: [
    { id: 1, title: 'Integrity', description: 'We are honest, transparent, and accountable.', icon: FaShieldAlt },
    { id: 2, title: 'Excellence', description: 'We pursue the highest standards in our work every day.', icon: FaStar },
    { id: 3, title: 'Confidentiality', description: 'We protect your information with the utmost care.', icon: FaLock },
    { id: 4, title: 'Respect', description: 'We value every client, colleague, and community we serve.', icon: FaHandshake },
    { id: 5, title: 'Commitment', description: 'We stay dedicated from the first meeting to the final outcome.', icon: FaBullseye },
    { id: 6, title: 'Transparency', description: 'Clear advice, clear timelines, and clear fees.', icon: FaEye },
  ],
};

export const visionMission = {
  pretitle: 'Looking ahead',
  title: 'Vision and mission.',
  items: [
    {
      id: 1,
      title: 'Our vision',
      description:
        'To be a leading law firm recognised for excellence, integrity, and innovative legal solutions that move clients forward.',
      icon: FaEye,
    },
    {
      id: 2,
      title: 'Our mission',
      description:
        'To provide accessible, effective, and client-centred legal services while upholding the highest standards of professionalism and ethical practice.',
      icon: FaBullseye,
    },
  ],
};

export const officeLocation = {
  pretitle: 'Find us',
  title: 'Visit our office.',
  directionsCta: 'Get directions',
};

export const whyBafana = {
  pretitle: 'Why Bafana@Law',
  title: 'Why clients stay with us.',
  description:
    'Six reasons individuals, businesses, and institutions trust us with matters that matter.',
  items: [
    {
      id: 1,
      title: 'Experienced lawyers',
      description: 'A team with real courtroom and boardroom experience across a broad range of practice areas.',
      icon: FaUserTie,
    },
    {
      id: 2,
      title: 'Client-focused',
      description: 'You work with a lawyer who knows your matter — not a queue. Your goals lead the strategy.',
      icon: FaUsers,
    },
    {
      id: 3,
      title: 'Transparent fees',
      description: 'Costs are agreed up front and explained in writing. No surprises on your invoice.',
      icon: FaFileInvoiceDollar,
    },
    {
      id: 4,
      title: 'Practical advice',
      description: 'Commercially minded counsel you can act on, written in language you can use.',
      icon: FaLightbulb,
    },
    {
      id: 5,
      title: 'Ethical representation',
      description: 'We represent you within the highest professional standards — your confidence, protected.',
      icon: FaBalanceScale,
    },
    {
      id: 6,
      title: 'Fast communication',
      description: 'Calls and emails answered promptly, with regular updates as your matter progresses.',
      icon: FaBolt,
    },
  ],
};

export const aboutCta = {
  pretitle: "Let's work together",
  title: "We're here to help you move forward.",
  description:
    'Whether you need guidance, representation, or clarity, our team is ready to listen and help you take the next step with confidence.',
  cta: { label: 'Book a consultation', to: '/book-appointment' },
};
