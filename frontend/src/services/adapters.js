/**
 * Backend shape -> frontend shape.
 *
 * The static data modules in src/data were written before the API existed, so
 * their field names diverged from the Mongoose models. Rather than renaming
 * backend fields — which would churn a documented, tested API contract — every
 * translation happens here, in one file. Components keep the prop names they
 * already use.
 *
 * Known differences this reconciles:
 *   _id                -> id
 *   fullName           -> name           (Lawyer)
 *   yearsOfExperience  -> yearsExperience (Lawyer)
 *   name               -> title          (PracticeArea)
 *   clientName         -> name           (Testimonial)
 */

const withId = (doc = {}) => ({ ...doc, id: doc._id ?? doc.id });

export const adaptLawyer = (doc = {}) => ({
  ...withId(doc),
  name: doc.fullName ?? doc.name ?? '',
  // `title` was added to the Lawyer model for exactly this; older records
  // predate it, so fall back to an empty string rather than rendering
  // "undefined • Corporate Law".
  title: doc.title ?? '',
  specialization: doc.specialization ?? '',
  bio: doc.bio ?? '',
  yearsExperience: doc.yearsOfExperience ?? doc.yearsExperience ?? 0,
  profileImageUrl: doc.profileImageUrl ?? null,
  practiceAreas: Array.isArray(doc.practiceAreas)
    ? doc.practiceAreas.map(area =>
        typeof area === 'object' ? adaptPracticeArea(area) : area
      )
    : [],
});

export const adaptPracticeArea = (doc = {}) => ({
  ...withId(doc),
  title: doc.name ?? doc.title ?? '',
  description: doc.description ?? '',
  slug: doc.slug ?? '',
  // The API stores an icon *key* (a string); components need a component.
  // Resolution happens at render time via lib/iconRegistry so this module has
  // no React dependency.
  iconName: doc.icon ?? null,
  iconUrl: doc.iconUrl ?? null,
  // The card's photograph, distinct from iconUrl above. Kept separate because
  // an icon and a 16:10 header image are not interchangeable — rendering one
  // in the other's slot looks broken.
  imageUrl: doc.imageUrl ?? null,
  lawyers: Array.isArray(doc.lawyers)
    ? doc.lawyers.map(lawyer =>
        typeof lawyer === 'object' ? adaptLawyer(lawyer) : lawyer
      )
    : [],
});

export const adaptTestimonial = (doc = {}) => ({
  ...withId(doc),
  name: doc.clientName ?? doc.name ?? '',
  role: doc.role ?? '',
  rating: doc.rating ?? 5,
  text: doc.text ?? '',
});

export const adaptPost = (doc = {}) => ({
  ...withId(doc),
  title: doc.title ?? '',
  slug: doc.slug ?? '',
  excerpt: doc.excerpt ?? '',
  body: doc.body ?? '',
  coverImageUrl: doc.coverImageUrl ?? null,
  tags: doc.tags ?? [],
  publishedAt: doc.publishedAt ?? null,
  authorName: doc.author?.fullName ?? '',
});

export const adaptAppointment = (doc = {}) => ({
  ...withId(doc),
  clientName: doc.clientName ?? '',
  clientEmail: doc.clientEmail ?? '',
  subject: doc.subject ?? '',
  status: doc.status ?? 'pending',
  appointmentDate: doc.appointmentDate ?? null,
  appointmentTime: doc.appointmentTime ?? '',
});

/** Maps an adapter over a list, tolerating a null or non-array response. */
export const adaptList = (adapter) => (docs) =>
  Array.isArray(docs) ? docs.map(adapter) : [];
