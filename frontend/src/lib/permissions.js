/**
 * Permission names, mirroring shared/permissions.js in the backend.
 *
 * Duplicated deliberately rather than fetched: these are compile-time constants
 * used to decide what to render, and a typo in a literal string would silently
 * hide a menu item with no error anywhere. Naming them here turns that into an
 * undefined import instead.
 *
 * The backend remains the authority. Everything here only decides what to
 * *show*; the API independently rejects any request the account may not make.
 * Keep in step with src/backend/shared/permissions.js.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',

  LAWYER_VIEW: 'lawyer:view',
  LAWYER_CREATE: 'lawyer:create',
  LAWYER_UPDATE: 'lawyer:update',
  LAWYER_DELETE: 'lawyer:delete',

  PRACTICE_AREA_VIEW: 'practice_area:view',
  PRACTICE_AREA_CREATE: 'practice_area:create',
  PRACTICE_AREA_UPDATE: 'practice_area:update',
  PRACTICE_AREA_DELETE: 'practice_area:delete',

  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',

  ANNOUNCEMENT_VIEW: 'announcement:view',
  ANNOUNCEMENT_CREATE: 'announcement:create',
  ANNOUNCEMENT_UPDATE: 'announcement:update',
  ANNOUNCEMENT_DELETE: 'announcement:delete',

  TESTIMONIAL_VIEW: 'testimonial:view',
  TESTIMONIAL_CREATE: 'testimonial:create',
  TESTIMONIAL_UPDATE: 'testimonial:update',
  TESTIMONIAL_DELETE: 'testimonial:delete',

  POST_VIEW: 'post:view',
  POST_CREATE: 'post:create',
  POST_UPDATE: 'post:update',
  POST_DELETE: 'post:delete',

  APPOINTMENT_VIEW: 'appointment:view',
  APPOINTMENT_UPDATE: 'appointment:update',
  APPOINTMENT_DELETE: 'appointment:delete',

  VISITOR_VIEW: 'visitor:view',
  VISITOR_UPDATE: 'visitor:update',
  VISITOR_DELETE: 'visitor:delete',

  CONTACT_ENQUIRY_VIEW: 'contact_enquiry:view',
  CONTACT_ENQUIRY_UPDATE: 'contact_enquiry:update',
  CONTACT_ENQUIRY_DELETE: 'contact_enquiry:delete',

  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  ADMINISTRATOR_VIEW: 'administrator:view',
  ADMINISTRATOR_CREATE: 'administrator:create',
  ADMINISTRATOR_UPDATE: 'administrator:update',
  ADMINISTRATOR_DELETE: 'administrator:delete',
  ADMINISTRATOR_MANAGE_ROLES: 'administrator:manage_roles',
  ADMINISTRATOR_MANAGE_PERMISSIONS: 'administrator:manage_permissions',

  PROFILE_VIEW: 'profile:view',
  PROFILE_UPDATE: 'profile:update',
  PASSWORD_CHANGE: 'password:change',
};

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SUPER_ADMIN]: 'Super admin',
};

/** Human wording for a permission string, for the administrator detail view. */
export const describePermission = (permission) => {
  const [module, action] = String(permission).split(':');
  const readableModule = module.replace(/_/g, ' ');
  const readableAction = action?.replace(/_/g, ' ') ?? '';
  return `${readableAction} ${readableModule}`.trim();
};

export default PERMISSIONS;
