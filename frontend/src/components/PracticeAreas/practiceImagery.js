import lawOfficeImg from '../../../images/law_office.png';
import gavelImg from '../../../images/background-hero.png';
import receptionImg from '../../../images/login_background.png';

/**
 * Imagery for the Practice Areas page.
 *
 * The API's `imageUrl` is the real photograph for an area and always wins.
 * Until the firm uploads those, entries fall back to the site's own legal
 * photography, rotated by position. The fallbacks are atmosphere, not a
 * depiction of the area, so they are rendered with empty alt text.
 *
 * The watermarked building, low-resolution property shot and off-palette
 * dispute-resolution image in /images are deliberately left out.
 */
const FALLBACKS = [gavelImg, lawOfficeImg, receptionImg];

export const imageForArea = (area, index = 0) => ({
  src: area?.imageUrl || FALLBACKS[index % FALLBACKS.length],
  isOwnImage: Boolean(area?.imageUrl),
});

export { lawOfficeImg, gavelImg, receptionImg };

/** Two-digit entry number: 1 -> "01". */
export const entryNumber = n => String(n).padStart(2, '0');

/** Stable in-page anchor for an area, used by the hero index. */
export const areaAnchor = area => `area-${area.slug || area.id}`;
