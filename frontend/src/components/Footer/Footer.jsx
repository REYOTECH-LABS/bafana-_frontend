import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { navigationLinks } from '../../data/navigation';
import { practiceAreas } from '../../data/practiceAreas';
import { contactInfo } from '../../data/contactInfo';

export const Footer = () => {
  const quickLinks = navigationLinks.filter(link => link.label !== 'Home');
  const practiceAreasForFooter = practiceAreas.slice(0, 6);

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-serif font-bold mb-4 block">
              BAFANA@LAW
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Justice, integrity, and results — trusted legal counsel for individuals, families, and businesses across Ghana.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick links</h3>
            <ul className="space-y-2">
              {quickLinks.slice(0, 5).map(link => (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="font-semibold text-white mb-4">Practice areas</h3>
            <ul className="space-y-2">
              {practiceAreasForFooter.map(area => (
                <li key={area.id}>
                  <p className="text-gray-400 text-sm">
                    {area.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <p className="text-gray-400 text-sm mb-2">
              {contactInfo.address}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <a href={`tel:${contactInfo.phone[0]}`} className="hover:text-white transition-colors">
                {contactInfo.phone[0]}
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                {contactInfo.email}
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social & Legal */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <FaLinkedin />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <FaInstagram />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-right">
              © 2026 Bafana At Law. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="space-x-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
