import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetPracticeAreas,
  adminCreatePracticeArea,
  adminUpdatePracticeArea,
  adminDeletePracticeArea,
} from '../../services/adminResources';
import { PERMISSIONS } from '../../lib/permissions';
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
 * Practice area management.
 *
 * The same records the public /practice-areas page renders, in the same
 * `displayOrder`. Deactivating one removes it from the public site immediately,
 * without deleting the record.
 */

const emptyArea = {
  name: '',
  description: '',
  icon: '',
  displayOrder: 0,
  isActive: true,
};

const AreaForm = ({ record, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({ ...emptyArea, ...record });
  const [image, setImage] = useState(null);

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (image) {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value != null) body.append(key, value);
      });
      body.append('image', image);
      onSubmit(body);
      return;
    }

    onSubmit({
      name: form.name,
      description: form.description,
      icon: form.icon || undefined,
      displayOrder: Number(form.displayOrder) || 0,
      isActive: Boolean(form.isActive),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <FormField label="Name" name="name" required value={form.name} onChange={update('name')} />

      <FormField
        as="textarea"
        label="Description"
        name="description"
        required
        className="mt-4"
        value={form.description ?? ''}
        onChange={update('description')}
        hint="Shown on the practice-area card on the public site."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Icon key"
          name="icon"
          value={form.icon ?? ''}
          onChange={update('icon')}
          hint="For example gavel, heart, home, briefcase."
        />
        <FormField
          label="Display order"
          name="displayOrder"
          type="number"
          min="0"
          value={form.displayOrder ?? 0}
          onChange={update('displayOrder')}
          hint="Lower numbers appear first."
        />
      </div>

      <div className="mt-4">
        <label htmlFor="area-image" className="block text-sm font-semibold text-portal-ink mb-1.5">
          Card image
        </label>
        <input
          id="area-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="w-full text-sm text-portal-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-portal-border file:bg-portal-surface file:text-sm file:font-semibold file:text-portal-ink hover:file:border-portal-ink"
        />
        <p className="mt-1.5 text-xs text-portal-subtle">
          Replaces the placeholder on the public card. Uploading a new image deletes the previous one.
        </p>
      </div>

      <div className="mt-5">
        <CheckboxField
          label="Active"
          name="isActive"
          checked={Boolean(form.isActive)}
          onChange={update('isActive')}
          hint="Inactive areas are hidden from the public site but kept on file."
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create practice area'}
        </Button>
      </div>
    </form>
  );
};

export const AdminPracticeAreas = () => {
  const crud = useCrud({
    list: adminGetPracticeAreas,
    create: adminCreatePracticeArea,
    update: adminUpdatePracticeArea,
    remove: adminDeletePracticeArea,
    label: 'Practice area',
    searchFields: ['name', 'description'],
  });

  const columns = [
    {
      key: 'name',
      header: 'Practice area',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.name}</p>
          <p className="text-sm text-portal-muted truncate max-w-md">{row.description}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', hideOnMobile: true, render: (row) => <code className="text-xs text-portal-muted">{row.slug}</code> },
    {
      key: 'lawyers',
      header: 'Lawyers',
      align: 'right',
      sortable: true,
      sortValue: (row) => (Array.isArray(row.lawyers) ? row.lawyers.length : 0),
      render: (row) => <span className="tabular-nums">{Array.isArray(row.lawyers) ? row.lawyers.length : 0}</span>,
    },
    {
      key: 'displayOrder',
      header: 'Order',
      align: 'right',
      sortable: true,
      render: (row) => <span className="tabular-nums">{row.displayOrder ?? 0}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.isActive ? 'active' : 'inactive'}
          label={row.isActive ? 'Active' : 'Inactive'}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Practice areas"
        description="The services shown on the public site, in the order they appear there."
        actions={
          <PermissionGate permission={PERMISSIONS.PRACTICE_AREA_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add practice area
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search practice areas" />
        <p className="text-sm text-portal-muted ml-auto" aria-live="polite">
          {crud.filtered.length} of {crud.rows.length}
        </p>
      </div>

      {crud.formError && !crud.editing && (
        <div className="mb-6">
          <FormError error={crud.formError} />
        </div>
      )}

      <SectionCard bodyClassName="p-0">
        <DataTable
          caption="Practice areas"
          columns={columns}
          rows={crud.filtered}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          initialSort={{ key: 'displayOrder', direction: 'asc' }}
          emptyTitle={crud.rows.length ? 'No matching practice areas' : 'No practice areas yet'}
          emptyDescription={
            crud.rows.length
              ? 'Adjust the search to see more.'
              : 'Add one and it will appear on the public site.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.PRACTICE_AREA_UPDATE}>
                <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                  Edit
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.PRACTICE_AREA_DELETE}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-state-dangerFg hover:bg-state-dangerBg"
                  onClick={() => crud.requestDelete(row)}
                >
                  Delete
                </Button>
              </PermissionGate>
            </>
          )}
        />
      </SectionCard>

      <Modal
        open={crud.editing !== null}
        onClose={crud.closeForm}
        title={crud.isCreating ? 'Add practice area' : 'Edit practice area'}
      >
        {crud.editing !== null && (
          <AreaForm
            record={crud.editing}
            onSubmit={crud.submit}
            onCancel={crud.closeForm}
            submitting={crud.submitting}
            error={crud.formError}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        onCancel={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        loading={crud.submitting}
        title="Delete practice area"
        message={`Permanently delete "${crud.deleting?.name ?? 'this area'}"? It will disappear from the public site. Consider deactivating it instead if you may want it back.`}
      />
    </>
  );
};

export default AdminPracticeAreas;
