import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetEnquiries,
  adminResolveEnquiry,
  adminDeleteEnquiry,
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
  StatCard,
} from '../../components/Admin/ui/primitives';
import { DataTable } from '../../components/Admin/ui/DataTable';
import { FormError } from '../../components/Admin/ui/FormField';

/**
 * Contact enquiry triage.
 *
 * Messages from the public contact form. Unresolved ones are what the page is
 * for, so they sort to the top by default and the status filter opens on them.
 *
 * The API offers resolve as a one-way transition; there is no reopen route, so
 * none is offered.
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
    : '—';

export const AdminEnquiries = () => {
  const [status, setStatus] = useState('all');
  const [viewing, setViewing] = useState(null);

  const crud = useCrud({
    list: adminGetEnquiries,
    remove: adminDeleteEnquiry,
    label: 'Enquiry',
    searchFields: ['name', 'email', 'subject', 'message'],
  });

  const visible = crud.filtered.filter((row) => {
    if (status === 'unresolved') return row.status !== 'resolved';
    if (status === 'all') return true;
    return row.status === status;
  });

  const unresolved = crud.rows.filter((row) => row.status !== 'resolved').length;

  const columns = [
    {
      key: 'name',
      header: 'From',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className={`text-portal-ink ${row.status !== 'resolved' ? 'font-semibold' : 'font-medium'}`}>
            {row.name}
          </p>
          <p className="text-sm text-portal-muted truncate">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="truncate text-portal-ink">{row.subject || 'No subject'}</p>
          <p className="text-sm text-portal-muted truncate">{row.message}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortable: true,
      sortValue: (row) => new Date(row.createdAt ?? 0).getTime(),
      hideOnMobile: true,
      render: (row) => <span className="whitespace-nowrap text-portal-muted">{formatDateTime(row.createdAt)}</span>,
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Contact enquiries"
        description="Messages submitted through the public contact form."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total enquiries" value={crud.rows.length} />
        <StatCard label="Unresolved" value={unresolved} hint="Awaiting a reply" />
        <StatCard label="Resolved" value={crud.rows.length - unresolved} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search sender, subject or message" />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Filter by status"
          options={[
            { value: 'all', label: 'All enquiries' },
            { value: 'unresolved', label: 'Unresolved' },
            { value: 'resolved', label: 'Resolved' },
          ]}
        />
        <p className="text-sm text-portal-muted ml-auto" aria-live="polite">
          {visible.length} of {crud.rows.length}
        </p>
      </div>

      {crud.formError && (
        <div className="mb-6">
          <FormError error={crud.formError} />
        </div>
      )}

      <SectionCard bodyClassName="p-0">
        <DataTable
          caption="Contact enquiries"
          columns={columns}
          rows={visible}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          initialSort={{ key: 'createdAt', direction: 'desc' }}
          emptyTitle={crud.rows.length ? 'No matching enquiries' : 'No enquiries yet'}
          emptyDescription={
            crud.rows.length
              ? 'Adjust the search or filter to see more.'
              : 'Messages from the public contact form will appear here.'
          }
          actions={(row) => (
            <>
              <Button variant="secondary" size="sm" onClick={() => setViewing(row)}>
                Read
              </Button>

              <PermissionGate permission={PERMISSIONS.CONTACT_ENQUIRY_UPDATE}>
                {row.status !== 'resolved' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      crud.runAction(() => adminResolveEnquiry(row.id ?? row._id), 'Enquiry resolved.')
                    }
                  >
                    Resolve
                  </Button>
                )}
              </PermissionGate>

              <PermissionGate permission={PERMISSIONS.CONTACT_ENQUIRY_DELETE}>
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
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing?.subject || 'Enquiry'}
        footer={
          viewing && (
            <>
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
              <a href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject ?? '')}`}>
                <Button>Reply by email</Button>
              </a>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-portal-border">
              <div className="min-w-0">
                <p className="font-semibold text-portal-ink">{viewing.name}</p>
                <p className="text-sm text-portal-muted">{viewing.email}</p>
                {viewing.phone && <p className="text-sm text-portal-muted">{viewing.phone}</p>}
              </div>
              <div className="ml-auto text-right">
                <StatusBadge status={viewing.status} />
                <p className="mt-1 text-xs text-portal-subtle">{formatDateTime(viewing.createdAt)}</p>
              </div>
            </div>

            {/* whitespace-pre-wrap keeps the sender's paragraph breaks, which a
                plain render would collapse into one block. */}
            <p className="text-sm text-portal-ink leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        onCancel={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        loading={crud.submitting}
        title="Delete enquiry"
        message={`Permanently delete the enquiry from ${crud.deleting?.name ?? 'this sender'}? This cannot be undone.`}
      />
    </>
  );
};

export default AdminEnquiries;
