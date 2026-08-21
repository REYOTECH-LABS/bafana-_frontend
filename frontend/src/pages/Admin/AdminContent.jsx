import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetContent,
  adminCreateContent,
  adminUpdateContent,
  adminDeleteContent,
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
 * Website content blocks.
 *
 * Each record is keyed by `pageKey`, which is how the public site asks for it
 * (`GET /content/key/:pageKey`). The key is therefore the important field, and
 * changing it on a live block will orphan whichever page requests the old one —
 * which the form says plainly rather than leaving to be discovered.
 */

const emptyContent = { pageKey: '', title: '', body: '', imageUrl: '', isPublished: true, displayOrder: 0 };

const ContentForm = ({ record, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({ ...emptyContent, ...record });

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      pageKey: form.pageKey.trim().toLowerCase(),
      title: form.title,
      body: form.body,
      // The schema validates imageUrl as a URL and allows null, but an empty
      // string would fail that check.
      imageUrl: form.imageUrl?.trim() ? form.imageUrl.trim() : null,
      isPublished: Boolean(form.isPublished),
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Page key"
          name="pageKey"
          required
          value={form.pageKey}
          onChange={update('pageKey')}
          hint={isEdit ? 'Changing this breaks any page requesting the old key.' : 'Lowercase identifier, e.g. home-hero'}
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

      <FormField label="Title" name="title" required className="mt-4" value={form.title} onChange={update('title')} />

      <FormField
        as="textarea"
        label="Body"
        name="body"
        required
        className="mt-4"
        rows={8}
        value={form.body ?? ''}
        onChange={update('body')}
      />

      <FormField
        label="Image URL"
        name="imageUrl"
        type="url"
        className="mt-4"
        value={form.imageUrl ?? ''}
        onChange={update('imageUrl')}
        hint="Optional. Must be a full URL."
      />

      <div className="mt-5">
        <CheckboxField
          label="Published"
          name="isPublished"
          checked={Boolean(form.isPublished)}
          onChange={update('isPublished')}
          hint="Unpublished blocks are hidden from the public site."
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create content block'}
        </Button>
      </div>
    </form>
  );
};

export const AdminContent = () => {
  const crud = useCrud({
    list: adminGetContent,
    create: adminCreateContent,
    update: adminUpdateContent,
    remove: adminDeleteContent,
    label: 'Content block',
    searchFields: ['pageKey', 'title', 'body'],
  });

  const columns = [
    {
      key: 'pageKey',
      header: 'Page key',
      sortable: true,
      primary: true,
      render: (row) => <code className="text-sm font-medium text-portal-ink">{row.pageKey}</code>,
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="text-portal-ink">{row.title}</p>
          <p className="text-sm text-portal-muted truncate max-w-md">{row.body}</p>
        </div>
      ),
    },
    {
      key: 'displayOrder',
      header: 'Order',
      align: 'right',
      sortable: true,
      hideOnMobile: true,
      render: (row) => <span className="tabular-nums">{row.displayOrder ?? 0}</span>,
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.isPublished ? 'published' : 'draft'}
          label={row.isPublished ? 'Published' : 'Hidden'}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Website content"
        description="Editable copy blocks the public pages request by key."
        actions={
          <PermissionGate permission={PERMISSIONS.CONTENT_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add content block
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search key, title or body" />
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
          caption="Website content blocks"
          columns={columns}
          rows={crud.filtered}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          initialSort={{ key: 'pageKey', direction: 'asc' }}
          emptyTitle={crud.rows.length ? 'No matching content' : 'No content blocks yet'}
          emptyDescription={
            crud.rows.length
              ? 'Adjust the search to see more.'
              : 'Add a block and the public site can request it by key.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.CONTENT_UPDATE}>
                <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                  Edit
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.CONTENT_DELETE}>
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
        size="lg"
        title={crud.isCreating ? 'Add content block' : 'Edit content block'}
      >
        {crud.editing !== null && (
          <ContentForm
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
        title="Delete content block"
        message={`Permanently delete "${crud.deleting?.pageKey ?? 'this block'}"? Any public page requesting this key will lose its copy.`}
      />
    </>
  );
};

export default AdminContent;
