import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navigationLinks } from '../../data/navigation';
import { Button } from '../common/Button';
import { EASE_OUT } from '../../animations/variants';
import bafanaLogo from '../../../images/bafana_logo.jpeg';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  // Reads the scroll position off a motion value rather than a React scroll
  // listener, and only sets state when the boolean actually flips — so this
  // re-renders twice per page, not on every scroll frame.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const scrolled = latest > 8;
    setIsScrolled((current) => (current === scrolled ? current : scrolled));
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    // At the top the bar is solid white, matching the page. Once the page moves
    // beneath it the bar becomes translucent and blurs what passes underneath,
    // which signals "this is floating above the content" without a hard border.
    <nav
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={bafanaLogo}
              alt="Bafana@Law"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationLinks.map(link => {
              const isActive = location.pathname === link.path;

              return (
                // The underline is a shared layoutId, so navigating slides the
                // same element to the new link rather than snapping one border
                // off and another on. It answers "where am I" during the page
                // transition, which is the one moment that question is live.
                <Link
                  key={link.id}
                  to={link.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative font-medium transition-colors ${
                    isActive ? 'text-black' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    // h-0.5 at bottom-0 sits exactly where the previous
                    // `border-b-2 border-black` did, so the nav looks unchanged
                    // at rest. Absolute positioning means it no longer adds 2px
                    // to the active link's height either, which removes a small
                    // pre-existing jitter between active and inactive links.
                    <motion.span
                      layoutId="navbar-active-underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link to="/book-appointment">
              <Button variant="primary">Book Appointment</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {isOpen && (
            // The panel previously appeared instantly, which reads as a glitch
            // rather than a transition. Sliding it down from behind the header
            // shows where it came from. Height is animated here rather than
            // transform because the panel has to push page content down — it is
            // the one place a layout-affecting animation is the correct answer,
            // and it is confined to a single small element on open/close only.
            <motion.div
              className="lg:hidden overflow-hidden border-t border-gray-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <div className="flex flex-col gap-4 mt-4 pb-6">
                {navigationLinks.map(link => (
                  <Link
                    key={link.id}
                    to={link.path}
                    className="font-medium text-gray-700 hover:text-black transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
