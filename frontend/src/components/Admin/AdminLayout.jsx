import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaChevronLeft, FaBalanceScale } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { visibleNavigation } from '../../routes/adminNavigation';
import { ROLE_LABELS } from '../../lib/permissions';
import { ADMIN_LOGIN_PATH } from '../../routes/adminPaths';
import NoIndex from './NoIndex';

/**
 * The portal shell: sidebar, header, content.
 *
 * Deliberately separate from MainLayout, which carries the public navbar and
 * footer. Nothing about the public site appears here, and no public page links
 * inward.
 *
 * The reference report PDF shows no application chrome because it is an export,
 * not the application. The interactive portal needs navigation; the report view
 * strips it. Both are the same design system.
 */

const initialsOf = (name) =>
  String(name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A';

const NavItem = ({ item, onNavigate, collapsed }) => (
  <NavLink
    to={item.to}
    onClick={onNavigate}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-portal-ink text-white font-semibold'
          : 'text-portal-muted hover:text-portal-ink hover:bg-portal-raised'
      } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
    }
  >
    <item.icon aria-hidden="true" className="text-sm flex-shrink-0" />
    <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
  </NavLink>
);

export const AdminLayout = () => {
  const { administrator, hasPermission, signOut, isSuperAdmin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const sections = visibleNavigation(hasPermission);

  // Close the mobile drawer on navigation, otherwise it stays over the page
  // the visitor just asked for.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll behind the drawer so the page underneath does not move.
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate(ADMIN_LOGIN_PATH, { replace: true });
  };

  const sidebarInner = (
    <>
      <div className={`flex items-center gap-3 px-3 py-5 ${collapsed ? 'lg:justify-center' : ''}`}>
        <span className="w-9 h-9 rounded-lg bg-portal-ink flex items-center justify-center flex-shrink-0">
          <FaBalanceScale aria-hidden="true" className="text-sm text-white" />
        </span>
        <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
          <p className="font-serif font-bold text-portal-ink leading-tight">BAFANA@LAW</p>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-portal-subtle">
            Admin portal
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6" aria-label="Portal sections">
        {sections.map((section) => (
          <div key={section.heading}>
            <p
              className={`px-3 mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-subtle ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              {section.heading}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-portal-border p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-portal-muted hover:text-state-dangerFg hover:bg-state-dangerBg transition-colors ${
            collapsed ? 'lg:justify-center lg:px-2' : ''
          }`}
        >
          <FaSignOutAlt aria-hidden="true" className="text-sm flex-shrink-0" />
          <span className={collapsed ? 'lg:hidden' : ''}>Sign out</span>
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm text-portal-subtle hover:text-portal-ink hover:bg-portal-raised transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FaChevronLeft
            aria-hidden="true"
            className={`text-xs flex-shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
          <span className={collapsed ? 'lg:hidden' : ''}>Collapse</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-portal-bg">
      {/* The portal must never be indexed. NoIndex removes the tag on unmount,
          so the public site's indexing is unaffected. */}
      <NoIndex />

      {/* ---------------------------------------------------- desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col bg-portal-surface border-r border-portal-border transition-all duration-200 ${
          collapsed ? 'w-[4.5rem]' : 'w-64'
        }`}
      >
        {sidebarInner}
      </aside>

      {/* ----------------------------------------------------- mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-portal-ink/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-portal-surface border-r border-portal-border flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Portal navigation"
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 p-2 text-portal-subtle hover:text-portal-ink"
            >
              <FaTimes />
            </button>
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* ------------------------------------------------------------ content */}
      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-20 bg-portal-surface/95 backdrop-blur border-b border-portal-border">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 text-portal-ink rounded-lg hover:bg-portal-raised"
              aria-label="Open navigation"
            >
              <FaBars />
            </button>

            <div className="lg:hidden font-serif font-bold text-portal-ink">BAFANA@LAW</div>

            <div className="hidden lg:block" />

            <NavLink
              to="/admin/profile"
              className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-portal-raised transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-portal-ink leading-tight">
                  {administrator?.fullName ?? 'Administrator'}
                </p>
                <p className="text-xs text-portal-subtle">
                  {ROLE_LABELS[administrator?.role] ?? administrator?.role}
                </p>
              </div>
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  isSuperAdmin ? 'bg-portal-ink text-white' : 'bg-portal-raised text-portal-ink border border-portal-border'
                }`}
              >
                {initialsOf(administrator?.fullName)}
              </span>
            </NavLink>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[100rem] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
