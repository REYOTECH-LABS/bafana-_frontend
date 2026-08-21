import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetAnnouncements,
  adminCreateAnnouncement,
  adminUpdateAnnouncement,
  adminDeleteAnnouncement,
} from '../../services/adminResources';
import { PERMISSIONS } from '../../lib/permissions';
import { PermissionGate } from '../../components/Admin/PermissionGate';
import {
  PageHeader,
  SectionCard,
  Button,
  StatusBadge,
  SearchInput,
  FilterSelect,
  Modal,
  ConfirmDialog,
} from '../../components/Admin/ui/primitives';
import { DataTable } from '../../components/Admin/ui/DataTable';
import { FormField, FormError } from '../../components/Admin/ui/FormField';

/**
 * Announcements.
 *
 * Published announcements appear on the public site until their expiry date
 * passes. The dates are optional; leaving expiry empty means the announcement
 * runs indefinitely.
 *
 * The API validates `publicationDate` and `expiryDate` as full ISO datetimes,
 * while a date input yields YYYY-MM-DD — so they are converted on submit
 * rather than sent as-is, which the schema would reject.
 */

const emptyAnnouncement = { title: '', body: '', status: 'draft', publicationDate: '', expiryDate: '' };

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/** ISO date (YYYY-MM-DD) for a date input, from whatever the API returned. */
const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const AnnouncementForm = ({ record, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({
    ...emptyAnnouncement,
    ...record,
    publicationDate: toDateInput(record?.publicationDate),
    expiryDate: toDateInput(record?.expiryDate),
  });

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      title: form.title,
      body: form.body,
      status: form.status,
      // The schema wants a datetime; a bare date fails z.string().datetime().
      publicationDate: form.publicationDate ? new Date(form.publicationDate).toISOString() : undefined,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <FormField label="Title" name="title" required value={form.title} onChange={update('title')} />

      <FormField
        as="textarea"
        label="Body"
        name="body"
        required
        className="mt-4"
        rows={6}
        value={form.body ?? ''}
        onChange={update('body')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <FormField
          as="select"
          label="Status"
          name="status"
          value={form.status}
          onChange={update('status')}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
        <FormField
          label="Publication date"
          name="publicationDate"
          type="date"
          value={form.publicationDate}
          onChange={update('publicationDate')}
        />
        <FormField
          label="Expiry date"
          name="expiryDate"
          type="date"
          value={form.expiryDate}
          onChange={update('expiryDate')}
          hint="Leave empty to run indefinitely."
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create announcement'}
        </Button>
      </div>
    </form>
  );
};

export const AdminAnnouncements = () => {
  const [status, setStatus] = useState('all');

  const crud = useCrud({
    list: adminGetAnnouncements,
    create: adminCreateAnnouncement,
    update: adminUpdateAnnouncement,
    remove: adminDeleteAnnouncement,
    label: 'Announcement',
    searchFields: ['title', 'body'],
  });

  const visible = crud.filtered.filter((row) => status === 'all' || row.status === status);

  const columns = [
    {
      key: 'title',
      header: 'Announcement',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.title}</p>
          <p className="text-sm text-portal-muted truncate max-w-md">{row.body}</p>
        </div>
      ),
    },
    {
      key: 'publicationDate',
      header: 'Publishes',
      sortable: true,
      sortValue: (row) => new Date(row.publicationDate ?? 0).getTime(),
      render: (row) => <span className="whitespace-nowrap text-portal-muted">{formatDate(row.publicationDate)}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Expires',
      hideOnMobile: true,
      render: (row) => <span className="whitespace-nowrap text-portal-muted">{formatDate(row.expiryDate)}</span>,
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Notices shown on the public site while published and unexpired."
        actions={
          <PermissionGate permission={PERMISSIONS.ANNOUNCEMENT_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add announcement
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search announcements" />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Filter by status"
          options={[
            { value: 'all', label: 'All announcements' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Drafts' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
        <p className="text-sm text-portal-muted ml-auto" aria-live="polite">
          {visible.length} of {crud.rows.length}
        </p>
      </div>

      {crud.formError && !crud.editing && (
        <div className="mb-6">
          <FormError error={crud.formError} />
        </div>
      )}

      <SectionCard bodyClassName="p-0">
        <DataTable
          caption="Announcements"
          columns={columns}
          rows={visible}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          initialSort={{ key: 'publicationDate', direction: 'desc' }}
          emptyTitle={crud.rows.length ? 'No matching announcements' : 'No announcements yet'}
          emptyDescription={
            crud.rows.length ? 'Adjust the search or filter to see more.' : 'Post a notice for the public site.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.ANNOUNCEMENT_UPDATE}>
                <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                  Edit
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.ANNOUNCEMENT_DELETE}>
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
        title={crud.isCreating ? 'Add announcement' : 'Edit announcement'}
      >
        {crud.editing !== null && (
          <AnnouncementForm
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
        title="Delete announcement"
        message={`Permanently delete "${crud.deleting?.title ?? 'this announcement'}"? Archiving instead keeps the record.`}
      />
    </>
  );
};

export default AdminAnnouncements;
