import {
  FaBalanceScale,
  FaGavel,
  FaHeart,
  FaHome,
  FaBriefcase,
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaPlane,
  FaLightbulb,
  FaFileContract,
  FaFileAlt,
  FaShieldAlt,
  FaLock,
  FaStar,
  FaGem,
  FaComments,
  FaTrophy,
  FaHandshake,
  FaBullseye,
  FaEye,
  FaGlobeAfrica,
  FaChartLine,
  FaFileInvoiceDollar,
  FaBolt,
} from 'react-icons/fa';

/**
 * Icon *name* -> icon component.
 *
 * The static data modules hold React components directly (`icon: FaGavel`),
 * which an API can never send. `PracticeArea.icon` on the backend is a String,
 * so anything loaded from the API arrives as a key like "gavel" and is resolved
 * here. Both sources end up rendering the same component.
 *
 * Keys are lowercase and punctuation-insensitive so "Balance Scale",
 * "balance-scale" and "balanceScale" all resolve.
 */
const ICONS = {
  balancescale: FaBalanceScale,
  gavel: FaGavel,
  heart: FaHeart,
  home: FaHome,
  briefcase: FaBriefcase,
  users: FaUsers,
  usertie: FaUserTie,
  usershield: FaUserShield,
  plane: FaPlane,
  lightbulb: FaLightbulb,
  filecontract: FaFileContract,
  filealt: FaFileAlt,
  shield: FaShieldAlt,
  shieldalt: FaShieldAlt,
  lock: FaLock,
  star: FaStar,
  gem: FaGem,
  comments: FaComments,
  trophy: FaTrophy,
  handshake: FaHandshake,
  bullseye: FaBullseye,
  target: FaBullseye,
  eye: FaEye,
  globe: FaGlobeAfrica,
  globeafrica: FaGlobeAfrica,
  chartline: FaChartLine,
  fileinvoicedollar: FaFileInvoiceDollar,
  bolt: FaBolt,
};

/** Rendered when a name is unknown, so a bad key never blanks out a card. */
export const FALLBACK_ICON = FaBalanceScale;

const normalise = (name) => String(name).toLowerCase().replace(/[^a-z]/g, '');

/**
 * Resolves an icon from either source.
 *
 * Passing a component through unchanged means a component can accept `icon`
 * without caring whether its data came from src/data or from the API.
 */
export const resolveIcon = (icon) => {
  if (!icon) return FALLBACK_ICON;
  if (typeof icon !== 'string') return icon;
  return ICONS[normalise(icon)] || FALLBACK_ICON;
};

/** The keys an admin form could offer when tagging a record with an icon. */
export const availableIconNames = Object.keys(ICONS);

export default resolveIcon;
