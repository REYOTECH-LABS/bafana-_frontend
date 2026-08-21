import { useEffect } from 'react';

/**
 * Adds `<meta name="robots" content="noindex, nofollow">` while mounted.
 *
 * Injected here rather than placed in index.html because this is a single-page
 * app: one shared shell serves the public site too, so a static tag would
 * deindex the whole of Bafana@Law.
 *
 * This is a crawler courtesy, not a security control. Anyone can request an
 * admin URL directly; what protects the data is that every administrator
 * endpoint independently enforces authentication and permissions.
 */
export const NoIndex = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    return () => {
      // Removed on unmount so navigating back to a public page does not leave
      // the whole site marked noindex for the rest of the visit.
      document.head.removeChild(meta);
    };
  }, []);

  return null;
};

export default NoIndex;
