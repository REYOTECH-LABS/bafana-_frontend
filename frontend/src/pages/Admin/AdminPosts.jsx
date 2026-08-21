import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetPosts,
  adminCreatePost,
  adminUpdatePost,
  adminDeletePost,
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
 * Blog posts.
 *
 * Drafts are invisible to the public site; publishing is a status change on the
 * record rather than a separate route, so it is a field on the form.
 *
 * Tags are typed as a comma-separated string because that is what the backend
 * accepts from a multipart submission, and its service normalises either shape.
 */

const emptyPost = { title: '', excerpt: '', body: '', tags: '', status: 'draft' };

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const PostForm = ({ record, onSubmit, onCancel, submitting, error }) => {
  const isEdit = Boolean(record?.id ?? record?._id);
  const [form, setForm] = useState({
    ...emptyPost,
    ...record,
    tags: Array.isArray(record?.tags) ? record.tags.join(', ') : (record?.tags ?? ''),
  });
  const [cover, setCover] = useState(null);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (cover) {
      const body = new FormData();
      body.append('title', form.title);
      body.append('excerpt', form.excerpt ?? '');
      body.append('body', form.body ?? '');
      body.append('status', form.status);
      if (tags.length) body.append('tags', tags.join(','));
      body.append('coverImage', cover);
      onSubmit(body);
      return;
    }

    onSubmit({
      title: form.title,
      excerpt: form.excerpt || undefined,
      body: form.body,
      status: form.status,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError error={error} />

      <FormField label="Title" name="title" required value={form.title} onChange={update('title')} />

      <FormField
        as="textarea"
        label="Excerpt"
        name="excerpt"
        className="mt-4"
        rows={2}
        value={form.excerpt ?? ''}
        onChange={update('excerpt')}
        hint="The summary shown on the blog index."
      />

      <FormField
        as="textarea"
        label="Body"
        name="body"
        required
        className="mt-4"
        rows={10}
        value={form.body ?? ''}
        onChange={update('body')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Tags"
          name="tags"
          value={form.tags}
          onChange={update('tags')}
          hint="Comma separated, for example property, commercial"
        />
        <FormField
          as="select"
          label="Status"
          name="status"
          value={form.status}
          onChange={update('status')}
          options={[
            { value: 'draft', label: 'Draft — not visible publicly' },
            { value: 'published', label: 'Published — live on the site' },
          ]}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="post-cover" className="block text-sm font-semibold text-portal-ink mb-1.5">
          Cover image
        </label>
        <input
          id="post-cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setCover(event.target.files?.[0] ?? null)}
          className="w-full text-sm text-portal-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-portal-border file:bg-portal-surface file:text-sm file:font-semibold file:text-portal-ink hover:file:border-portal-ink"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create post'}
        </Button>
      </div>
    </form>
  );
};

export const AdminPosts = () => {
  const [status, setStatus] = useState('all');

  const crud = useCrud({
    list: adminGetPosts,
    create: adminCreatePost,
    update: adminUpdatePost,
    remove: adminDeletePost,
    label: 'Post',
    searchFields: ['title', 'excerpt'],
  });

  const visible = crud.filtered.filter((row) => status === 'all' || row.status === status);

  const columns = [
    {
      key: 'title',
      header: 'Post',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.title}</p>
          <p className="text-sm text-portal-muted truncate max-w-md">{row.excerpt}</p>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      hideOnMobile: true,
      render: (row) =>
        Array.isArray(row.tags) && row.tags.length ? (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded bg-portal-raised text-xs text-portal-muted">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          '—'
        ),
    },
    {
      key: 'publishedAt',
      header: 'Published',
      sortable: true,
      sortValue: (row) => new Date(row.publishedAt ?? 0).getTime(),
      render: (row) => <span className="whitespace-nowrap text-portal-muted">{formatDate(row.publishedAt)}</span>,
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Posts"
        description="Articles for the public blog. Drafts stay hidden until published."
        actions={
          <PermissionGate permission={PERMISSIONS.POST_CREATE}>
            <Button onClick={crud.openCreate}>
              <FaPlus aria-hidden="true" className="text-xs" />
              Add post
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search title or excerpt" />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Filter by status"
          options={[
            { value: 'all', label: 'All posts' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Drafts' },
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
          caption="Blog posts"
          columns={columns}
          rows={visible}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          emptyTitle={crud.rows.length ? 'No matching posts' : 'No posts yet'}
          emptyDescription={
            crud.rows.length ? 'Adjust the search or filter to see more.' : 'Write a post to publish on the blog.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.POST_UPDATE}>
                <Button variant="secondary" size="sm" onClick={() => crud.openEdit(row)}>
                  Edit
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.POST_DELETE}>
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
        title={crud.isCreating ? 'Add post' : 'Edit post'}
      >
        {crud.editing !== null && (
          <PostForm
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
        title="Delete post"
        message={`Permanently delete "${crud.deleting?.title ?? 'this post'}"? Setting it back to draft hides it without losing the writing.`}
      />
    </>
  );
};

export default AdminPosts;
