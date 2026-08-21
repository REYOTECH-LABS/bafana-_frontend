import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import { useAuth } from '../../context/AuthContext';
import {
  adminGetAdministrators,
  adminCreateAdministrator,
  adminUpdateAdministrator,
  adminDeleteAdministrator,
  adminToggleAdministratorStatus,
} from '../../services/adminResources';
import { PERMISSIONS, ROLES, ROLE_LABELS, describePermission } from '../../lib/permissions';
import { PermissionGate } from '../../components/Admin/PermissionGate';
import {
  PageHeader,
  SectionCard,
  Button,
  StatusBadge,
  SearchInput,
  Modal,
  ConfirmDialog,
} from '../../components/Admin/ui/primitives';
import { DataTable } from '../../components/Admin/ui/DataTable';
import { FormField, FormError, CheckboxField } from '../../components/Admin/ui/FormField';

/**
 * Administrator management, following page 4 of the approved report: who can
 * reach the portal and how far, with the role summaries beneath.
 *
 * The report shows three roles — super admin, admin, editor. **This backend has
 * exactly two**, `admin` and `super_admin`, and inventing an editor role in the
 * interface would produce accounts the API rejects. The role cards below
 * describe the two that exist.
 *
 * Everything here is enforced server-side as well. The interface hides controls
 * an account may not use, but the API independently blocks role changes by a
 * non-super-admin, self-demotion, and any operation that would remove the last
 * active super administrator.
 */

const emptyAdministrator = {
  fullName: '',
  email: '',
  password: '',
  role: ROLES.ADMIN,
  permissions: [],
};

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

const ROLE_SUMMARIES = [
  {
    role: ROLES.SUPER_ADMIN,
    title: 'Super admin',
    description:
      'Full access, including administrator management, roles, permissions, system settings and every delete operation.',
  },
  {
    role: ROLES.ADMIN,
    title: 'Admin',
    description:
      'Manages lawyers, practice areas, appointments, enquiries, visitors and content. Cannot change roles, manage administrators, or delete records unless individually granted.',
  },
];

const AdministratorForm = ({ record, onSubmit, onCancel, submitting, error, canManageRoles, isSelf }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({
    ...emptyAdministrator,
    ...record,
    password: '',
    permissions: record?.permissions ?? [],
  });

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const togglePermission = (permission) =>
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((value) => value !== permission)
        : [...current.permissions, permission],
    }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      fullName: form.fullName,
      email: form.email,
    };

    // Only send a password when one was actually typed: an empty string would
    // fail the 8-character minimum and reject an otherwise valid edit.
    if (form.password) payload.password = form.password;

    if (canManageRoles) {
      payload.role = form.role;
      payload.permissions = form.permissions;
    }

    onSubmit(payload);
  };

  // Custom grants only widen what the role already allows, and super_admin
  // already holds everything, so the picker is pointless for that role.
  const showPermissionPicker = canManageRoles && form.role === ROLES.ADMIN;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full name" name="fullName" required value={form.fullName} onChange={update('fullName')} />
        <FormField label="Email" name="email" type="email" required value={form.email} onChange={update('email')} />
      </div>

      <FormField
        label={isEdit ? 'New password' : 'Temporary password'}
        name="password"
        type="password"
        required={!isEdit}
        autoComplete="new-password"
        className="mt-4"
        value={form.password}
        onChange={update('password')}
        hint={
          isEdit
            ? 'Leave empty to keep the current password. Existing sessions are not ended by a change.'
            : 'At least 8 characters. Share it securely and ask them to change it after signing in.'
        }
      />

      {canManageRoles && (
        <div className="mt-4">
          <FormField
            as="select"
            label="Role"
            name="role"
            value={form.role}
            onChange={update('role')}
            options={[
              { value: ROLES.ADMIN, label: 'Admin — operational access' },
              { value: ROLES.SUPER_ADMIN, label: 'Super admin — full access' },
            ]}
            hint={isSelf ? 'You cannot remove your own super admin role.' : undefined}
          />
        </div>
      )}

      {showPermissionPicker && (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-portal-ink mb-1.5">Additional permissions</legend>
          <p className="text-xs text-portal-subtle mb-3">
            Granted on top of the admin role. These only add access; they never remove what the role already allows.
          </p>

          <div className="max-h-52 overflow-y-auto rounded-lg border border-portal-border p-3 space-y-2">
            {Object.values(PERMISSIONS)
              // Deletes and administrator management are the grants worth
              // making deliberately; the rest the admin role already carries.
              .filter((permission) => permission.includes(':delete') || permission.startsWith('administrator:') || permission.startsWith('settings:'))
              .map((permission) => (
                <CheckboxField
                  key={permission}
                  name={`permission-${permission}`}
                  label={describePermission(permission)}
                  checked={form.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                />
              ))}
          </div>
        </fieldset>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create administrator'}
        </Button>
      </div>
    </form>
  );
};

export const AdminAdministrators = () => {
  const { administrator: current, hasPermission } = useAuth();
  const canManageRoles = hasPermission(PERMISSIONS.ADMINISTRATOR_MANAGE_ROLES);

  const crud = useCrud({
    list: adminGetAdministrators,
    create: adminCreateAdministrator,
    update: adminUpdateAdministrator,
    remove: adminDeleteAdministrator,
    label: 'Administrator',
    searchFields: ['fullName', 'email'],
  });

  const currentId = current?.id ?? current?._id;
  const isSelf = (row) => (row.id ?? row._id) === currentId;

  const activeSuperAdmins = crud.rows.filter(
    (row) => row.role === ROLES.SUPER_ADMIN && row.isActive
  ).length;

  /**
   * Mirrors the backend's last-super-admin guard so the interface does not
   * offer an action that is certain to fail. The API enforces it regardless.
   */
  const isLastActiveSuperAdmin = (row) =>
    row.role === ROLES.SUPER_ADMIN && row.isActive && activeSuperAdmins <= 1;

  const columns = [
    {
      key: 'fullName',
      header: 'Administrator',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">
            {row.fullName}
            {isSelf(row) && <span className="ml-2 text-xs font-normal text-portal-subtle">(you)</span>}
          </p>
          <p className="text-sm text-portal-muted truncate">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => (
        <StatusBadge
          tone={row.role === ROLES.SUPER_ADMIN ? 'success' : 'neutral'}
          label={ROLE_LABELS[row.role] ?? row.role}
        />
      ),
    },
    {
      key: 'permissions',
      header: 'Extra permissions',
      hideOnMobile: true,
      render: (row) =>
        row.role === ROLES.SUPER_ADMIN ? (
          <span className="text-sm text-portal-muted">All areas</span>
        ) : row.permissions?.length ? (
          <span className="text-sm text-portal-muted">
            {row.permissions.length} granted
          </span>
        ) : (
          <span className="text-sm text-portal-subtle">Role defaults</span>
        ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last active',
      sortable: true,
      sortValue: (row) => new Date(row.lastLoginAt ?? 0).getTime(),
      hideOnMobile: true,
      render: (row) => <span className="whitespace-nowrap text-portal-muted">{formatDateTime(row.lastLoginAt)}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.isActive ? 'active' : 'suspended'}
          label={row.isActive ? 'Active' : 'Suspended'}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Administrators"
        description="Who can reach the portal, and how far. There is no public sign-up; accounts are created here."
        actions={
          <PermissionGate permission={PERMISSIONS.ADMINISTRATOR_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add administrator
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search name or email" />
        <p className="text-sm text-portal-muted ml-auto" aria-live="polite">
          {crud.filtered.length} of {crud.rows.length}
        </p>
      </div>

      {crud.formError && !crud.editing && (
        <div className="mb-6">
          <FormError error={crud.formError} />
        </div>
      )}

      <SectionCard bodyClassName="p-0" className="mb-8">
        <DataTable
          caption="Administrators"
          columns={columns}
          rows={crud.filtered}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          emptyTitle="No administrators found"
          actions={(row) => {
            const id = row.id ?? row._id;
            const lastSuper = isLastActiveSuperAdmin(row);

            return (
              <>
                <PermissionGate permission={PERMISSIONS.ADMINISTRATOR_UPDATE}>
                  <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={lastSuper || isSelf(row)}
                    title={
                      lastSuper
                        ? 'The last active super admin cannot be suspended'
                        : isSelf(row)
                          ? 'You cannot suspend your own account'
                          : undefined
                    }
                    onClick={() =>
                      crud.runAction(
                        () => adminToggleAdministratorStatus(id),
                        row.isActive ? 'Administrator suspended.' : 'Administrator reactivated.'
                      )
                    }
                  >
                    {row.isActive ? 'Suspend' : 'Reactivate'}
                  </Button>
                </PermissionGate>

                <PermissionGate permission={PERMISSIONS.ADMINISTRATOR_DELETE}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-state-dangerFg hover:bg-state-dangerBg"
                    disabled={lastSuper || isSelf(row)}
                    title={
                      lastSuper
                        ? 'The last active super admin cannot be deleted'
                        : isSelf(row)
                          ? 'You cannot delete your own account'
                          : undefined
                    }
                    onClick={() => crud.requestDelete(row)}
                  >
                    Delete
                  </Button>
                </PermissionGate>
              </>
            );
          }}
        />
      </SectionCard>

      {/* ------------------------------------------------------- role summary */}
      <h2 className="text-2xl font-serif font-bold text-portal-ink mb-4">Roles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLE_SUMMARIES.map((summary) => {
          const count = crud.rows.filter((row) => row.role === summary.role).length;

          return (
            <div key={summary.role} className="bg-portal-surface border border-portal-border rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-serif font-bold text-portal-ink">{summary.title}</h3>
                <span className="text-xs text-portal-subtle">
                  {count} {count === 1 ? 'person' : 'people'}
                </span>
              </div>
              <p className="text-sm text-portal-muted leading-relaxed">{summary.description}</p>
            </div>
          );
        })}
      </div>

      <Modal
        open={crud.editing !== null}
        onClose={crud.closeForm}
        size="lg"
        title={crud.isCreating ? 'Add administrator' : 'Edit administrator'}
      >
        {crud.editing !== null && (
          <AdministratorForm
            record={crud.editing}
            onSubmit={crud.submit}
            onCancel={crud.closeForm}
            submitting={crud.submitting}
            error={crud.formError}
            canManageRoles={canManageRoles}
            isSelf={isSelf(crud.editing)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        onCancel={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        loading={crud.submitting}
        title="Delete administrator"
        message={`Permanently delete ${crud.deleting?.fullName ?? 'this administrator'}? Suspending instead blocks access immediately while keeping the record and its audit trail.`}
      />
    </>
  );
};

export default AdminAdministrators;
