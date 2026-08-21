import { useAuth } from '../../context/AuthContext';

/**
 * Renders children only when the administrator holds the permission.
 *
 * This is a usability device, not a security control. It keeps the interface
 * from offering an action that would come back 403 — nothing more. Every
 * endpoint behind these controls enforces the same permission independently,
 * so editing this state in a browser console yields a rejected request rather
 * than access.
 *
 *   <PermissionGate permission={PERMISSIONS.LAWYER_CREATE}>
 *     <Button>Add lawyer</Button>
 *   </PermissionGate>
 *
 * `anyOf` covers a control that several permissions could justify.
 * `fallback` renders in place of the children when the check fails, for the
 * cases where silence would be confusing.
 */
export const PermissionGate = ({ permission, anyOf, fallback = null, children }) => {
  const { hasPermission } = useAuth();

  const allowed = anyOf
    ? anyOf.some((candidate) => hasPermission(candidate))
    : hasPermission(permission);

  return allowed ? children : fallback;
};

/** Hook form, for deciding inside logic rather than markup. */
export const usePermission = (permission) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

export default PermissionGate;
