# Bafana At Law - Frontend

A modern, production-quality React website for a premium law firm. Built with React 19, Vite, React Router, and Tailwind CSS.

## 🎯 Project Overview

This frontend implements the complete public-facing website for Bafana At Law, a legal services firm. The site features:

- **Fully Designed Homepage** with 8 comprehensive sections
- **Responsive Multi-Page Layout** using React Router (8 distinct routes)
- **Professional UI Components** built with Tailwind CSS
- **Static Data Models** for lawyers, practice areas, testimonials, and more
- **Zero Backend Dependencies** — pure frontend, ready for API integration later

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
cd src/frontend
npm install
```

### Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000` (or your configured port).

### Production Build

```bash
npm run build
```

Output goes to the `dist/` folder.

## 📁 Project Structure

```
src/frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons (future)
│   ├── components/     # Reusable React components
│   │   ├── common/     # Button, SectionHeading, ComingSoon, etc.
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── AboutPreview/
│   │   ├── PracticeAreas/
│   │   ├── Lawyers/
│   │   ├── WhyChooseUs/
│   │   ├── Testimonials/
│   │   ├── CTA/
│   │   ├── ContactPreview/
│   │   └── Footer/
│   ├── data/           # Static data files
│   │   ├── statistics.js
│   │   ├── practiceAreas.js
│   │   ├── lawyers.js
│   │   ├── testimonials.js
│   │   ├── whyChooseUs.js
│   │   ├── navigation.js
│   │   └── contactInfo.js
│   ├── pages/          # Page components (one per route)
│   │   ├── Home/
│   │   ├── About/
│   │   ├── PracticeAreas/
│   │   ├── Lawyers/
│   │   ├── Testimonials/
│   │   ├── Blog/
│   │   ├── Contact/
│   │   └── Appointment/
│   ├── layouts/        # Shared layout components
│   │   └── MainLayout.jsx
│   ├── routes/         # Routing configuration
│   │   └── AppRoutes.jsx
│   ├── styles/         # Global styles
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## 🎨 Features

### Homepage Sections
1. **Hero** — Eye-catching introduction with statistics
2. **About Preview** — Company mission, vision, and values
3. **Practice Areas** — 9-card grid of legal specialties
4. **Featured Lawyers** — 4 lawyer profiles
5. **Why Choose Us** — 6 key advantages
6. **Testimonials** — 3 client testimonials
7. **CTA Section** — Call-to-action for consultation booking
8. **Contact Preview** — Office details and map placeholder

### Routes
- `/` — Homepage (fully built)
- `/about` — About Us (placeholder)
- `/practice-areas` — Practice Areas (placeholder)
- `/lawyers` — Our Lawyers (placeholder)
- `/testimonials` — Testimonials (placeholder)
- `/blog` — Blog (placeholder)
- `/contact` — Contact Us (placeholder)
- `/book-appointment` — Book Appointment (placeholder)

### Components
All components are:
- ✅ Reusable and composable
- ✅ Properly typed with JSDoc
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Accessible (semantic HTML, ARIA labels where needed)
- ✅ Tailwind-styled (no external UI libraries)

### Data Management
Static data is organized in `src/data/`:
- No API calls or fetch logic
- Easily replaceable with backend APIs later
- Typed and well-commented

## 🎯 Design System

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, modern)

### Color Palette
- **Primary**: Black (`#000000`)
- **Secondary**: White (`#FFFFFF`)
- **Gray**: 50-900 scale for accents and backgrounds
- **Accent**: Dark gray for subtle highlights

### Spacing & Layout
- Mobile-first responsive design
- Container max-width: 80rem (1280px)
- Section padding: 4rem–8rem (vertical)
- Grid layouts: auto-responsive (1 col mobile → 2/3/4 cols desktop)

## 🔄 Future Backend Integration

This frontend is **completely decoupled from the backend**. To integrate APIs later:

1. Create service files in `src/services/` (e.g., `lawyerService.js`)
2. Replace static data imports with fetch calls
3. Add loading/error states to components
4. Wire up authentication when needed

Example integration pattern:
```js
// Before (static data)
import { lawyers } from '../../data/lawyers';

// After (with API)
const [lawyers, setLawyers] = useState([]);
useEffect(() => {
  fetchLawyers().then(setLawyers);
}, []);
```

## 📦 Dependencies

### Core
- **react**: ^19.0.0
- **react-dom**: ^19.0.0
- **react-router-dom**: ^7.0.0

### UI & Icons
- **react-icons**: ^5.0.0
- **tailwindcss**: ^3.4.0

### Build Tools
- **vite**: ^5.0.0
- **postcss**: ^8.4.0
- **autoprefixer**: ^10.4.0

## 🧪 Testing & QA

### Verification Checklist
- [ ] Dev server starts: `npm run dev`
- [ ] All routes navigate without page reload (React Router working)
- [ ] Homepage renders all 8 sections correctly
- [ ] Responsive design: test on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Links use `<Link>` (not `<a>`) for internal navigation
- [ ] No console errors or warnings
- [ ] Navbar shows mobile menu on small screens
- [ ] Images use `ImagePlaceholder` component
- [ ] All buttons have proper hover/focus states
- [ ] Footer has proper links and layout

## 📝 Development Notes

### Code Quality
- Clean, maintainable component structure
- Reusable utilities and helpers
- No prop drilling (context or composition patterns)
- Single responsibility per component
- Clear, semantic naming conventions

### Performance
- Code splitting via React Router (lazy loading ready)
- Optimized re-renders (memo where appropriate)
- Efficient Tailwind CSS usage
- No unnecessary dependencies

### Accessibility
- Semantic HTML structure
- ARIA labels for icons
- Keyboard navigation support
- Color contrast compliance
- Mobile-friendly touch targets

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
The built `dist/` folder can be deployed to:
- Netlify
- GitHub Pages
- Firebase Hosting
- Any static host

## 📖 Documentation

- **Figma Design**: See the provided 8-page PDF for visual reference
- **Backend Integration**: See `docs/04_architecture_ci/` for API contracts
- **Tailwind Setup**: See `tailwind.config.js` for custom configuration

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev)

## 📞 Support

For issues or questions:
1. Check the project structure and component organization
2. Review existing components for patterns
3. Check `.env.example` for required environment variables
4. Review git history for recent changes

## 📄 License

Proprietary — Bafana At Law

---

**Built with ❤️ by Team Nexux**
