import api, { setToken, clearToken } from './api';
import {
  adaptLawyer,
  adaptPracticeArea,
  adaptTestimonial,
  adaptPost,
  adaptAppointment,
  adaptList,
} from './adapters';

/**
 * One function per API operation the site uses.
 *
 * Components and hooks call these; nothing else imports `api` directly. That
 * keeps every URL, query parameter and adapter choice in one file, so a change
 * to an endpoint is a one-line edit here rather than a search across pages.
 */

// --------------------------------------------------------- authentication
/**
 * Signs an administrator in and stores the returned token.
 *
 * `persist` controls where the token lives — see setToken in ./api. The
 * response's administrator object is returned but is only a convenience for the
 * UI: the authoritative record comes from getCurrentAdministrator, which the
 * backend resolves from the database on every request.
 */
export const login = async ({ email, password, persist = false }) => {
  const data = await api.post('/auth/login', { email, password });
  setToken(data.token, { persist });
  return data.administrator;
};

/** The current administrator, including effective permissions. */
export const getCurrentAdministrator = () => api.get('/auth/me');

/**
 * Signs out.
 *
 * The endpoint is called for symmetry and future auditing, but a stateless JWT
 * cannot be revoked server-side — discarding the token locally is what actually
 * ends the session. The token is cleared even if the request fails, since the
 * user asked to be signed out.
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearToken();
  }
};

// ---------------------------------------------------------------- lawyers
export const getLawyers = (params = {}) =>
  api.get('/lawyer', { params }).then(adaptList(adaptLawyer));

export const getLawyerById = (id) => api.get(`/lawyer/${id}`).then(adaptLawyer);

// --------------------------------------------------------- practice areas
export const getPracticeAreas = (params = {}) =>
  api.get('/practice-area', { params }).then(adaptList(adaptPracticeArea));

/**
 * Only the areas the firm is currently advertising.
 *
 * Distinct from getPracticeAreas, which returns everything including
 * deactivated records. The API already sorts by `displayOrder` ascending
 * (practiceArea.repository.js findActive), so the order arrives correct and
 * nothing needs re-sorting here.
 */
export const getActivePracticeAreas = () =>
  api.get('/practice-area/active').then(adaptList(adaptPracticeArea));

export const getPracticeAreaBySlug = (slug) =>
  api.get(`/practice-area/slug/${slug}`).then(adaptPracticeArea);

// ----------------------------------------------------------- testimonials
export const getTestimonials = (params = {}) =>
  api.get('/testimonial', { params }).then(adaptList(adaptTestimonial));

// ------------------------------------------------------------------ blog
export const getPosts = (params = {}) =>
  api.get('/post', { params }).then(adaptList(adaptPost));

export const getPostBySlug = (slug) =>
  api.get(`/post/slug/${slug}`).then(adaptPost);

// ----------------------------------------------------------- appointments
/**
 * Books an appointment. `payload` must match the backend Zod contract:
 * clientName, clientEmail, clientPhone, lawyerId, practiceAreaId,
 * appointmentDate (YYYY-MM-DD), appointmentTime (HH:mm), subject — plus
 * optional description, duration, appointmentType, location.
 */
export const createAppointment = (payload) =>
  api.post('/appointment', payload).then(adaptAppointment);

// -------------------------------------------------------------- enquiries
/** Submits the contact form. Requires name, email, phone, subject, message. */
export const createEnquiry = (payload) => api.post('/contact', payload);

// ------------------------------------------------------------ announcements
export const getAnnouncements = () => api.get('/announcement');

// ----------------------------------------------------------------- content
export const getContentByKey = (pageKey) => api.get(`/content/key/${pageKey}`);

// ---------------------------------------------------------------- settings
export const getSettings = () => api.get('/settings');
