import { useState } from 'react';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import { useApi } from '../../hooks/useApi';
import {
  adminGetLawyers,
  adminCreateLawyer,
  adminUpdateLawyer,
  adminDeleteLawyer,
  adminToggleLawyerAvailability,
  adminGetPracticeAreas,
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
  LoadingState,
  ErrorState,
  EmptyState,
  Modal,
  ConfirmDialog,
} from '../../components/Admin/ui/primitives';
import { FormField, FormError, CheckboxField } from '../../components/Admin/ui/FormField';

/**
 * Lawyer management.
 *
 * Presented as cards rather than a table, following page 3 of the approved
 * report: initials, name, title, status, practice areas, and the figures the
 * API actually carries.
 *
 * The report shows "active cases" and "billable hours per month". **Neither
 * exists in this backend** — there is no case or billing module — so those
 * figures are replaced with what the Lawyer record genuinely holds: years of
 * experience and practice areas. Inventing caseloads would put fabricated
 * numbers in front of the firm.
 *
 * These are the same records the public /lawyers page renders. An edit here
 * changes the public site on its next load.
 */

const initialsOf = (name) =>
  String(name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '—';

const emptyLawyer = {
  fullName: '',
  email: '',
  phone: '',
  title: '',
  specialization: '',
  bio: '',
  yearsOfExperience: '',
  isAvailable: true,
};

const LawyerForm = ({ record, practiceAreas, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({ ...emptyLawyer, ...record });
  const [photo, setPhoto] = useState(null);

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Multipart only when a file is attached; otherwise JSON, which is far
    // easier to read in the network tab and avoids coercing every field to a
    // string on the way through.
    if (photo) {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value != null) body.append(key, value);
      });
      body.append('profilePhoto', photo);
      onSubmit(body);
      return;
    }

    onSubmit({
      ...form,
      yearsOfExperience: form.yearsOfExperience === '' ? undefined : Number(form.yearsOfExperience),
    });
  };

  return (
    <form onSubmit={handleSubmit} id="lawyer-form" noValidate>
      <FormError error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full name" name="fullName" required value={form.fullName} onChange={update('fullName')} />
        <FormField label="Email" name="email" type="email" required value={form.email} onChange={update('email')} />
        <FormField label="Phone" name="phone" required value={form.phone ?? ''} onChange={update('phone')} />
        <FormField
          label="Title"
          name="title"
          value={form.title ?? ''}
          onChange={update('title')}
          hint="For example, Senior partner"
        />
        <FormField
          label="Specialization"
          name="specialization"
          required
          value={form.specialization ?? ''}
          onChange={update('specialization')}
          hint={
            practiceAreas.length
              ? `Practice areas on file: ${practiceAreas.map((a) => a.name).join(', ')}`
              : undefined
          }
        />
        <FormField
          label="Years of experience"
          name="yearsOfExperience"
          type="number"
          min="0"
          value={form.yearsOfExperience ?? ''}
          onChange={update('yearsOfExperience')}
        />
      </div>

      <FormField
        as="textarea"
        label="Biography"
        name="bio"
        className="mt-4"
        value={form.bio ?? ''}
        onChange={update('bio')}
      />

      <div className="mt-4">
        <label htmlFor="lawyer-photo" className="block text-sm font-semibold text-portal-ink mb-1.5">
          Profile photograph
        </label>
        <input
          id="lawyer-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
          className="w-full text-sm text-portal-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-portal-border file:bg-portal-surface file:text-sm file:font-semibold file:text-portal-ink hover:file:border-portal-ink"
        />
        <p className="mt-1.5 text-xs text-portal-subtle">
          JPEG, PNG or WebP, up to 5 MB. Uploaded to Cloudinary by the server; only the URL is stored.
        </p>
      </div>

      <div className="mt-5">
        <CheckboxField
          label="Available for appointments"
          name="isAvailable"
          checked={Boolean(form.isAvailable)}
          onChange={update('isAvailable')}
          hint="Unavailable lawyers stay on the public site but cannot be booked."
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create lawyer'}
        </Button>
      </div>
    </form>
  );
};

export const AdminLawyers = () => {
  const [availability, setAvailability] = useState('all');

  const crud = useCrud({
    list: adminGetLawyers,
    create: adminCreateLawyer,
    update: adminUpdateLawyer,
    remove: adminDeleteLawyer,
    label: 'Lawyer',
    searchFields: ['fullName', 'email', 'specialization', 'title'],
  });

  const practiceAreas = useApi(() => adminGetPracticeAreas(), [], { fallback: [] });
  const areaList = Array.isArray(practiceAreas.data) ? practiceAreas.data : [];

  const visible = crud.filtered.filter((lawyer) => {
    if (availability === 'available') return lawyer.isAvailable;
    if (availability === 'unavailable') return !lawyer.isAvailable;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Lawyers"
        description="Practitioner records. These are the same profiles the public website displays."
        actions={
          <PermissionGate permission={PERMISSIONS.LAWYER_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add lawyer
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput
          value={crud.search}
          onChange={crud.setSearch}
          placeholder="Search name, email or specialization"
          label="Search lawyers"
        />
        <FilterSelect
          value={availability}
          onChange={setAvailability}
          label="Filter by availability"
          options={[
            { value: 'all', label: 'All lawyers' },
            { value: 'available', label: 'Available' },
            { value: 'unavailable', label: 'Unavailable' },
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

      {crud.loading ? (
        <LoadingState rows={6} label="Loading lawyers" />
      ) : crud.error ? (
        <SectionCard bodyClassName="p-0">
          <ErrorState error={crud.error} onRetry={crud.refetch} />
        </SectionCard>
      ) : visible.length === 0 ? (
        <SectionCard bodyClassName="p-0">
          <EmptyState
            title={crud.rows.length ? 'No matching lawyers' : 'No lawyers yet'}
            description={
              crud.rows.length
                ? 'Adjust the search or filter to see more.'
                : 'Add a practitioner and they will appear here and on the public site.'
            }
          />
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((lawyer) => {
            const id = lawyer.id ?? lawyer._id;

            return (
              <article
                key={id}
                className="bg-portal-surface border border-portal-border rounded-xl p-5 flex flex-col"
              >
                <div className="flex items-start gap-4">
                  {lawyer.profileImageUrl ? (
                    <img
                      src={lawyer.profileImageUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-full bg-portal-ink text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {initialsOf(lawyer.fullName)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-portal-ink truncate">{lawyer.fullName}</h3>
                    <p className="text-sm text-portal-muted truncate">{lawyer.title || lawyer.specialization}</p>
                  </div>

                  <StatusBadge
                    status={lawyer.isAvailable ? 'available' : 'unavailable'}
                    label={lawyer.isAvailable ? 'Available' : 'Unavailable'}
                  />
                </div>

                {lawyer.specialization && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="px-2 py-1 rounded-md bg-portal-raised text-xs text-portal-muted">
                      {lawyer.specialization}
                    </span>
                  </div>
                )}

                <dl className="flex gap-8 mt-4 pt-4 border-t border-portal-border">
                  <div>
                    <dd className="text-xl font-serif font-bold text-portal-ink tabular-nums leading-none">
                      {lawyer.yearsOfExperience ?? 0}
                    </dd>
                    <dt className="text-xs text-portal-subtle mt-1">Years experience</dt>
                  </div>
                  <div>
                    <dd className="text-xl font-serif font-bold text-portal-ink tabular-nums leading-none">
                      {Array.isArray(lawyer.practiceAreas) ? lawyer.practiceAreas.length : 0}
                    </dd>
                    <dt className="text-xs text-portal-subtle mt-1">Practice areas</dt>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-portal-border">
                  <PermissionGate permission={PERMISSIONS.LAWYER_UPDATE}>
                    <Button variant="secondary" size="sm" onClick={() => crud.openEdit(lawyer)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        crud.runAction(
                          () => adminToggleLawyerAvailability(id),
                          lawyer.isAvailable ? 'Marked unavailable.' : 'Marked available.'
                        )
                      }
                    >
                      {lawyer.isAvailable ? (
                        <>
                          <FaTimes aria-hidden="true" className="text-xs" /> Set unavailable
                        </>
                      ) : (
                        <>
                          <FaCheck aria-hidden="true" className="text-xs" /> Set available
                        </>
                      )}
                    </Button>
                  </PermissionGate>

                  <PermissionGate permission={PERMISSIONS.LAWYER_DELETE}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-state-dangerFg hover:bg-state-dangerBg"
                      onClick={() => crud.requestDelete(lawyer)}
                    >
                      Delete
                    </Button>
                  </PermissionGate>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={crud.editing !== null}
        onClose={crud.closeForm}
        size="lg"
        title={crud.isCreating ? 'Add lawyer' : 'Edit lawyer'}
      >
        {crud.editing !== null && (
          <LawyerForm
            record={crud.editing}
            practiceAreas={areaList}
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
        title="Delete lawyer"
        message={`Permanently delete ${crud.deleting?.fullName ?? 'this lawyer'}? They will be removed from the public website. This cannot be undone.`}
      />
    </>
  );
};

export default AdminLawyers;
