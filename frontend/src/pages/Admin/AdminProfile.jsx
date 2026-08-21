import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminUpdateOwnProfile, adminChangePassword } from '../../services/adminResources';
import { ROLE_LABELS, describePermission } from '../../lib/permissions';
import {
  PageHeader,
  SectionCard,
  Button,
  StatusBadge,
} from '../../components/Admin/ui/primitives';
import { FormField, FormError } from '../../components/Admin/ui/FormField';

/**
 * The administrator's own account.
 *
 * Self-service edits are limited to name and email. Role, permissions and
 * active status are absent by design — the backend's profile schema rejects
 * them outright, which is what stops an admin from promoting themselves by
 * editing a request.
 */

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

const ProfileSection = ({ administrator, onSaved }) => {
  const { notify } = useToast();
  const [form, setForm] = useState({
    fullName: administrator?.fullName ?? '',
    email: administrator?.email ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await adminUpdateOwnProfile(form);
      notify('Profile updated.');
      await onSaved();
    } catch (updateError) {
      setError(updateError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full name" name="fullName" required value={form.fullName} onChange={update('fullName')} />
        <FormField label="Email" name="email" type="email" required value={form.email} onChange={update('email')} />
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" loading={submitting}>
          Save profile
        </Button>
      </div>
    </form>
  );
};

const PasswordSection = () => {
  const { notify } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFieldError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Checked here rather than server-side because the API takes only two
    // fields; the confirmation exists to catch a typo before it becomes the
    // new password.
    if (form.newPassword !== form.confirmPassword) {
      setFieldError('The new passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await adminChangePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      notify('Password changed.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (changeError) {
      setError(changeError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <div className="space-y-4">
        <FormField
          label="Current password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={update('currentPassword')}
        />
        <FormField
          label="New password"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          value={form.newPassword}
          onChange={update('newPassword')}
          hint="At least 8 characters, and different from the current one."
        />
        <FormField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={fieldError}
        />
      </div>

      <p className="mt-4 text-xs text-portal-subtle">
        Changing your password does not sign out sessions elsewhere. The token already issued stays
        valid until it expires.
      </p>

      <div className="flex justify-end mt-6">
        <Button type="submit" loading={submitting}>
          Change password
        </Button>
      </div>
    </form>
  );
};

export const AdminProfile = () => {
  const { administrator, refresh, isSuperAdmin } = useAuth();

  return (
    <>
      <PageHeader title="My profile" description="Your account details and password." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Profile">
            <ProfileSection administrator={administrator} onSaved={refresh} />
          </SectionCard>

          <SectionCard title="Change password">
            <PasswordSection />
          </SectionCard>
        </div>

        <SectionCard title="Account">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-portal-subtle mb-1">Role</dt>
              <dd>
                <StatusBadge
                  tone={isSuperAdmin ? 'success' : 'neutral'}
                  label={ROLE_LABELS[administrator?.role] ?? administrator?.role}
                />
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wider text-portal-subtle mb-1">Status</dt>
              <dd>
                <StatusBadge
                  status={administrator?.isActive ? 'active' : 'suspended'}
                  label={administrator?.isActive ? 'Active' : 'Suspended'}
                />
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wider text-portal-subtle mb-1">Last sign-in</dt>
              <dd className="text-portal-ink">{formatDateTime(administrator?.lastLoginAt)}</dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wider text-portal-subtle mb-1">Permissions</dt>
              <dd>
                {isSuperAdmin ? (
                  <p className="text-portal-muted">
                    Every area, including permissions added in future.
                  </p>
                ) : (
                  <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {(administrator?.permissions ?? []).map((permission) => (
                      <li key={permission} className="text-portal-muted capitalize">
                        {describePermission(permission)}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>

          <p className="mt-5 pt-5 border-t border-portal-border text-xs text-portal-subtle">
            Roles and permissions are changed by a super administrator, never from this page.
          </p>
        </SectionCard>
      </div>
    </>
  );
};

export default AdminProfile;
