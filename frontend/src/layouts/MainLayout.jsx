import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../components/Navbar/Navbar';
import { Footer } from '../components/Footer/Footer';
import { EASE_OUT } from '../animations/variants';

/**
 * Page transition.
 *
 * The crossfade wraps <Outlet /> rather than <Routes>. Keying <Routes> on the
 * pathname would remount this entire layout on every navigation — the navbar
 * would flash and lose its sticky position, and the footer would rebuild for no
 * reason. Wrapping the outlet keeps the chrome mounted and transitions only the
 * page body.
 *
 * mode="wait" lets the outgoing page finish before the incoming one starts, so
 * the two never overlap and push each other around. initial={false} suppresses
 * the transition on first paint — the landing page should simply be there.
 */
const pageTransition = {
  // A little vertical travel makes the change of page legible — a pure opacity
  // crossfade at this speed is easy to miss entirely.
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
