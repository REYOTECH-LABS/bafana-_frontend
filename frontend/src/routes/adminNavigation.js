import {
  FaChartPie,
  FaUserTie,
  FaBalanceScale,
  FaCalendarCheck,
  FaEnvelopeOpenText,
  FaIdBadge,
  FaQuoteRight,
  FaNewspaper,
  FaBullhorn,
  FaFileAlt,
  FaUserShield,
  FaCog,
  FaUserCircle,
} from 'react-icons/fa';

import { PERMISSIONS } from '../lib/permissions';

/**
 * The administrator portal's navigation.
 *
 * Every entry corresponds to a route that exists in this backend and is gated
 * on a permission the backend actually enforces. Items with no API behind them
 * are deliberately absent — a menu entry leading to a page that cannot load is
 * worse than no entry at all.
 *
 * Two things the approved sidebar sketch listed are **not** here:
 *
 *   Analytics          no analytics endpoint exists; the dashboard already
 *                      carries the figures the API can supply
 *   Roles & Permissions not a separate resource. Roles are a field on the
 *                      administrator record, so they are edited on the
 *                      Administrators page, where the reference PDF also
 *                      presents them
 *
 * Hiding an item is a convenience, never a security boundary: the backend
 * rejects an unauthorised request regardless of what the sidebar showed.
 */
export const ADMIN_NAV = [
  {
    heading: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: '/admin/dashboard',
        icon: FaChartPie,
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    heading: 'Practice',
    items: [
      { label: 'Lawyers', to: '/admin/lawyers', icon: FaUserTie, permission: PERMISSIONS.LAWYER_VIEW },
      { label: 'Practice areas', to: '/admin/practice-areas', icon: FaBalanceScale, permission: PERMISSIONS.PRACTICE_AREA_VIEW },
      { label: 'Appointments', to: '/admin/appointments', icon: FaCalendarCheck, permission: PERMISSIONS.APPOINTMENT_VIEW },
      { label: 'Enquiries', to: '/admin/enquiries', icon: FaEnvelopeOpenText, permission: PERMISSIONS.CONTACT_ENQUIRY_VIEW },
      { label: 'Visitors', to: '/admin/visitors', icon: FaIdBadge, permission: PERMISSIONS.VISITOR_VIEW },
    ],
  },
  {
    heading: 'Content',
    items: [
      { label: 'Testimonials', to: '/admin/testimonials', icon: FaQuoteRight, permission: PERMISSIONS.TESTIMONIAL_VIEW },
      { label: 'Posts', to: '/admin/posts', icon: FaNewspaper, permission: PERMISSIONS.POST_VIEW },
      { label: 'Announcements', to: '/admin/announcements', icon: FaBullhorn, permission: PERMISSIONS.ANNOUNCEMENT_VIEW },
      { label: 'Website content', to: '/admin/content', icon: FaFileAlt, permission: PERMISSIONS.CONTENT_VIEW },
    ],
  },
  {
    heading: 'Administration',
    items: [
      { label: 'Administrators', to: '/admin/administrators', icon: FaUserShield, permission: PERMISSIONS.ADMINISTRATOR_VIEW },
      { label: 'Settings', to: '/admin/settings', icon: FaCog, permission: PERMISSIONS.SETTINGS_VIEW },
    ],
  },
  {
    heading: 'Account',
    items: [
      // No permission gate: every administrator can reach their own profile,
      // and the backend grants profile:view to both roles.
      { label: 'My profile', to: '/admin/profile', icon: FaUserCircle },
    ],
  },
];

/**
 * Drops sections the administrator cannot use.
 *
 * A section whose every item is hidden would otherwise leave a heading with
 * nothing under it.
 */
export const visibleNavigation = (hasPermission) =>
  ADMIN_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.permission || hasPermission(item.permission)),
  })).filter((section) => section.items.length > 0);

export default ADMIN_NAV;
