import { useState } from 'react';
import { FaPlus, FaStar } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
  adminToggleTestimonialPublished,
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
 * Client testimonials.
 *
 * Only published testimonials reach the public site, so publishing is the
 * meaningful action here and is exposed as a one-click toggle rather than
 * buried in the edit form.
 */

const emptyTestimonial = { clientName: '', role: '', rating: 5, text: '', isPublished: false, displayOrder: 0 };

const Stars = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        aria-hidden="true"
        className={`text-xs ${index < rating ? 'text-gold-500' : 'text-portal-border'}`}
      />
    ))}
  </span>
);

const TestimonialForm = ({ record, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({ ...emptyTestimonial, ...record });

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      clientName: form.clientName,
      role: form.role || undefined,
      rating: Number(form.rating),
      text: form.text,
      isPublished: Boolean(form.isPublished),
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Client name" name="clientName" required value={form.clientName} onChange={update('clientName')} />
        <FormField
          label="Role"
          name="role"
          value={form.role ?? ''}
          onChange={update('role')}
          hint="For example, Business owner"
        />
        <FormField
          as="select"
          label="Rating"
          name="rating"
          value={form.rating}
          onChange={update('rating')}
          options={[5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${n} star${n === 1 ? '' : 's'}` }))}
        />
        <FormField
          label="Display order"
          name="displayOrder"
          type="number"
          min="0"
          value={form.displayOrder ?? 0}
          onChange={update('displayOrder')}
        />
      </div>

      <FormField
        as="textarea"
        label="Testimonial"
        name="text"
        required
        className="mt-4"
        value={form.text ?? ''}
        onChange={update('text')}
      />

      <div className="mt-5">
        <CheckboxField
          label="Published"
          name="isPublished"
          checked={Boolean(form.isPublished)}
          onChange={update('isPublished')}
          hint="Only published testimonials appear on the public website."
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create testimonial'}
        </Button>
      </div>
    </form>
  );
};

export const AdminTestimonials = () => {
  const crud = useCrud({
    list: adminGetTestimonials,
    create: adminCreateTestimonial,
    update: adminUpdateTestimonial,
    remove: adminDeleteTestimonial,
    label: 'Testimonial',
    searchFields: ['clientName', 'text', 'role'],
  });

  const columns = [
    {
      key: 'clientName',
      header: 'Client',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.clientName}</p>
          {row.role && <p className="text-sm text-portal-muted truncate">{row.role}</p>}
        </div>
      ),
    },
    {
      key: 'text',
      header: 'Testimonial',
      render: (row) => <p className="truncate max-w-md text-portal-muted">{row.text}</p>,
    },
    { key: 'rating', header: 'Rating', sortable: true, render: (row) => <Stars rating={row.rating ?? 0} /> },
    {
      key: 'isPublished',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.isPublished ? 'published' : 'draft'}
          label={row.isPublished ? 'Published' : 'Draft'}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client feedback. Published entries appear on the public testimonials page."
        actions={
          <PermissionGate permission={PERMISSIONS.TESTIMONIAL_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add testimonial
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search client or text" />
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
          caption="Testimonials"
          columns={columns}
          rows={crud.filtered}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          emptyTitle={crud.rows.length ? 'No matching testimonials' : 'No testimonials yet'}
          emptyDescription={
            crud.rows.length ? 'Adjust the search to see more.' : 'Add client feedback to show on the public site.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.TESTIMONIAL_UPDATE}>
                <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    crud.runAction(
                      () => adminToggleTestimonialPublished(row.id ?? row._id),
                      row.isPublished ? 'Unpublished.' : 'Published to the public site.'
                    )
                  }
                >
                  {row.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              </PermissionGate>

              <PermissionGate permission={PERMISSIONS.TESTIMONIAL_DELETE}>
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
        title={crud.isCreating ? 'Add testimonial' : 'Edit testimonial'}
      >
        {crud.editing !== null && (
          <TestimonialForm
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
        title="Delete testimonial"
        message={`Permanently delete the testimonial from ${crud.deleting?.clientName ?? 'this client'}?`}
      />
    </>
  );
};

export default AdminTestimonials;
