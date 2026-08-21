import api from './api';

/**
 * Administrator-portal API calls.
 *
 * Separate from resources.js, which serves the public website: these endpoints
 * all require a bearer token and most require a specific permission. Keeping
 * them apart means a public page can never accidentally import an
 * authenticated call, and the public bundle does not carry admin URLs.
 *
 * Every function here corresponds to a route that exists in the backend. No
 * endpoint is invented; where the API offers no operation, the interface does
 * not offer the action either.
 *
 * Responses arrive already unwrapped by the interceptor in api.js — `data` for
 * a single record, the array for a list, with `pagination` attached as a
 * non-enumerable property where the endpoint paginates.
 */

// ------------------------------------------------------------------ dashboard
export const getDashboardSummary = () => api.get('/dashboard');

// -------------------------------------------------------------------- lawyers
export const adminGetLawyers = (params = {}) => api.get('/lawyer', { params });
export const adminGetLawyer = (id) => api.get(`/lawyer/${id}`);
export const adminSearchLawyers = (q) => api.get('/lawyer/search', { params: { q } });
/** Accepts FormData when a profilePhoto is attached; api.js drops the JSON content-type for it. */
export const adminCreateLawyer = (payload) => api.post('/lawyer', payload);
export const adminUpdateLawyer = (id, payload) => api.put(`/lawyer/${id}`, payload);
export const adminDeleteLawyer = (id) => api.delete(`/lawyer/${id}`);
export const adminToggleLawyerAvailability = (id) => api.patch(`/lawyer/${id}/toggle-availability`);
export const adminVerifyLawyer = (id) => api.patch(`/lawyer/${id}/verify`);

// ------------------------------------------------------------- practice areas
export const adminGetPracticeAreas = (params = {}) => api.get('/practice-area', { params });
export const adminGetPracticeArea = (id) => api.get(`/practice-area/${id}`);
export const adminCreatePracticeArea = (payload) => api.post('/practice-area', payload);
export const adminUpdatePracticeArea = (id, payload) => api.put(`/practice-area/${id}`, payload);
export const adminDeletePracticeArea = (id) => api.delete(`/practice-area/${id}`);

// --------------------------------------------------------------- appointments
export const adminGetAppointments = (params = {}) => api.get('/appointment', { params });
export const adminGetAppointment = (id) => api.get(`/appointment/${id}`);
export const adminGetAppointmentStats = () => api.get('/appointment/stats');
export const adminUpdateAppointment = (id, payload) => api.put(`/appointment/${id}`, payload);
export const adminDeleteAppointment = (id) => api.delete(`/appointment/${id}`);
export const adminConfirmAppointment = (id) => api.patch(`/appointment/${id}/confirm`);
export const adminCompleteAppointment = (id) => api.patch(`/appointment/${id}/complete`);
export const adminCancelAppointment = (id) => api.patch(`/appointment/${id}/cancel`);

// ------------------------------------------------------------ contact enquiries
export const adminGetEnquiries = (params = {}) => api.get('/contact', { params });
export const adminGetEnquiry = (id) => api.get(`/contact/${id}`);
export const adminUpdateEnquiry = (id, payload) => api.put(`/contact/${id}`, payload);
export const adminResolveEnquiry = (id) => api.patch(`/contact/${id}/resolve`);
export const adminDeleteEnquiry = (id) => api.delete(`/contact/${id}`);

// ------------------------------------------------------------------- visitors
export const adminGetVisitors = (params = {}) => api.get('/visitor', { params });
export const adminGetVisitor = (id) => api.get(`/visitor/${id}`);
export const adminUpdateVisitor = (id, payload) => api.put(`/visitor/${id}`, payload);
export const adminCheckOutVisitor = (id) => api.patch(`/visitor/${id}/checkout`);
export const adminDeleteVisitor = (id) => api.delete(`/visitor/${id}`);

// --------------------------------------------------------------- testimonials
export const adminGetTestimonials = (params = {}) => api.get('/testimonial', { params });
export const adminGetTestimonial = (id) => api.get(`/testimonial/${id}`);
export const adminCreateTestimonial = (payload) => api.post('/testimonial', payload);
export const adminUpdateTestimonial = (id, payload) => api.put(`/testimonial/${id}`, payload);
export const adminToggleTestimonialPublished = (id) => api.patch(`/testimonial/${id}/toggle-published`);
export const adminDeleteTestimonial = (id) => api.delete(`/testimonial/${id}`);

// ---------------------------------------------------------------------- posts
export const adminGetPosts = (params = {}) => api.get('/post', { params });
export const adminGetPost = (id) => api.get(`/post/${id}`);
export const adminCreatePost = (payload) => api.post('/post', payload);
export const adminUpdatePost = (id, payload) => api.put(`/post/${id}`, payload);
export const adminDeletePost = (id) => api.delete(`/post/${id}`);

// -------------------------------------------------------------- announcements
export const adminGetAnnouncements = (params = {}) => api.get('/announcement', { params });
export const adminGetAnnouncement = (id) => api.get(`/announcement/${id}`);
export const adminCreateAnnouncement = (payload) => api.post('/announcement', payload);
export const adminUpdateAnnouncement = (id, payload) => api.put(`/announcement/${id}`, payload);
export const adminDeleteAnnouncement = (id) => api.delete(`/announcement/${id}`);

// ------------------------------------------------------------- website content
export const adminGetContent = (params = {}) => api.get('/content', { params });
export const adminGetContentById = (id) => api.get(`/content/${id}`);
export const adminCreateContent = (payload) => api.post('/content', payload);
export const adminUpdateContent = (id, payload) => api.put(`/content/${id}`, payload);
export const adminDeleteContent = (id) => api.delete(`/content/${id}`);

// ------------------------------------------------------------- administrators
export const adminGetAdministrators = (params = {}) => api.get('/administrator', { params });
export const adminGetAdministrator = (id) => api.get(`/administrator/${id}`);
export const adminCreateAdministrator = (payload) => api.post('/administrator', payload);
export const adminUpdateAdministrator = (id, payload) => api.put(`/administrator/${id}`, payload);
export const adminDeleteAdministrator = (id) => api.delete(`/administrator/${id}`);
export const adminToggleAdministratorStatus = (id) => api.patch(`/administrator/${id}/toggle-status`);

// -------------------------------------------------------------------- account
export const adminGetOwnProfile = () => api.get('/administrator/profile');
export const adminUpdateOwnProfile = (payload) => api.put('/administrator/profile', payload);
export const adminChangePassword = (payload) => api.put('/auth/change-password', payload);

// ------------------------------------------------------------------- settings
export const adminGetSettings = () => api.get('/settings');
export const adminUpdateSettings = (payload) => api.put('/settings', payload);
